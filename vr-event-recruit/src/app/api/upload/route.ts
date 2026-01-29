import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Server-side validation (4MB)
        if (buffer.length > 4 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size exceeds 4MB limit.' },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'vr-event-recruit' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            Readable.from(buffer).pipe(uploadStream);
        });

        return NextResponse.json({
            message: 'Success',
            url: uploadResult.secure_url
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
