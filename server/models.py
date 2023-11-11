from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'

    serialize_rules = ('-ratings.movie.ratings', '-genres.movies')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    release_date = db.Column(db.Date)
    description = db.Column(db.Text)

    #a many-to-many relationship with genres
    genres = db.relationship('Genre', secondary='movie_genre_association', back_populates='movies')

    #a one-to-many relationship with ratings
    ratings = db.relationship('Rating', backref='movie')


    
class Genre(db.Model, SerializerMixin):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)

     #a many-to-many relationship with movies
    movies = db.relationship('Movie', secondary='movie_genre_association', back_populates='genres')

class MovieGenreAssociation(db.Model):
    __tablename__ = 'movie_genre_association'

    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), primary_key=True)    

class Rating(db.Model, SerializerMixin):
    __tablename__ = 'ratings'

    serialize_rules = ('-movie.ratings.user.ratings', '-user.ratings')
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-ratings.user.ratings', '-user.ratings')
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)   

    #one-to-many relationship with ratings
    ratings = db.relationship('Rating', backref='user') 

    
