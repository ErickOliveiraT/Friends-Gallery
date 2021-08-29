import os
from flask import Flask, request, jsonify
from flask_cors import CORS

UPLOAD_FOLDER = './upload'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

@app.route('/', methods=['GET'])
def home():
    test = {'ok':True}
    return jsonify(test)

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'there is no file in form!'
        file = request.files['file']
        path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(path)
        return path

        #return 'ok'
    return False

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)