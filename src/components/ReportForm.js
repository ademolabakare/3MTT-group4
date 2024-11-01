import React, { useState } from 'react';

const ReportForm = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [agency, setAgency] = useState('');
  const [officialName, setOfficialName] = useState('');
  const [urgency, setUrgency] = useState(''); // New urgency input

  // Handle image upload
  const handleImageUpload = (e) => {
    const newImages = Array.from(e.target.files);
    if (newImages.length + images.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      return;
    }
    setImages([...images, ...newImages].slice(0, 3)); // Limit to 3 images
  };

  // Remove image
  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('location', location);
    formData.append('issueType', issueType);
    formData.append('description', description);
    formData.append('agency', agency);
    formData.append('officialName', officialName);
    formData.append('urgency', urgency); // Adding urgency to form data

    images.forEach((image, index) => {
      formData.append(`image${index}`, image);  // Attach each image
    });

    onSubmit(formData);  // Submit form data to parent
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      {/* Issue Type Input */}
      <div className="grid grid-cols-2 gap-4">
  <div className="input-row">
    <label className="block text-sm font-medium text-gray-700">Issue Type:</label>
    <select
      value={issueType}
      onChange={(e) => setIssueType(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    >
      <option value="">Select an Issue</option>
      <option value="Sanitation">Sanitation</option>
      <option value="Environmental">Environmental</option>
      <option value="Road Repair">Road Repair</option>
      <option value="Transportation">Transportation</option>
      <option value="Maintenance">Maintenance</option>
      <option value="Human Activities">Human Activities</option>
      <option value="Others">Others</option>
    </select>
  </div>

  <div className="input-row">
    <label className="block text-sm font-medium text-gray-700">Urgency:</label>
    <select
      value={urgency}
      onChange={(e) => setUrgency(e.target.value)}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    >
      <option value="">Select Urgency</option>
      <option value="Extreme">Extreme</option>
      <option value="Moderate">Moderate</option>
      <option value="Low">Low</option>
    </select>
  </div>
</div>


      {/* Location and Urgency in one row */}
      
       
          <label>Location (Street, City, State):</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
      
     


      {/* Description Input */}
      <label>Description (500 words max):</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength="500"
        required
      />

      {/* Ministry or Agency */}
      <label>Ministry or Agency:</label>
      <select value={agency} onChange={(e) => setAgency(e.target.value)} required>
        <option value="">Select a Ministry or Agency</option>
        <option value="Ministry of Works">Ministry of Works</option>
        <option value="Ministry of Environment">Ministry of Environment</option>
      </select>

      {/* Government Official */}
      <label>Government Official (Optional):</label>
      <input
        type="text"
        value={officialName}
        onChange={(e) => setOfficialName(e.target.value)}
      />

      {/* Image Upload at the bottom */}
      <label>Upload Images (1-3):</label>
   <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        disabled={images.length >= 3}
      />
      <div className="image-previews">
        {images.length > 0 &&
          images.map((img, index) => (
            <div key={index} className="image-container">
              <img
                src={URL.createObjectURL(img)}
                alt={`Preview ${index + 1}`}
                className="image-preview"
              />
              <button className="remove-image-btn" onClick={() => handleRemoveImage(index)}>×</button>
            </div>
          ))}
      </div>
    </div>

      {/* Disclaimer */}
      <p className="disclaimer">
        The identity of all community agents is anonymous and will never be shared or distributed.
      </p>

      <button type="submit" className="submit-button">Submit Report</button>
    </form>
  );
};

export default ReportForm;
