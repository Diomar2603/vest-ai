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


load_dotenv()
api_key = os.getenv('gemini_key')
open_ai_key = os.getenv('openai_key')


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)
client_openai = OpenAI(api_key=open_ai_key)


class CreateLook():

    def __init__(self,params):

        self.shirt = []
        self.pants = []
        self.accessories = []
        self.shoes = []

        section_map = {
                'camisa': 'shirt',
                'calça': 'pants',
                'acessorios': 'accessories',
                'sapatos': 'shoes'
            }
        
        for i in params:
            section = i['secao'].lower()
            attr = section_map.get(section)
            if attr:
                setattr(self, attr, i['links'])


    def connect_openai(self):
        self.client_openai = OpenAI(api_key=open_ai_key)


    def validation_min_req(self):
        return self.pants and self.shirt
    

    def send_openai(self,template,links):
        response = self.client_openai.chat.completions.create(
            model="gpt-4.1-mini", 
            messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": template},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"{links}",
                    },
                },
            ],
        }],
        )
        response = response.choices[0].message.content

        return response
    

    def genereta_look(self):

        if not (self.validation_min_req()):
            return {"statusCode":400,"error": "Camisa e calça são obrigatórias para montar o look."}
        
        self.connect_openai()

        base_prompt =  f"""Você é um especialista em moda com a missão de olhar o guarda roupa de um usuario 
        e sugerir combinações de roupa consisas e que façam sentido com os gostos do usuario

        As imagens enviadas, conforme especificada, é o guarda roupa do usuario

        Os links Para as imagens de  1 a {len(self.shirt)} são para ser considerada apenas as camisas das imagens
        Os links Para as imagens de {len(self.shirt) + 1} a {len(self.shirt) + len(self.pants)}  são para ser considerada apenas as calças das imagens
        """

        if self.shoes:
            base_prompt += f"""Os links Para as imagens de {len(self.shirt + len(self.pants)) + 1} a {len(self.shirt) + len(self.pants) + len(self.shoes)}  são para ser considerada apenas os calçados das imagens"""

        if self.accessories:
            base_prompt += f"""Os links Para as imagens de {len(self.shirt + len(self.pants)) + len(self.shoes) + 1} a {len(self.shirt) + len(self.pants) + len(self.shoes) + len(self.accessories)}  são para ser considerada apenas os Acessorios das imagens"""

        base_prompt += """Monte looks completos combinando camisas, calças, e se possível, calçados e acessórios, conforme as imagens acima.

            **Importante:**
            - Retorne uma lista de dicionários com os links das roupas.
            - Cada dicionário deve conter as chaves: 'camisa', 'calça', 'sapato' (se houver no guarda roupa), 'acessorio' (se houver no guarda roupa e combinar com o look).
            - O formato deve ser exatamente assim:
            [
            {'camisa': 'link_para_a_camisa', 'calça': 'link_para_a_calça', 'sapato': 'link_para_o_sapato', 'acessorio': 'link_para_o_acessorio'},
            {'camisa': 'link_para_a_camisa2', 'calça': 'link_para_a_calça2', 'sapato': 'link_para_o_sapato2', 'acessorio': 'link_para_o_acessorio2'}
            ]
            - Se não houver sapato ou acessório disponível, omita essas chaves do dicionário.

            RETORNE APENAS O DICIONARIO PURO. NÃO INCLUA QUALQUER EXPLICAÇÃO OU TEXTO EXTRA
        """

        all_clothes = self.shirt + self.pants + self.shoes + self.accessories

        response = self.send_openai(template=base_prompt,links=all_clothes)

        result = response.choices[0].message.content.lower()

        return {"statusCode":200,"body":result}



if __name__ == '__main__':
    lk = CreateLook(params=[{'section':'Calça','links':[1,2,3]}])
    print(f"Links {lk.shoes}")