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

class SearcherClothes():
    def __init__(self):
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    def identify_clothes(self, estilo: str, tamanho: str, tipo: str, cor: str, etnia: str, genero: str) -> str:
        
        # Gera a query de busca usando o LLM
        search_query = self.generate_search_query(estilo, 
                                                  tamanho, 
                                                  genero, 
                                                  tipo, 
                                                  cor, 
                                                  etnia)
        
        print(f"[DEBUG] Consulta gerada para o Pinterest: {search_query}")

        
        images = self.get_pinterest_images(search_query)

        print(f"Imagens {images}")
        
        if not images or images[0] == "Nenhuma imagem encontrada":
            return "Não foi possível encontrar imagens adequadas no Pinterest."
        
        return "\n".join(images)

    def generate_search_query(self, 
                              estilo, 
                              tamanho, 
                              genero, 
                              tipo, 
                              cor, 
                              etnia):
        
        """Gera a query de busca usando o LLM"""
        prompt_template = PromptTemplate(
            input_variables=["estilo", "tamanho", "genero", "tipo", "cor", "etnia"],
            template="""
                    Você é um assistente de moda que ajuda pessoas a encontrar imagens de roupas com base nas preferências abaixo:

                    - Estilo de roupa: {estilo}
                    - Tamanho: {tamanho}
                    - Gênero: {genero}
                    - Tipo de peça: {tipo}
                    - Cor desejada: {cor}
                    - Etnia da pessoa: {etnia}
                    , deixando claro a etnia que está vestindo a roupa
                    Retorne somente a busca a ser feita.
                    """
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        return chain.run({
            "estilo": estilo,
            "tamanho": tamanho,
            "genero": genero,
            "tipo": tipo,
            "cor": cor,
            "etnia": etnia
        }).strip()

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
            
            return images if images else "Nenhuma imagem encontrada"
        
        except Exception as e:
            print(f"[ERRO] Durante o scraping: {str(e)}")
            return ["Erro durante a busca de imagens"]
        
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
    searcher = SearcherClothes()

    # estilo = 'classico'
    # genero = 'masculino'
    # tam = 'medio'
    # tipo = 'terno'
    # cor = 'preto'
    # etnia = 'Branco'

    # r = searcher.identify_clothes(
    #     estilo=estilo,
    #     tamanho=tam,
    #     tipo=tipo,
    #     cor=cor,
    #     etnia=etnia,
    #     genero=genero
    # )

    # print("\nResultados encontrados:")
    # print(r)

    url = 'https://i.pinimg.com/236x/41/db/5e/41db5e605e0523d16b5fac10532d84d8.jpg'
    searcher.dowloads_imgs(link=url)