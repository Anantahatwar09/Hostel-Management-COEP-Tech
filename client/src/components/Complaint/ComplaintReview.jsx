import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './ComplaintReview.css';
import { FaTrash } from 'react-icons/fa'; // Import trash icon from react-icons/fa

const ComplaintReview = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reports');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleCheckboxChange = async id => {
    try {
      await axios.put(`/api/reports/status/${id}`, { status: 'resolved' });
      setReviews(
        reviews.map(review => {
          if (review._id === id) {
            return { ...review, status: 'resolved' };
          }
          return review;
        }),
      );
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const handleDeleteReview = async id => {
    try {
      await axios.delete(`/api/reports/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="complaint-review-container">
      <header className="complaint-review-heading">Complain Page</header>
      <div className="review-list">
        {reviews.map(review => (
          <div className="review-card" key={review._id}>
            <div
              className="icons"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={review.status === 'resolved'}
                  onChange={() => handleCheckboxChange(review._id)}
                />
              </div>
              <div
                className="delete-icon"
                onClick={() => handleDeleteReview(review._id)}
              >
                <FaTrash />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <h4>Issue: {review.issue}</h4>
              <p>Details: {review.details}</p>
              <p>
                Status: <strong>{review.status}</strong>
              </p>
              <p>Created At: {new Date(review.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(review.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintReview;
