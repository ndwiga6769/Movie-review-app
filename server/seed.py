#!/usr/bin/env python3

from app import app
from models import db, Movie, Genre, MovieGenreAssociation, User, Rating
from datetime import datetime


with app.app_context():

   # Delete existing data from all tables
    db.session.query(Movie).delete()
    db.session.query(Rating).delete()
    db.session.query(User).delete()
    db.session.query(Genre).delete()
    db.session.query(MovieGenreAssociation).delete()


    # Add genre records
    action = Genre(
        name="Action"
    )

    comedy = Genre(
        name="Comedy"
    )

    db.session.add_all([action, comedy])
    db.session.commit()



    #add movie records
    hocus = Movie(
        id=1,
        name="hocus",
        image="./images/hocus.jpeg",
        release_date=datetime(2023, 1, 1),
        description= "This is the description of Movie 1."
    )

    animal = Movie(
        id=2,
        name="animal",
        image="./images/animal.jpeg",
        release_date= datetime(2023, 2, 15),
        description= "This is the description of Movie 2."
    )

    db.session.add_all([hocus, animal])

    # Associate genres with the movies
    hocus.genres.append(action)
    hocus.genres.append(comedy)

    animal.genres.append(action)

    # Add rating records
    user1 = User(
        id=1,
        username="user1",
        email="shallon@gmail.com",
        password="password1"
    )

    user2 = User(
        id=2,
        username="user2",
        email="joedoe@gmail.com",
        password="password2"
    )

    db.session.add_all([user1, user2])

    rating1 = Rating(
        user_id=user1.id,
        movie_id=hocus.id,
        rating=4,
        review="Good movie."
    )

    rating2 = Rating(
        user_id=user2.id,
        movie_id=hocus.id,
        rating=5,
        review="Excellent movie."
    )

    rating3 = Rating(
        user_id=user1.id,
        movie_id=animal.id,
        rating=4,
        review="Good movie."
    )

    rating4 = Rating(
        user_id=user2.id,
        movie_id=animal.id,
        rating=5,
        review="Excellent movie."
    )

    db.session.add_all([rating1, rating2, rating3, rating4])

    
   

    db.session.commit()
