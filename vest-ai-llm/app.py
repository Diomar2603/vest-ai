from flask import Flask, request, jsonify
from generate_link import SearcherClothes
from create_look import CreateLook

app = Flask(__name__)


@app.route('/vestAi', methods=['POST'])
def post_api():
    
    params = request.json
    searche_clothes = SearcherClothes(params=params)
    response = searche_clothes.identify_clothes()

    return jsonify(response)

@app.route('/create_look', methods=['POST'])
def post_create_look():
    params = request.json
    create = CreateLook(params)
    response = create.genereta_look()

    return jsonify(response)
    
if __name__ == '__main__':
    app.run(debug=True)