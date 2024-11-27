import React from "react";
import { FaStar } from "react-icons/fa";
import "./rating.css";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(<FaStar key={i} color={i < rating ? "gold" : "gray"} />);
  }

  return (
    <div className="star-rating">
      <p className="font-normal driver-description">Avaliação: </p>
      <div className="stars">
        <div>{stars}</div>
        <span className="font-smaller">{rating}/5</span>
      </div>
    </div>
  );
};

export default StarRating;
