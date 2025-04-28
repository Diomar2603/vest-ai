from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote
import time
from dotenv import load_dotenv
import os
from openai import OpenAI
from threading import Thread
import tempfile


load_dotenv()
api_key = os.getenv('gemini_key')
open_ai_key = os.getenv('openai_key')


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)
client_openai = OpenAI(api_key=open_ai_key)

class SearcherClothes() :
    def __init__(self,params):
        
        #Separação do dicionario
        self.color = params.get('preferredColors','Sem cor especifica')
        self.size = params.get('clothingSize', 'Sem tamanho especifico')
        self.fit_pref = params.get('fitPreference', 'Sem ajuste especifico')
        self.style = params.get('dressingStyle', 'Sem estilo especifico')
        self.has_obesity = params.get('hasObesity', False)
        self.ethnicity = params.get('ethnicity','Sem etnia especifica')
        self.age = params.get('age','Sem idade especifica')
        self.gender = params.get('gender','Sem genero especifico')
        self.user_message = params.get('user_message',None)

        

        if self.has_obesity:
            self.text_obesity = "que tenha obesidade"
        else:
            self.text_obesity = "que não tenha obesidade"
            
        if type(self.color) == list:
            self.color = self.list_to_text(a=self.color)

        if type(self.style) == list:
            self.style = self.list_to_text(a=self.style)

        if int(self.age) < 15:
            self.age_classification = 'Criança'
        elif int(self.age) < 60:
            self.age_classification = 'Não considerar relevante'
        else:
            self.age_classification = 'Idoso'

        #Set para o selenium      
       # self.chrome_options = Options()
        #self.chrome_options.add_argument("--headless")
        #self.chrome_options.add_argument("--disable-gpu")
        #self.chrome_options.add_argument("--window-size=1920,1080")
        #self.chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        #self.images = []

        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless=new")  # Modo headless atualizado
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        # Diretório temporário exclusivo para evitar conflito
        temp_dir = tempfile.mkdtemp()
        self.chrome_options.add_argument(f"--user-data-dir={temp_dir}")
        self.images = []


    """Transforma a lista em texto com os elementos separados por virgula"""
    def list_to_text(self, a:list) -> str:

        if len(a) == 1:
            return a[0]
        return f"{', '.join(a[:-1])} e {a[-1]}"
    

    def identify_clothes(self) -> str:
        
        # Gera a query de busca usando o LLM
        response_query = self.generate_search_query()
        code = response_query['statusCode']
        search_query = response_query['body']

        print("Iniciou")
        if code != 200:
            return response_query
        
        print(f"[DEBUG] Consulta gerada para o Pinterest: {search_query}")

        
        response_images = self.get_pinterest_images(search_query)

        code = response_images['statusCode']
        
        if code != 200:
            return response_images
        images = response_images['body']
        print(f"Imagens {images}")
        
        if not images or images[0] == "Nenhuma imagem encontrada":
            return response_images
        
        return {'body':images,"statusCode":200}


    def generate_search_query(self):
                
        """Gera a query de busca usando o LLM"""

        template = """
                        Você é um assistente de moda especializado em gerar pesquisas otimizadas para encontrar imagens de roupas no Pinterest.

                        Com base nas preferências detalhadas abaixo, gere uma **única frase de busca**, altamente específica, para ser usada diretamente no campo de pesquisa do Pinterest. 

                        ⚠️ É fundamental que o usuário se identifique com as pessoas que aparecem nas imagens — considere com atenção **etnia**, **gênero**, **tipo de corpo** (como sobrepeso), **idade**, e **preferência de caimento**. A busca deve refletir **quem está vestindo** as roupas, não apenas o estilo em si.

                        ### Preferências do usuário:
                        - Estilo desejado: {style}
                        - Etnia: {ethnicity}
                        - Gênero: {gender}
                        - Sobrepeso/obesidade: {has_obesity}
                        - Grupo de idade: {age_classification}
                        - Preferência de ajuste (fit): {fit_pref}
                        - Cores preferidas: {color}

                        """

        if self.user_message:
                 template += f"""O usuário expressou o seguinte desejo específico: "{self.user_message}". Use este desejo como foco principal da busca, respeitando também todas as preferências acima."""
        
        template += """🔍 Responda com **apenas a frase de busca ideal** (sem explicações ou pontuação extra), formatada como ela deveria ser digitada no campo de busca do Pinterest. Use **palavras-chave que otimizem os resultados** e **respeite todos os critérios acima com equilíbrio e naturalidade**."""
        prompt_template = PromptTemplate(
            input_variables=["style", "fit_preference", "color", "ethnicity", "has_obesity","age_classification"],
            template = template
            
        )
        try:
            chain = LLMChain(llm=llm, prompt=prompt_template)
            return {'body':chain.run({
                "style": self.style,
                "ethnicity": self.ethnicity,
                "gender":self.gender,
                "has_obesity": self.text_obesity,
                "age_classification":self.age_classification,
                "color":self.color,
                "fit_pref": self.fit_pref
            }).strip(),'statusCode':200}
        except Exception as e:
            print(f"Exception {str(e)}")
            return {"error":'To try connect with Gemini',"statusCode":503}


    def get_pinterest_images(self, query, max_images=2):
        
        driver = webdriver.Chrome(options=self.chrome_options)
        
        try:
            url = f"https://br.pinterest.com/search/pins/?q={quote(query)}&rs=typed"
            print(f"[DEBUG] Acessando URL: {url}")
            driver.get(url)
            
            # Espera o conteúdo carregar
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "//img[contains(@src, 'pinimg.com')]"))
            )
            
            # Rola a página para carregar mais imagens
            for _ in range(2):
                driver.execute_script("window.scrollBy(0, 1000)")
                time.sleep(1.5)  # Aumentei o tempo de espera
                
                # Verifica se já tem imagens suficientes

                current_images = driver.find_elements(By.XPATH, "//img[contains(@src, 'pinimg.com')]")
                if len(current_images) >= max_images:
                    break
            
          
            
            # Coleta as imagens
            

            #################Distribuição dos elementos
            elements = driver.find_elements(By.XPATH, "//img[contains(@src, 'pinimg.com')]")

            part_size = len(elements) // 4
            remainder = len(elements) % 4
            parts = []
            start = 0

            for i in range(4):
                end = start + part_size + (1 if i < remainder else 0)  
                parts.append(elements[start:end])
                start = end

            #####################################
            driver_threads = []
            for i in range(4):
                t = Thread(target=self.analyze_image_parallel, args=(max_images, query, parts[i]))
                driver_threads.append(t)
                t.start()   

            for t in driver_threads:
                t.join()

            if self.images:
                return {"body":self.images,"statusCode":200}
            else:
                return  {"error": "Images not found","statusCode":404}
        
        except Exception as e:
            print(f"[ERRO] Durante o scraping: {str(e)}")
            return {'error':"Error to try connect with pinterest","statusCode":503}
        
        finally:
            driver.quit()

    def analyze_image_parallel(self,max_images:int,query:str,internet_imgs):

        for img in internet_imgs:
            src = img.get_attribute("src")
            if src and "i.pinimg.com" in src:
                
                clean_src = src.split('?')[0]
                if clean_src not in self.images:
                    
                    match_img = self.analyze_img(query=query,link=clean_src)
                    if match_img:  
                        self.images.append(clean_src)
                        
                    if len(self.images) >= max_images:
                        break
    

    "Analisa se a imagem está de acordo com a pesquisa"
    def analyze_img(self,query,link):        

       
        response = client_openai.chat.completions.create(
            model="gpt-4.1-mini", 
            messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": f"As roupas da imagem corresponde ao que foi buscado na query abaixo ? responda Apenas com Sim ou Não \n {query}"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"{link}",
                    },
                },
            ],
        }],
    )
        

        
        result = response.choices[0].message.content.lower()
        
        if result == "sim" or result == "true":
            return True
        return False 