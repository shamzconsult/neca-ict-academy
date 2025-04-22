import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = async (file: string, folder: string): Promise<{url: string, public_id: string}> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `course/${folder}`,
      resource_type: 'auto'
    });
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const deleteFile = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};



export const uploadFile = async (file: File | null, folder: string): Promise<{url: string, public_id: string}> => {
  if (!file) return { url: "", public_id: "" };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `enrollment/${folder}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id
            });
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('File processing error:', error);
    return { url: "", public_id: "" };
  }
};