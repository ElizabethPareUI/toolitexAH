import React from 'react';

const Rating = ({ value = 0, text = '', color = '#f8e825' }) => {
  return (
    <div className="rating">
      <span className="material-symbols-outlined" style={{ color }}>
        {value >= 1 ? 'star' : value >= 0.5 ? 'star_half' : 'star_border'}
      </span>
      <span className="material-symbols-outlined" style={{ color }}>
        {value >= 2 ? 'star' : value >= 1.5 ? 'star_half' : 'star_border'}
      </span>
      <span className="material-symbols-outlined" style={{ color }}>
        {value >= 3 ? 'star' : value >= 2.5 ? 'star_half' : 'star_border'}
      </span>
      <span className="material-symbols-outlined" style={{ color }}>
        {value >= 4 ? 'star' : value >= 3.5 ? 'star_half' : 'star_border'}
      </span>
      <span className="material-symbols-outlined" style={{ color }}>
        {value >= 5 ? 'star' : value >= 4.5 ? 'star_half' : 'star_border'}
      </span>
      <span className="ms-1">{text && text}</span>
    </div>
  );
};

export default Rating;
