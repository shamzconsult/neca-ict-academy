import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();
    
    const fromEmail = process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('From email address not configured');
    }

    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email!' },
      { status: 500 }
    );
  }
}