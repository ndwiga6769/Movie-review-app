import React, { useState } from 'react';
//import './RateAndReviewSection.css';

const RateAndReviewSection = () => {
  const userToken = localStorage.getItem('token'); // Retrieve the user token from localStorage

  const [rating, setRating] = useState(0); // Initialize with 0 stars
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    if (!userToken) {
      setMessage('Please log in to submit a rating and review.');
      return;
    }

    fetch('/Ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ rating, review }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 201) {
          console.log('Rating and Review submitted successfully:', data);
          setMessage('Rating and Review submitted successfully.');
        } else {
          console.error('Error submitting Rating and Review:', data);
          setMessage('Error submitting Rating and Review.');
        }
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
        setMessage('Error submitting Rating and Review.');
      });

    setReview('');
    setRating(0);
  };

  return (
    <div className="rate-and-review-section">
      <h3>Rate and Review Movie</h3>
      <div>
        Your Rating:
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'selected' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div>
        Your Review:
        <textarea
          value={review}
          onChange={handleReviewChange}
          rows={4}
          cols={50}
          placeholder="Write your review here"
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RateAndReviewSection;
