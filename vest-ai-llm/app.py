from flask import Flask, request, jsonify

app = Flask(__name__)

""" 

Parametros --

style
skin_color 
prefered_color
size


"""

@app.route('/vestAi', methods=['POST'])
def post_api():
    
    dados = request.json
    parametro1 = dados.get('parametro1')
    parametro2 = dados.get('parametro2')
    
    resultado = int(parametro1) + int(parametro2)

    {"response_code":"200", "body":{"result":str(resultado)}}
    return jsonify(resultado)

if __name__ == '__main__':
    app.run(debug=True)