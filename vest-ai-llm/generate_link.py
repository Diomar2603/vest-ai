from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote_plus
import requests
import time
from PIL import Image
from io import BytesIO

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key='')

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


        if self.has_obesity:
            self.text_obesity = "que não tenha obesidade"
        else:
            self.text_obesity = "que tenha obesidade"

        if type(self.color) == list:
            self.color = self.list_to_text(a=self.color)

        if type(self.style) == list:
            self.style = self.list_to_text(a=self.style)

        #Set para o selenium      
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    
    """Transforma a lista em texto com os elementos separados por virgula"""
    def list_to_text(self, a:list) -> str:

        if len(a) == 1:
            return a[0]
        return f"{', '.join(a[:-1])} e {a[-1]}"
    

    def identify_clothes(self) -> str:
        
        # Gera a query de busca usando o LLM
        code,search_query = self.generate_search_query()
        print("Iniciou")
        if code != 200:
            return code,search_query
        
        print(f"[DEBUG] Consulta gerada para o Pinterest: {search_query}")

        
        code,images = self.get_pinterest_images(search_query)
        if code != 200:
            return code,images

        print(f"Imagens {images}")
        
        if not images or images[0] == "Nenhuma imagem encontrada":
            return 404,{'error':"images not found"}
        
        return 200,{'body':",".join(images)}

    def generate_search_query(self):
                
        """Gera a query de busca usando o LLM"""
        prompt_template = PromptTemplate(
            input_variables=["style", "size", "fit_preference", "color", "ethnicity", "has_obesity","age"],
            template="""
                    Você é um assistente de moda que ajuda pessoas a encontrar imagens de roupas solicitadas no site pinterest, 
                    Com base nas preferências do usuario passadas abaixo:
                    É importante que o usuario se indentifique com quem veste a  roupa apresentada, então leve em consideração etnia, tamanho, etc 

                    Encontre roupas no estilo {style} com pessoas de etnia {ethnicity} usando essas roupas e {has_obesity}, com idade por volta de {age} anos.
                    Que tenha tamanho {size} com ajuste {fit_pref} podendo ter as cores {color}
                    
                    De forma detalhada e respeitando todas as epecificidades acima
                    Retorne somente a sua melhor busca a ser feita, sem justificativas explicações. .
                    """
        )
        try:
            chain = LLMChain(llm=llm, prompt=prompt_template)
            return 200,chain.run({
                "style": self.style,
                "size": self.size,
                "ethnicity": self.ethnicity,
                "has_obesity": self.text_obesity,
                "color":self.color,
                "age": self.age,
                "fit_pref": self.fit_pref
            }).strip()
        except Exception as e:
            print(f"Exception {str(e)}")
            return 503,{"error":'To try connect with Gemini'}

    def get_pinterest_images(self, query, max_images=5):
        
        driver = webdriver.Chrome(options=self.chrome_options)
        
        try:
            url = f"https://www.pinterest.com/search/pins/?q={quote_plus(query)}"
            print(f"[DEBUG] Acessando URL: {url}")
            driver.get(url)
            
            # Espera o conteúdo carregar
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "//img[contains(@src, 'pinimg.com')]"))
            )
            
            # Rola a página para carregar mais imagens
            for _ in range(3):
                driver.execute_script("window.scrollBy(0, 1000)")
                time.sleep(1.5)  # Aumentei o tempo de espera
                
                # Verifica se já tem imagens suficientes
                current_images = driver.find_elements(By.XPATH, "//img[contains(@src, 'pinimg.com')]")
                if len(current_images) >= max_images:
                    break
            
            # Coleta as imagens
            images = []
            for img in driver.find_elements(By.XPATH, "//img[contains(@src, 'pinimg.com')]"):
                src = img.get_attribute("src")
                if src and "i.pinimg.com" in src:
                    
                    clean_src = src.split('?')[0]
                    if clean_src not in images:  
                        images.append(clean_src)
                        if len(images) >= max_images:
                            break
            
            if images:
                return 200, images
            else:
                return 404, {"error": "Images not found"}
        
        except Exception as e:
            print(f"[ERRO] Durante o scraping: {str(e)}")
            return 503,{'error',"Error to try connect with pinterest"}
        
        finally:
            driver.quit()

    def dowloads_imgs(self,
                      link):
        
        response = requests.get(link, stream=True)
        response.raise_for_status()  # Lança uma exceção para erros HTTP
        image = Image.open(BytesIO(response.content))
        print(image.show())
        


# Exemplo de uso
if __name__ == "__main__":
    

    params = {
        "fullName": "Leandro D G Silva",
        "email": "leandrodiomar123@gmail.com",
        "password": "12345678",
        "confirmPassword": "12345678",
        "phoneNumber": "",
        "dressingStyle": [
            "Esportivo",
            "Vintage"
        ],
        "preferredColors": [
            "Preto",
            "Branco",
            "Marrom"
        ],
        "clothingSize": "GG",
        "fitPreference": "Oversized",
        "age": "19",
        "ethnicity": "Preta",
        "hasObesity": False,
        "hobbies": [
            "Leitura",
            "Exercícios físicos",
            "Desenho",
            "Caminhadas",
            "Videogames"
        ],
        "salaryRange": "4"
        }
    searcher = SearcherClothes(params=params)
    r = searcher.identify_clothes()

    print("\nResultados encontrados:")
    print(r)

    # url = 'https://i.pinimg.com/236x/41/db/5e/41db5e605e0523d16b5fac10532d84d8.jpg'
    # searcher.dowloads_imgs(link=url)