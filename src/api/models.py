from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    avatar = db.Column(db.String, unique=False, nullable=True)
    publish_count = db.Column(db.Integer, default=0)
    name = db.Column(db.String(20), unique=False, nullable=False)
    surname = db.Column(db.String(20), unique=False, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "username": self.username,
            "avatarurl": self.avatar,
            "publish_count": self.publish_count
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    likes = db.relationship('User', secondary='post_likes', backref='liked_posts')
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    location = db.Column(db.String, nullable=True)
    status = db.Column(db.Integer, nullable=False)

    author = db.relationship('User', backref='posts')

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "message": self.message,
            "likes": [user.username for user in self.likes],
            "author": self.author.username,
            "author_image": self.author.avatar,
            "created_at": self.created_at,
            "location": self.location,
            "status": self.status
        }

post_likes = db.Table('post_likes',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)