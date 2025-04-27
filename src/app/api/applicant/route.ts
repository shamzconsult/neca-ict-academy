import connectViaMongoose from '@/lib/db';
import Enrollment from '@/models/enrollment';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';
import Cohort from '@/models/cohort';
import mongoose from 'mongoose';

interface ApplicantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  course: string;
  cohort: string;
  level: string;
  status: string;
  cv: File | null;
  profilePicture: File | null;
  [key: string]: string | File | null | undefined;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const POST = async (req: NextRequest) => {
  try {
    await connectViaMongoose();
    const formData = await req.formData();

    const entries = Array.from(formData.entries());
    console.log('Received form data:', entries);

    const data: ApplicantFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      state: formData.get('state') as string,
      gender: formData.get('gender') as string,
      course: formData.get('course') as string,
      cohort: formData.get('cohort') as string,
      level: (formData.get('level') as string) || 'Applied',
      status: (formData.get('status') as string) || 'Pending',
      cv: formData.get('cv') as File | null,
      profilePicture: formData.get('profilePicture') as File | null,
    };

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'course', 'email', 'phoneNumber', 'state', 'gender', 'cohort'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json(
        {
          message: 'Missing required fields',
          missingFields,
          receivedData: data,
        },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary
    const [cv, profilePicture] = await Promise.all([uploadFile(data.cv, 'cv'), uploadFile(data.profilePicture, 'profile')]);

    const newApplicant = await Enrollment.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      state: data.state,
      gender: data.gender,
      course: data.course,
      cohort: data.cohort,
      level: data.level,
      status: data.status,
      cv: cv || { url: '', public_id: '' },
      profilePicture: profilePicture || { url: '', public_id: '' },
    });

    await Cohort.updateOne(
      { _id: new mongoose.Types.ObjectId(data.cohort) },
      {
        $push: {
          applicants: {
            _id: newApplicant._id,
            fullName: `${newApplicant.firstName} ${newApplicant.lastName}`,
            email: newApplicant.email,
            course: newApplicant.course,
            status: newApplicant.status,
          },
        },
      }
    );

    return NextResponse.json({ message: 'Applicant created successfully!', newApplicant }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating applicant:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    const errorStack = error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined;

    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: 'Error creating applicant',
        error: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
};

const GET = async () => {
  try {
    await connectViaMongoose();
    const applicant = await Enrollment.find({});
    return NextResponse.json(applicant);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching applicants', error }, { status: 500 });
  }
};

export { GET, POST };
