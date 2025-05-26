// frontend/src/components/Creator/UploadVideo.jsx
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'; // auth is not directly needed here if using AuthContext
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- USE THIS

const UploadVideo = () => {
    const { currentUser } = useAuth(); // <-- Get currentUser from AuthContext
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null); // Now considered required by rules

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // No need for a separate onAuthStateChanged listener here,
    // as AuthContext provides the currentUser which includes role and displayName
    // from Firestore thanks to your AuthContext setup.

    useEffect(() => {
        // Redirect if currentUser is not available or doesn't have a role (should be handled by ProtectedRoute, but good safeguard)
        if (!currentUser || !currentUser.uid) {
            console.warn("UploadVideo: currentUser not available. Redirecting to login.");
            navigate('/login');
        } else if (currentUser.role !== 'creator') {
            console.warn(`UploadVideo: User role is '${currentUser.role}', not 'creator'. Redirecting.`);
            // navigate('/'); // Or to an unauthorized page
            // ProtectedRoute should ideally prevent this component from rendering for non-creators.
            // Setting an error message might be more appropriate if this component somehow renders.
            setError("You do not have permission to upload videos. Your role: " + currentUser.role);
        }
    }, [currentUser, navigate]);


    const handleVideoFileChange = (e) => {
        if (e.target.files[0]) setVideoFile(e.target.files[0]);
        setError(''); setSuccessMessage('');
    };

    const handleThumbnailFileChange = (e) => {
        if (e.target.files[0]) setThumbnailFile(e.target.files[0]);
        setError(''); setSuccessMessage('');
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setVideoFile(null);
        setThumbnailFile(null);
        setUploadProgress(0);
        if (document.getElementById('video-file-input')) document.getElementById('video-file-input').value = null;
        if (document.getElementById('thumbnail-file-input')) document.getElementById('thumbnail-file-input').value = null;
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validations based on your Firestore rules
        if (!currentUser || !currentUser.uid || currentUser.role !== 'creator') {
            setError('Authentication error or insufficient permissions. Please re-login or contact support.');
            return;
        }
        if (!currentUser.displayName) {
            setError('Your profile is missing a display name. Please update your profile before uploading.');
            // You might want to navigate them to a profile edit page if you have one.
            return;
        }
        if (!videoFile) {
            setError('Video file is required.');
            return;
        }
        if (!thumbnailFile) { // Your Firestore rule: `request.resource.data.thumbnailUrl is string` implies it's required
            setError('Thumbnail image is required.');
            return;
        }
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            setError('Please enter a valid non-negative price (e.g., 10.99 or 0 for free).');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        let videoUrl = '';
        let thumbnailUrl = '';

        try {
            // 1. Upload Thumbnail File
            const thumbnailStorageRef = ref(storage, `thumbnails/${currentUser.uid}/${Date.now()}_${thumbnailFile.name}`);
            const thumbnailUploadTask = uploadBytesResumable(thumbnailStorageRef, thumbnailFile);
            
            await new Promise((resolve, reject) => {
                thumbnailUploadTask.on('state_changed',
                    () => { /* Optional: progress for thumbnail */ },
                    (uploadError) => {
                        console.error("Thumbnail upload error:", uploadError);
                        reject(new Error(`Thumbnail upload failed: ${uploadError.message}`));
                    },
                    async () => {
                        thumbnailUrl = await getDownloadURL(thumbnailUploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });

            // 2. Upload Video File
            const videoStorageRef = ref(storage, `videos/${currentUser.uid}/${Date.now()}_${videoFile.name}`);
            const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

            await new Promise((resolve, reject) => {
                videoUploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (uploadError) => {
                        console.error("Video upload error:", uploadError);
                        reject(new Error(`Video upload failed: ${uploadError.message}`));
                    },
                    async () => {
                        videoUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });

            // 3. Save metadata to Firestore
            // This object structure MUST match your Firestore rules for `create`
            const videoData = {
                title: title.trim(),
                description: description.trim(), // Optional, can be empty string
                price: numericPrice,             // Required by rules (is number)
                videoUrl: videoUrl,              // Required by rules (is string)
                thumbnailUrl: thumbnailUrl,      // Required by rules (is string)
                creatorId: currentUser.uid,      // Required by rules, matches auth uid
                creatorDisplayName: currentUser.displayName, // Required by rules (is string)
                // creatorEmail: currentUser.email, // Optional, not in rules but good to have
                uploadedAt: serverTimestamp(),   // Firestore rule handles server timestamp
                viewCount: 0,
                // duration: 0, // Optional, can be added later
                // tags: [], // Optional
                // status: "available", // Optional
            };

            await addDoc(collection(db, "videos"), videoData);

            setSuccessMessage('Video uploaded successfully!');
            resetForm();

        } catch (err) {
            console.error("Error in upload process:", err);
            setError(`Upload process failed: ${err.message}. Check Firestore rules and console for details.`);
            // Consider cleanup logic if one upload succeeded but Firestore write failed.
        } finally {
            setIsUploading(false);
        }
    };

    if (!currentUser || currentUser.role !== 'creator') {
        // This should ideally be handled by ProtectedRoute, but if the user's role changes
        // while they are on the page, or if ProtectedRoute logic has a slight delay,
        // this provides an additional check.
        return (
            <div className="text-center mt-10 p-4">
                <p className="text-red-600 font-semibold">
                    {error || "You do not have permission to upload videos or you are not logged in correctly."}
                </p>
                {!error && <p>Your current role: {currentUser?.role || 'Not identified'}</p>}
                <button onClick={() => navigate('/login')} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                    Go to Login
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto mt-2 mb-10 p-6 sm:p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Upload New Video</h2>
            {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
            {successMessage && <p className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">{successMessage}</p>}

            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="My Awesome Video"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="A brief description of your video content..."/>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (USD, 0 for free) <span className="text-red-500">*</span></label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 9.99 or 0"/>
                </div>
                <div>
                    <label htmlFor="video-file-input" className="block text-sm font-medium text-gray-700">Video File <span className="text-red-500">*</span></label>
                    <input type="file" id="video-file-input" accept="video/*" onChange={handleVideoFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                    {videoFile && <p className="text-xs text-gray-500 mt-1">Selected: {videoFile.name}</p>}
                </div>
                <div>
                    <label htmlFor="thumbnail-file-input" className="block text-sm font-medium text-gray-700">Thumbnail Image <span className="text-red-500">*</span></label>
                    <input type="file" id="thumbnail-file-input" accept="image/jpeg, image/png, image/webp" onChange={handleThumbnailFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                    {thumbnailFile && <p className="text-xs text-gray-500 mt-1">Selected: {thumbnailFile.name}</p>}
                </div>

                {isUploading && (
                    <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Upload Progress (Video):</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="text-center text-sm mt-1 text-gray-600">{Math.round(uploadProgress)}%</p>
                    </div>
                )}

                <button type="submit" disabled={isUploading || !videoFile || !thumbnailFile || !currentUser || currentUser.role !== 'creator'} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    );
};

export default UploadVideo;