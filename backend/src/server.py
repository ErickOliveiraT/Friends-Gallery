from flask import Flask, json, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

cred = credentials.Certificate("./firebase/friends-gallery.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
photosRef = db.collection('photos')

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return 'Hello!', 200

@app.route('/approve', methods=['POST'])
def approve():
    content = request.json
    if not 'photo_id' in content:
        return 'You must provide photo_id', 400
    photo_id = content['photo_id']
    if not 'action' in content:
        return 'You must provide action (approve or reject)', 400
    action = content['action']
    if action != 'approve' and action != 'reject':
        return 'Action must be approve ou reject', 400
    photo = photosRef.document(photo_id).get()
    if photo.exists:
        photo = photo.to_dict()
        if action == 'approve':
            photo['status'] = 'approved'
        else:
            photo['status'] = 'rejected'
        photosRef.document(photo_id).set(photo)
        return jsonify(photo)
    else:
        return 'Photo not found', 404

@app.route('/likes', methods=['POST'])
def likes():
    content = request.json
    if not 'photo_id' in content:
        return 'You must provide photo_id', 400
    if not 'user' in content:
        return 'You must provide user', 400
    photo_id = content['photo_id']
    user = content['user']
    photo = photosRef.document(photo_id).get()
    if photo.exists:
        photo = photo.to_dict()
        photo['liked_by'].append(user)
        photo['likes_count'] = photo['likes_count'] + 1
        photosRef.document(photo_id).set(photo)
        return jsonify(photo)
    else:
        return 'Photo not found', 404

@app.route('/comments', methods=['GET', 'POST'])
def comments():
    if request.method == 'POST':
        content = request.json
        if not 'photo_id' in content:
            return 'You must provide photo_id', 400
        if not 'user' in content:
            return 'You must provide user', 400
        if not 'text' in content:
            return 'You must provide text', 400
        photo_id = content['photo_id']
        user = content['user']
        text = content['text']
        photo = photosRef.document(photo_id).get()
        if photo.exists:
            photo = photo.to_dict()
            comment = {
                'user': user,
                'text': text,
                'created_at': datetime.now()
            }
            photo['comments'].append(comment)
            photosRef.document(photo_id).set(photo)
            return jsonify(photo['comments'])
        else:
            return 'Photo not found', 404
    if request.method == 'GET':
        if 'photo_id' in request.args:
            photo_id = request.args['photo_id']
            photo = photosRef.document(photo_id).get()
            if photo.exists:
                photo = photo.to_dict()
                return jsonify(photo['comments'])
            else:
                return 'Photo not found', 404
        else:
            return 'Error: Please specify a photo_id', 400


@app.route('/photos', methods=['GET', 'POST'])
def photos():
    if request.method == 'GET':
        content = request.json
        if not 'user' in content:
            return 'You must provide user', 400
        user = content['user']
        if (user == 'admin'):
            photos = photosRef.stream()
        else:
            photos = photosRef.where('status','==','approved').stream()
        response_data = []
        for photo in photos:
            response_data.append(photo.to_dict())
        return jsonify(response_data)
    if request.method == 'POST':
        content = request.json
        if not 'photo_id' in content:
            return 'You must provide photo_id', 400
        if not 'contentType' in content:
            return 'You must provide contentType', 400
        if not 'fullsize' in content:
            return 'You must provide fullsize', 400
        if not 'uploaded_by' in content:
            return 'You must provide uploaded_by', 400
        id = content['photo_id']
        contentType = content['contentType']
        fullsize = content['fullsize']
        uploaded_by = content['uploaded_by']
        status = 'pending'
        if (uploaded_by == 'admin'):
            status = 'approved'
        photo = {
            'id': id,
            'contentType': contentType,
            'fullsize': fullsize,
            'uploaded_by': uploaded_by,
            'status': status,
            'likes_count': 0,
            'liked_by': [],
            'comments': [],
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        photosRef.document(id).set(photo)
        return jsonify(photo)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)