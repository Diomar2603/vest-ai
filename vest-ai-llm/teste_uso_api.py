import requests

url = "http://localhost:5000/vestAi" 

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
    "gender":"Masculino",
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

response = requests.post(url, json=params).json()

if response['statusCode'] == 200:
    print(response['body'])

else:
    print(response['error'],response['statusCode'])