import React from 'react';

const SocialMediaIcons = () => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {/* Twitter/X */}
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-3xl">
        <i className="fab fa-twitter"></i>
      </a>

      {/* Instagram */}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 text-3xl">
        <i className="fab fa-instagram"></i>
      </a>

      {/* Gmail */}
      <a href="https://gmail.com" target="_blank" rel="noopener noreferrer" className="text-red-500 text-3xl">
        <i className="fas fa-envelope"></i>
      </a>
    </div>
  );
};

export default SocialMediaIcons;
