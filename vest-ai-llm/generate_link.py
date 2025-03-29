from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
import requests
from bs4 import BeautifulSoup
from langchain.tools import tool
from urllib.parse import quote_plus

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key='', temperature=0.7)

class SearcherClothes():
    def identify_clothes(self, estilo: str, tamanho: str, tipo: str, cor: str, etnia: str, genero: str) -> str:
        """
        Recebe as preferências do usuário e retorna links de imagens de roupas no Pinterest que combinem com os critérios informados.
        """
        
       
        prompt_template = PromptTemplate(
            input_variables=["estilo", "tamanho","genero", "tipo", "cor", "etnia"],
            template="""
                        Você é um assistente de moda especializado em encontrar roupas no Pinterest que combinem com as preferências do usuário.

                        Com base nas informações abaixo, gere uma descrição em português que represente o que o usuário está procurando. 
                        A descrição será usada para fazer uma busca no Pinterest, então deve ser clara, objetiva e visual.

                        Informações:
                        - Estilo de roupa: {estilo}
                        - Tamanho: {tamanho}
                        - genero: {genero}
                        - Tipo de peça: {tipo}
                        - Cor desejada: {cor}
                        - Etnia da pessoa: {etnia} (a imagem deve ter pessoas etnicamente semelhantes vestindo a roupa)

                        Retorne apenas a frase descritiva da busca, sem explicações adicionais.
                        """
        )
        chain = LLMChain(llm=llm, prompt=prompt_template)
        search_query = chain.run({
            "estilo": estilo,
            "tamanho": tamanho,
            "genero": genero,
            "tipo": tipo,
            "cor": cor,
            "etnia": etnia
        })

        print(f"[DEBUG] Consulta gerada para o Pinterest: {search_query}")

        # 2. Realiza busca no DuckDuckGo focando no Pinterest
        encoded_query = quote_plus(f"{search_query} site:pinterest.com")
        url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
        headers = {
            'User-Agent': 'Mozilla/5.0'
        }

        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        # 3. Extrai links das imagens
        results = []
        for result in soup.find_all('a', {'class': 'result__a'}, limit=5):
            title = result.text.strip()
            link = result.get('href')
            results.append(f"{title}\n{link}\n")

        if not results:
            return "Não encontrei imagens correspondentes à descrição."
        else:
            return "\n".join(results)
        

searcher = SearcherClothes()

estilo = 'classico'
genero = 'masculino'
tam = 'medio'
tipo = 'terno'
cor = 'preto'
etnia = 'Branco'

r = searcher.identify_clothes(estilo=estilo,tamanho=tam,tipo=tipo,cor=cor,etnia=etnia,genero=genero)

print(r)