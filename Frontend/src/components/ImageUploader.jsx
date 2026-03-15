import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { useCatererAuth } from '../context/CatererAuthContext';
import Loader from './Loader';

const ImageUploader = ({ currentImages = [], currentThumbnail = '', onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const { caterer, updateProfile } = useCatererAuth();

  const uploadFileToImageKit = async (file, folder = 'gallery') => {
    const authRes = await api.get('/upload/auth');
    const { token, expire, signature, publicKey } = authRes.data;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', publicKey);
    formData.append('signature', signature);
    formData.append('expire', expire);
    formData.append('token', token);
    formData.append('folder', `/caterers/${caterer?.slug || 'gallery'}/${folder}`);
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Upload failed');
    return result.url;
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    setError('');
    try {
      const url = await uploadFileToImageKit(file, 'thumbnail');
      await updateProfile({ image: url });
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  const setAsThumbnail = async (url) => {
    try {
      await updateProfile({ image: url });
      setError('');
    } catch (err) {
      setError('Failed to set thumbnail');
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (currentImages.length + files.length > 10) {
      setError('You can only upload up to 10 images maximum in your gallery.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToImageKit(files[i]);
        uploadedUrls.push(url);
      }

      const newImagesList = [...currentImages, ...uploadedUrls];
      await updateProfile({ images: newImagesList });
      if (onUploadSuccess) onUploadSuccess(newImagesList);
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
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

  const thumbnail = currentThumbnail || caterer?.image || '';

  return (
    <div>
      {/* Card thumbnail (shown on listing cards) */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Card thumbnail</h2>
        <p className="text-sm text-gray-600 mb-4">This image is shown on your card in the caterer listing. Clear and high-quality works best.</p>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 shadow-sm">
            {thumbnail ? (
              <img src={thumbnail} alt="Card thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm font-medium">No thumbnail</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={thumbInputRef}
              onChange={handleThumbnailUpload}
            />
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              disabled={uploadingThumb}
              className="px-4 py-2 bg-amber-400 text-gray-900 text-sm font-semibold rounded-lg hover:bg-amber-500 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {uploadingThumb ? (
                <Loader className="h-4 w-4" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              )}
              {uploadingThumb ? 'Uploading...' : 'Upload thumbnail'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Image Gallery ({currentImages.length}/10)</h2>
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={uploading || currentImages.length >= 10}
          className="px-4 py-2 bg-amber-400 text-gray-900 text-sm font-semibold rounded-lg hover:bg-amber-500 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <Loader className="h-4 w-4" />
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
        <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-3 bg-red-50 text-red-700 border border-red-200">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      {currentImages.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
           <div className="w-16 h-16 mx-auto mb-4 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center">
             <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
           <p className="text-gray-700 font-medium tracking-wide">No images in your gallery yet.</p>
           <p className="text-sm text-gray-500 mt-2">Upload up to 10 images showing your food, setups, and events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentImages.map((imgUrl, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 shadow-sm bg-gray-100">
              <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setAsThumbnail(imgUrl)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold rounded-lg shadow-lg"
                  title="Use as card thumbnail"
                >
                  Set as thumbnail
                </button>
                <button 
                  onClick={() => handleDeleteImage(imgUrl)}
                  className="w-10 h-10 bg-white hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors border border-gray-200"
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
  currentThumbnail: PropTypes.string,
  onUploadSuccess: PropTypes.func
};

export default ImageUploader;
