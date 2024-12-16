import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

const LANGUAGES = {
  'eng': 'English',
  'ara': 'Arabic',
  'fra': 'French',
  'deu': 'German',
  'spa': 'Spanish',
  'chi_sim': 'Simplified Chinese',
  'rus': 'Russian'
};

const ImageToText = ({ onImageUpload }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState('image');

  // const extractPDFText = async (pdfFile) => {
  //   try {
  //     // Create FormData to send the file
  //     const formData = new FormData();
  //     formData.append('pdf', pdfFile);

  //     // Send request to backend API
  //     const response = await axios.post('http://localhost:4000/extract-pdf', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     // Log the response for debugging
  //     console.log('PDF Extraction Response:', response.data);

  //     // Validate the response
  //     if (!response.data.text) {
  //       throw new Error(response.data.error || 'No text could be extracted from the PDF');
  //     }

  //     return response.data;
  //   } catch (err) {
  //     console.error('Backend PDF Extraction Error:', err);
      
  //     // Check if it's an axios error with response
  //     if (err.response) {
  //       throw new Error(
  //         err.response.data.error || 
  //         'Failed to extract text from PDF'
  //       );
  //     }
      
  //     // Generic error handling
  //     throw new Error(err.message || 'Failed to extract text from PDF');
  //   }
  // };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setLoading(true);
    setError(null);
    setText('');
    setConfidence(0);

    try {
      // Determine file type
      const fileType = uploadedFile.type;
      let extractedText = '';
      let imageUrl = null;

      if (fileType.startsWith('image/')) {
        // Image OCR processing
        setFileType('image');
        imageUrl = URL.createObjectURL(uploadedFile);

        const { data: { text, confidence, words } } = await Tesseract.recognize(
          uploadedFile, 
          language,
          { 
            logger: (m) => {
              if (m.status === 'recognizing text') {
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            }
          }
        );

        extractedText = text
          .replace(/\s+/g, ' ')
          .trim();

        setConfidence(confidence || 0);
        setFile(imageUrl);

        onImageUpload({
          imageUrl,
          extractedText,
          language,
          confidence: confidence || 0,
          words: words || []
        });
      } else if (fileType === 'application/pdf') {
        // PDF text extraction via backend
        setFileType('pdf');
        imageUrl = null; // No preview for PDFs
        
        const pdfResult = await extractPDFText(uploadedFile);
        
        extractedText = pdfResult.text;
        
        setText(extractedText);
        setConfidence(pdfResult.confidence || 75);

        onImageUpload({
          imageUrl: null,
          extractedText,
          fileType: 'pdf',
          confidence: pdfResult.confidence || 75,
          pageCount: pdfResult.pageCount
        });
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (err) {
      console.error('File Processing Error:', err);
      setError(err.message || 'Failed to extract text');
      
      onImageUpload({
        imageUrl: null,
        extractedText: '',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-4 dark:bg-gray-800 transition-colors duration-300">
      <div className="flex flex-col space-y-2">
        {/* File Upload */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 
            border-2 border-gray-300 rounded-lg cursor-pointer 
            bg-gray-50 
            dark:bg-gray-700 dark:border-gray-600
            hover:border-blue-500 dark:hover:border-blue-400
            hover:bg-blue-50 dark:hover:bg-blue-900/20
            transition-colors duration-300 
            group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              {fileType === 'image' ? (
                <FaCloudUploadAlt className="w-10 h-10 mb-3 
                  text-gray-400 
                  dark:text-gray-500 
                  group-hover:text-blue-500 
                  dark:group-hover:text-blue-400
                  transition-colors duration-300" />
              ) : (
                <FaFilePdf className="w-10 h-10 mb-3 
                  text-red-400 
                  dark:text-red-500 
                  group-hover:text-red-500 
                  dark:group-hover:text-red-400
                  transition-colors duration-300" />
              )}
              <p className="mb-2 text-sm 
                text-gray-500 
                dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Click to upload
                </span> or drag and drop
              </p>
              <p className="text-xs 
                text-gray-500 
                dark:text-gray-500">
                {fileType === 'image' 
                  ? 'PNG, JPG, or TIFF (MAX. 10MB)' 
                  : 'PDF Files (MAX. 50MB)'}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/tiff, application/pdf"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 bg-red-50 
            dark:text-red-400 dark:bg-red-950/30 
            text-sm mt-2 p-2 rounded 
            transition-colors duration-300">
            {error}
          </div>
        )}

        {/* Confidence Display */}
        {confidence > 0 && (
          <div className="text-sm 
            text-gray-600 
            dark:text-gray-300 
            mt-2 
            transition-colors duration-300">
            Extraction Confidence: {confidence.toFixed(2)}%
          </div>
        )}

        {/* Preview of Extracted Text */}
        {text && (
          <div className="mt-4 p-3 border rounded 
            bg-gray-50 
            dark:bg-gray-700 
            dark:border-gray-600
            transition-colors duration-300">
            <h3 className="font-semibold mb-2 
              text-gray-800 
              dark:text-gray-200">
              Extracted Text:
            </h3>
            <pre className="whitespace-pre-wrap break-words 
              text-gray-700 
              dark:text-gray-300 
              overflow-x-auto">
              {text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToText;
