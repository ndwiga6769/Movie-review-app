import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  // Fetch featured movies 
  useEffect(() => {
    fetch('/Movies?sortBy=rating&limit=2')
      .then((response) => response.json())
      .then((data) => setFeaturedMovies(data));
  }, []);

  // Fetch top-rated movies 
  useEffect(() => {
    fetch('/Movies')
      .then((response) => response.json())
      .then((data) => setTopRatedMovies(data));
  }, []);

  // Fetch recent user reviews 
  useEffect(() => {
    fetch('/Ratings?sortBy=created_at&limit=2')
      .then((response) => response.json())
      .then((data) => setRecentReviews(data));
  }, []);

  return (
    <div className="home">
      

      <div className="welcome-banner">
        <h2>Discover the Best Movies</h2>
      </div>

      <div className="featured-movies">
      <h3 className="text-center">Featured Movies</h3>
      <div className="movie-posters">
        {featuredMovies.map((movie) => (
          <div key={movie.id} className="carousel-slide">
            <img src={movie.image} alt={movie.name} />
          </div>
        ))}
      </div>  
      </div>

      <div className="top-rated-movies">
      <h3 className="text-center">Top Rated Movies</h3>
      <div className="movie-posters">
        {topRatedMovies.map((movie) => (
          <div key={movie.id} className="movie-poster">
            <img src={movie.image} alt={movie.name} />
          </div>
        ))}
      </div>  
      </div>

      <div className="recent-user-reviews">
      <h3 className="text-center">Recent User Reviews</h3>
        {recentReviews.map((review) => (
          <div key={review.id} className="user-review">
            <div className="user-info">
              {review.user.username} - {review.rating} stars
            </div>
            <div className="review-text">{review.review}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
