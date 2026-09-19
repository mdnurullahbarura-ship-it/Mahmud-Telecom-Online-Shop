/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Note: Client-side deletion usually requires a signed upload or a backend proxy.
  // For simplicity in this applet, we prioritize uploads. 
  // If the user provides an API Key and Secret, this would be more complex.
  console.warn('Cloudinary delete called for:', publicId, ' - Client-side deletion requires signature/backend.');
};
