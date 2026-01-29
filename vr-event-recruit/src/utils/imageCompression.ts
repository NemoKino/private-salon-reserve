import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 3.5, // Target size (less than 4MB limit)
        maxWidthOrHeight: 1920, // Reasonable max dimension for web
        useWebWorker: true,
        fileType: file.type as string, // Improve compatibility
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Image compression failed:', error);
        throw error;
    }
}
