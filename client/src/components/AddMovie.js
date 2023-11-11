import React, { useState, useEffect } from 'react';
import './Home.css';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    name: '',
    image: '',
    release_date: '',
    description: '',
    genres: [],
  });

  const [availableGenres, setAvailableGenres] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch available genres from your server and update availableGenres state
    fetch('/Genres')
      .then((response) => response.json())
      .then((data) => {
        setAvailableGenres(data);
      })
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMovie({ ...movie, genres: [...movie.genres, value] });
    } else {
      setMovie({ ...movie, genres: movie.genres.filter((genre) => genre !== value) });
    }
  };

  const handleSave = () => {
    // Implement your save logic here (make a POST request to your API)
    fetch('/Movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Movie saved:', data);
        // Show success message to the user
        setSuccessMessage('Movie saved successfully!');
        // Reset the form
        setMovie({
          name: '',
          image: '',
          release_date: '',
          description: '',
          genres: [],
        });
        // Clear the success message after a few seconds (e.g., 5 seconds)
        setTimeout(() => setSuccessMessage(''), 5000);
      })
      .catch((error) => {
        console.error('Error saving movie:', error);
        // Show an error message to the user if saving fails
        setErrorMessage('Error saving the movie. Please try again.');
      });
  };
  

  return (
    <div className="container">
      <h1>Add a Movie</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form>
        <div className="form-group">
          <label htmlFor="name">Movie Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={movie.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Release Date:</label>
          <input
            type="date"
            id="releaseDate"
            name="release_date" // Correct the name attribute
            value={movie.release_date}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={movie.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={movie.image}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Genres:</label>
          {availableGenres.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                name="genre"
                value={genre.name}
                checked={movie.genres.includes(genre.name)}
                onChange={handleGenreChange}
              />{' '}
              {genre.name}
            </label>
          ))}
        </div>
        <div className="form-group">
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
