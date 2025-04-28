import { deleteFile, uploadFile } from '@/lib/cloudinary';
import connectViaMongoose from '@/lib/db';
import Cohort from '@/models/cohort';
import Enrollment from '@/models/enrollment';
import { NextResponse } from 'next/server';

interface UpdateApplicantData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  state?: string;
  gender?: string;
  course?: string;
  cohort?: string;
  level?: string;
  status?: string;
  cv?: { url: string; public_id: string };
  profilePicture?: { url: string; public_id: string };
}

const GET = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Applicant ID is required' }, { status: 400 });
    }

    const applicant = await Enrollment.findById(id);
    if (!applicant) {
      return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({ applicant }, { status: 200 });
  } catch (error) {
    console.error('Error fetching applicant:', error);
    return NextResponse.json({ message: 'Error fetching applicant', error }, { status: 500 });
  }
};

const PUT = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Applicant ID is required' }, { status: 400 });
    }

    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const updateData = await req.json();
      const existingApplicant = await Enrollment.findById(id);

      if (!existingApplicant) {
        return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
      }

      if (!updateData.level) {
        updateData.level = existingApplicant.level;
      }

      if (!updateData.status) {
        updateData.status = existingApplicant.status;
      }

      const updatedApplicant = await Enrollment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedApplicant) {
        return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
      }

      await Cohort.updateOne(
        { 'applicants._id': id },
        {
          $set: {
            'applicants.$.fullName': `${updatedApplicant.firstName} ${updatedApplicant.lastName}`,
            'applicants.$.email': updatedApplicant.email,
            'applicants.$.course': updatedApplicant.course,
            'applicants.$.status': updatedApplicant.status,
            'applicants.$.state': updatedApplicant.state,
            'applicants.$.level': updatedApplicant.level,
            'applicants.$.appliedAt': updatedApplicant.date,
          },
        }
      );

      return NextResponse.json({ message: 'Applicant updated successfully', updatedApplicant }, { status: 200 });
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const existingApplicant = await Enrollment.findById(id);

      if (!existingApplicant) {
        return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
      }

      const updateData: UpdateApplicantData = {
        firstName: (formData.get('firstName') as string) || existingApplicant.firstName,
        lastName: (formData.get('lastName') as string) || existingApplicant.lastName,
        email: (formData.get('email') as string) || existingApplicant.email,
        phoneNumber: (formData.get('phoneNumber') as string) || existingApplicant.phoneNumber,
        state: (formData.get('state') as string) || existingApplicant.state,
        gender: (formData.get('gender') as string) || existingApplicant.gender,
        course: (formData.get('course') as string) || existingApplicant.course,
        cohort: (formData.get('cohort') as string) || existingApplicant.cohort,
        level: (formData.get('level') as string) || existingApplicant.level,
        status: (formData.get('status') as string) || existingApplicant.status,
      };

      // Handle file uploads
      const cvFile = formData.get('cv') as File | null;
      const profileFile = formData.get('profilePicture') as File | null;

      if (cvFile) {
        if (existingApplicant.cv?.public_id) {
          await deleteFile(existingApplicant.cv.public_id);
        }
        const cvUpload = await uploadFile(cvFile, 'cv');
        updateData.cv = cvUpload;
      }

      if (profileFile) {
        if (existingApplicant.profilePicture?.public_id) {
          await deleteFile(existingApplicant.profilePicture.public_id);
        }
        const profileUpload = await uploadFile(profileFile, 'profile');
        updateData.profilePicture = profileUpload;
      }

      const updatedApplicant = await Enrollment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      const updatedCohort = await Cohort.updateOne(
        { 'applicants._id': id },
        {
          $set: {
            'applicants.$.status': updatedApplicant.status,
            'applicants.$.level': updatedApplicant.level,
          },
        }
      );

      console.log('Updated Cohort:', updatedCohort);

      return NextResponse.json({ message: 'Applicant updated successfully', updatedApplicant }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Unsupported content type' }, { status: 415 });
    }
  } catch (error) {
    console.error('Error updating applicant:', error);
    return NextResponse.json({ message: 'Error updating applicant', error }, { status: 500 });
  }
};

const DELETE = async (req: Request) => {
  try {
    await connectViaMongoose();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Applicant ID is required' }, { status: 400 });
    }

    const applicant = await Enrollment.findById(id);
    if (!applicant) {
      return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
    }

    if (applicant.cv?.public_id) {
      await deleteFile(applicant.cv.public_id);
    }
    if (applicant.profilePicture?.public_id) {
      await deleteFile(applicant.profilePicture.public_id);
    }

    await Enrollment.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Applicant deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting applicant:', error);
    return NextResponse.json({ message: 'Error deleting applicant', error }, { status: 500 });
  }
};

export { GET, PUT, DELETE };
