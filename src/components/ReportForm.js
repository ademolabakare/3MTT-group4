import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

const ReportForm = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [agency, setAgency] = useState('');
  const [officialName, setOfficialName] = useState('');
  const [urgency, setUrgency] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e) => {
    const newImages = Array.from(e.target.files);
    if (newImages.length + images.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      return;
    }
    setImages([...images, ...newImages].slice(0, 3));
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (droppedFiles.length + images.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      return;
    }
    
    setImages([...images, ...droppedFiles].slice(0, 3));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('location', location);
    formData.append('issueType', issueType);
    formData.append('description', description);
    formData.append('agency', agency);
    formData.append('officialName', officialName);
    formData.append('urgency', urgency);
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Grid for Issue Type and Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Type
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency Level
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Urgency</option>
            <option value="Extreme">Extreme</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Location Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter street address, city, state"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength="500"
          rows="4"
          placeholder="Provide detailed description of the issue (500 words max)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          required
        />
      </div>

      {/* Agency Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ministry or Agency
        </label>
        <select
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a Ministry or Agency</option>
          <option value="Ministry of Works">Ministry of Works</option>
          <option value="Ministry of Environment">Ministry of Environment</option>
        </select>
      </div>

      {/* Official Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Government Official (Optional)
        </label>
        <input
          type="text"
          value={officialName}
          onChange={(e) => setOfficialName(e.target.value)}
          placeholder="Enter official's name if known"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Images (1-3)
        </label>
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={images.length >= 3}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start space-x-2 text-sm text-gray-500">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>
          The identity of all community agents is anonymous and will never be shared or distributed.
        </p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
};

export default ReportForm;