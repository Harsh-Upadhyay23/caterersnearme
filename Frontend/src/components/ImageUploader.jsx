import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { useCatererAuth } from '../context/CatererAuthContext';

const ImageUploader = ({ currentImages = [], onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { caterer, updateProfile } = useCatererAuth();

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these exceeds 10 images
    if (currentImages.length + files.length > 10) {
      setError('You can only upload up to 10 images maximum in your gallery.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 1. Get Auth Params from backend
      const authRes = await api.get('/upload/auth');
      const { token, expire, signature, publicKey } = authRes.data;

      // 2. Upload directly to ImageKit via REST API
      const uploadedUrls = [];

      // Using the public ImageKit REST API endpoint
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('publicKey', publicKey);
        formData.append('signature', signature);
        formData.append('expire', expire);
        formData.append('token', token);
        formData.append('folder', `/caterers/${caterer?.slug || 'gallery'}`);
        
        // Wait, ImageKit public upload endpoint is fixed: https://upload.imagekit.io/api/v1/files/upload
        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (response.ok) {
          uploadedUrls.push(result.url);
        } else {
          throw new Error(result.message || 'ImageKit upload failed');
        }
      }

      // 3. Update Caterer Profile with new images
      const newImagesList = [...currentImages, ...uploadedUrls];
      await updateProfile({ images: newImagesList });
      
      if (onUploadSuccess) {
        onUploadSuccess(newImagesList);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (urlToRemove) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    
    try {
      const newImagesList = currentImages.filter(url => url !== urlToRemove);
      await updateProfile({ images: newImagesList });
      if (onUploadSuccess) {
        onUploadSuccess(newImagesList);
      }
    } catch (err) {
      setError('Failed to remove image');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-white">Image Gallery ({currentImages.length}/10)</h2>
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={uploading || currentImages.length >= 10}
          className="px-4 py-2 bg-amber-400 text-gray-950 text-sm font-semibold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <svg className="animate-spin h-4 w-4 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          )}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-3 bg-red-500/10 text-red-400 border border-red-500/20">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      {currentImages.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
           <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
             <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
           <p className="text-gray-400 font-medium tracking-wide">No images in your gallery yet.</p>
           <p className="text-xs text-gray-500 mt-2">Upload up to 10 images showing your food, setups, and events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentImages.map((imgUrl, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
              <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={() => handleDeleteImage(imgUrl)}
                  className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  title="Remove Image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  currentImages: PropTypes.array,
  onUploadSuccess: PropTypes.func
};

export default ImageUploader;
