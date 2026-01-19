import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export function extractPublicId(url: string): string | null {
    try {
        const regex = /\/v\d+\/(.+)\.\w+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

export async function deleteImage(url: string) {
    const publicId = extractPublicId(url);
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
    }
}

export default cloudinary;
