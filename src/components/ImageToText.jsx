import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { FaCloudUploadAlt } from 'react-icons/fa';

const ImageToText = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadstart = () => {
      setLoading(true);
    };

    reader.onloadend = async () => {
      setImage(reader.result);
      
      try {
        const { data: { text } } = await Tesseract.recognize(
          reader.result,
          'eng'
        );
        setText(text);
        
        // Pass both image and extracted text to parent
        onImageUpload({
          imageUrl: reader.result,
          extractedText: text
        });
      } catch (error) {
        console.error('Error processing image:', error);
        setText('Could not extract text from image');
        onImageUpload({
          imageUrl: reader.result,
          extractedText: 'Could not extract text from image'
        });
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="relative">
        <input 
          type="file" 
          id="image-upload"
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden"
        />
        <label 
          htmlFor="image-upload" 
          className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer 
            transition duration-300 ease-in-out
            hover:border-blue-500 hover:bg-blue-50
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaCloudUploadAlt className="mr-2 text-2xl text-gray-500" />
          <span className="text-gray-600">
            {loading ? 'Processing...' : 'Upload Image for Text Extraction'}
          </span>
        </label>
      </div>
      
      {loading && (
        <div className="mt-2 text-center text-blue-500 animate-pulse">
          Extracting text from image...
        </div>
      )}
    </div>
  );
};

export default ImageToText;
