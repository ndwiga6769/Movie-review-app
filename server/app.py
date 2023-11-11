#!/usr/bin/env python3

from flask import Flask, jsonify, request, make_response, Response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_cors import CORS

from models import db, Movie, Rating, User, Genre
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from functools import wraps

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Movies.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'said8354' 
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

# Modify the Register class
class Register(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')

        if not email or not password or not username:
            return {'message': 'Email, username, and password are required'}, 400
        if User.query.filter_by(email=email).first():
            return {'message': 'Email is already registered'}, 400

        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password=hashed_password, username=username)
        db.session.add(new_user)
        db.session.commit()

        return {'message': 'Registration successful'}, 201

# User log
class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'], algorithm='HS256')
            return {'token': token}, 200

        return {'message': 'Invalid credentials'}, 401


# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# Protected route
class Protected(Resource):
    @token_required
    def get(self, current_user):
        return jsonify({'user_id': current_user.id, 'email': current_user.email})


class Movies(Resource):

    def get(self):
        Movies = [Movie.to_dict() for Movie in Movie.query.all()]
        return make_response(jsonify(Movies), 200)

    def post(self):
        data = request.get_json()
        # Handle release_date
        release_date_str = data.get('release_date')
        if release_date_str:
            # Convert the date string to a Python date object
            release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
        else:
            release_date = None  # Set to None if no date provided


        new_Movie = Movie(
            name=data['name'],
            image=data['image'],
            release_date=release_date,
            description=data['description'],
        )

        db.session.add(new_Movie)
        db.session.commit()

        return make_response(new_Movie.to_dict(), 201)


api.add_resource(Movies, '/Movies')


class MovieByID(Resource):

    def get(self, id):
        Movie = Movie.query.filter_by(id=id).first().to_dict()
        return make_response(jsonify(Movie), 200)
    
    def patch(self, id):
        data = request.get_json()
        record = Movie.query.filter_by(id=id).first()
        for attr, value in data.items():
            setattr(record, attr, value)

        db.session.add(record)
        db.session.commit()

        response_dict = record.to_dict()

        response = make_response(
            jsonify(response_dict),
            200
        )

        return response
    
    def delete(self, id):

        record = Movie.query.filter_by(id=id).first()

        db.session.delete(record)
        db.session.commit()

        response = make_response("", 204)

        return response



api.add_resource(MovieByID, '/Movies/<int:id>')

class Ratings(Resource):
    @token_required
    def get(self):
        Ratings = [rating.to_dict() for rating in Rating.query.all()]
        return make_response(jsonify(Ratings), 200)
    
    @token_required
    def post(self, current_user):
        data = request.get_json()

        new_Rating = Rating(
            rating=data['rating'],
            review=data['review'],
            user_id=current_user.id,
            movie_id=data.get('movie_id')  # Include the movie ID
        )

        db.session.add(new_Rating)
        db.session.commit()

        # Return the new rating as a dictionary
        return make_response(new_Rating.to_dict(), 201)



class RatingByID(Resource):

    def get(self, id):
        Rating = Rating.query.filter_by(id=id).first().to_dict()
        return make_response(jsonify(Rating), 200)
    
    def patch(self, id):
        data = request.get_json()
        record = Rating.query.filter_by(id=id).first()
        for attr, value in data.items():
            setattr(record, attr, value)

        db.session.add(record)
        db.session.commit()

        response_dict = record.to_dict()

        response = make_response(
            jsonify(response_dict),
            200
        )

        return response
    
    def delete(self, id):

        record = Rating.query.filter_by(id=id).first()

        db.session.delete(record)
        db.session.commit()

        response = make_response("", 204)

        return response

api.add_resource(RatingByID, '/Ratings/<int:id>')

#users endpoints
class Users(Resource):

    def get(self):
        Users = [User.to_dict() for User in User.query.all()]
        return make_response(jsonify(Users), 200)

api.add_resource(Users, '/Users')

class UserByID(Resource):

    def get(self, id):
        User = User.query.filter_by(id=id).first().to_dict()
        return make_response(jsonify(User), 200)
    
api.add_resource(UserByID, '/Users/<int:id>')

#genre endpoints
class Genres(Resource):

    def get(self):
        Genres = [Genre.to_dict() for Genre in Genre.query.all()]
        return make_response(jsonify(Genres), 200)

api.add_resource(Genres, '/Genres')

api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Protected, '/protected')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
