"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

#Security
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = list(map(lambda x: x.serialize(), users))
    return jsonify(users), 200



@api.route('/register', methods=['POST'])
def create_user():
    db.session.begin()

    request_body = request.get_json()
    if not request_body:
        return jsonify({"msg": "No data provided"}), 400

    avatar = request_body.get('avatar')
    name = request_body.get('name')
    surname = request_body.get('surname')
    username = request_body.get('username')
    password = request_body.get('password')

    # Validation of Existence
    if not name or not surname:
        return jsonify({"msg": "Name and Surname are required"}), 400
    
    if not username:
        return jsonify({'msg': 'username required'}), 400
    
    if not password:
        return jsonify({'msg': 'password required'}), 400
    
    # Validation of Length
    if not 3 <= len(username) <= 20:
        return jsonify({"msg": "Username must be between 3 and 20 characters"}), 400

    if not 5 <= len(password) <= 10:
        return jsonify({"msg": "Password must be between 5 and 10 characters"}), 400

    if not 3 <= len(name) <= 20:
        return jsonify({"msg": "Name must be between 3 and 20 characters"}), 400

    if not 3 <= len(surname) <= 20:
        return jsonify({"msg": "Surname must be between 3 and 20 characters"}), 400

    # Validation of user Existing already
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
         return jsonify({'msg': 'Username already exists'}), 409
    
    password_in_bytes = bytes(password, 'utf-8')

    # Generating Salt
    salt = bcrypt.gensalt()

    # Hashing Password
    hash_password = bcrypt.hashpw(    
        password=password_in_bytes,
        salt=salt
    )

    check = bcrypt.checkpw(
            password = password_in_bytes,
            hashed_password = hash_password
        )

    new_user = User(
        avatar=avatar,
        name=name,
        surname=surname,
        username=username,
        password=hash_password.decode('utf-8'),
    )


    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify([new_user.serialize(), {"hash": hash_password.decode('utf-8'), "salt": salt.decode('utf-8'), "check":check}]), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error creating user", "error": str(e)}), 400



@api.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({'msg': 'email and password required'}), 400
    
    user = User.query.filter_by(username = username).one_or_none()
    
    if user != None:
        check = bcrypt.checkpw(bytes(password, 'utf-8'), bytes(user.password, 'utf-8'))
        if check:
            access_token = create_access_token(identity=username)
            return jsonify({'token': access_token, 'identity': user.serialize()}), 200
        else:
            return jsonify({'msg': 'wrong password'}) , 404
    else:
        return jsonify({'msg': 'user not found'}), 404


@api.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    
    posts_list = [post.serialize() for post in posts]
    
    return jsonify(posts_list), 200


@api.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    current_user = get_jwt_identity()
    
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    user = User.query.filter_by(username = current_user).one_or_none()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user in post.likes:
        return jsonify({"msg": "Already liked this post"}), 400

    post.likes.append(user)
    db.session.commit()

    return jsonify({"msg": "Post liked successfully"}), 200


@api.route('/posts/<int:post_id>/unlike', methods=['POST'])
@jwt_required()
def unlike_post(post_id):
    current_user = get_jwt_identity()
    
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    user = User.query.filter_by(username = current_user).one_or_none()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user not in post.likes:
        return jsonify({"msg": "Like not found"}), 400

    post.likes.remove(user)
    db.session.commit()

    return jsonify({"msg": "Post unliked successfully"}), 200

@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    current_user = get_jwt_identity()

    data = request.get_json()

    if not all(k in data for k in ("image", "message", "location", "status")):
        return jsonify({"msg": "Missing fields"}), 400

    image = data.get('image')
    message = data.get('message')
    location = data.get('location')
    status = data.get('status')

    print("AAAAAAAAAAAAAAA",current_user)
    author = User.query.filter_by(username=current_user).one_or_none()

    if not author:
        return jsonify({"msg": "User not found"}), 404

    new_post = Post(
        image=image,
        message=message,
        location=location,
        status=status,
        author_id=author.id
    )

    db.session.add(new_post)
    author.publish_count += 1
    db.session.commit()

    return jsonify(new_post.serialize()), 201
