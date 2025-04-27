import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';
import connectViaMongoose from '@/lib/db';
import Enrollment from '@/models/enrollment';

export const POST = async (req: Request) => {
    try {
        await connectViaMongoose();
        const formData = await req.formData();
        
        const file = formData.get('file') as File;
        const type = formData.get('type') as 'cv' | 'profilePicture';
        const enrollmentId = formData.get('enrollmentId') as string;

        if (!file || !type || !enrollmentId) {
            return NextResponse.json(
                { error: 'File, type and enrollment ID are required' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const { url, public_id } = await uploadFile(file, type);

        // Update enrollment
        const updateData = {
            [type]: { url, public_id }
        };

        const updatedEnrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            updateData,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            url,
            enrollment: updatedEnrollment
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
};