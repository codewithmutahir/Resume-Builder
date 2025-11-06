import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { cloudinaryConfig, isCloudinaryConfigured } from '../config/cloudinary';

/**
 * Uploads a PDF blob to Cloudinary and saves metadata to Firestore
 * @param {Blob} pdfBlob - The PDF blob to upload
 * @param {Object} resumeData - The resume data object
 * @param {string} templateName - The template name used
 * @param {string} userId - The user ID (optional)
 * @returns {Promise<Object>} - Object containing download URL and document ID
 */
export const uploadPDFToFirebase = async (pdfBlob, resumeData, templateName, userId = null) => {
  // Check if Cloudinary is configured
  if (!isCloudinaryConfigured) {
    console.error('Cloudinary configuration check failed:', {
      cloudName: cloudinaryConfig.cloudName,
      uploadPreset: cloudinaryConfig.uploadPreset
    });
    throw new Error('Cloudinary is not configured. Please set up Cloudinary environment variables.');
  }

  // Check if Firestore is configured
  if (!db) {
    console.error('Firestore database is not initialized');
    throw new Error('Firestore is not configured. Please set up Firebase environment variables.');
  }

  console.log('Starting PDF upload process...');
  console.log('Cloudinary config:', {
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.uploadPreset
  });

  try {
    // Generate a unique filename
    const fullName = resumeData.personal?.fullName || 'resume';
    const sanitizedName = fullName.replace(/\s+/g, '_').toLowerCase();
    const timestamp = Date.now();
    const fileName = `resumes/${sanitizedName}_${timestamp}`;
    
    console.log('Uploading PDF to Cloudinary...', { fileName, blobSize: pdfBlob.size });
    
    // Upload PDF to Cloudinary
    const formData = new FormData();
    formData.append('file', pdfBlob, `${sanitizedName}_${timestamp}.pdf`);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', 'resumes'); // Organize files in a folder
    formData.append('resource_type', 'raw'); // PDFs are raw files
    formData.append('public_id', fileName); // Custom public ID
    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`;
    
    const uploadResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({ error: { message: 'Failed to parse error response' } }));
      console.error('Cloudinary upload failed:', errorData);
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const uploadResult = await uploadResponse.json();
    const downloadURL = uploadResult.secure_url || uploadResult.url;
    
    console.log('Cloudinary upload successful:', {
      downloadURL,
      publicId: uploadResult.public_id
    });
    
    // Save metadata to Firestore
    const metadata = {
      fileName: `${sanitizedName}_${timestamp}.pdf`,
      downloadURL: downloadURL,
      cloudinaryPublicId: uploadResult.public_id,
      fullName: resumeData.personal?.fullName || 'Unknown',
      email: resumeData.personal?.email || null,
      template: templateName,
      userId: userId, // Add user ID to track who generated the resume
      createdAt: serverTimestamp(),
      // Optionally save additional resume data
      resumeData: {
        personal: resumeData.personal || {},
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        // Add other sections as needed
      }
    };
    
    console.log('Saving metadata to Firestore...', metadata);
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'resumes'), metadata);
    
    console.log('✅ Successfully saved to Firestore!', {
      documentId: docRef.id,
      collection: 'resumes'
    });
    
    return {
      success: true,
      downloadURL,
      documentId: docRef.id,
      fileName: metadata.fileName,
      cloudinaryPublicId: uploadResult.public_id
    };
  } catch (error) {
    console.error('❌ Error uploading PDF:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

