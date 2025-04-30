import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


// import nodemailer from 'nodemailer';

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// export async function sendEmail({ to, subject, html }: EmailOptions) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVER_HOST,
//     port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
//     secure: process.env.EMAIL_SERVER_SECURE === 'true', 
//     auth: {
//       user: process.env.EMAIL_SERVER_USER,
//       pass: process.env.EMAIL_SERVER_PASSWORD,
//     },
//   });

//   // Send mail
//   await transporter.sendMail({
//     from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
//     to,
//     subject,
//     html,
//   });
// }

// export async function sendVerificationEmail(email: string, url: string) {
//   const html = `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//       <h2 style="color: #E02B20;">Verify Your Email</h2>
//       <p>Please click the link below to verify your email address:</p>
//       <p><a href="${url}" style="color: #E02B20;">Verify Email</a></p>
//       <p>If you didn't request this, please ignore this email.</p>
//     </div>
//   `;

//   await sendEmail({
//     to: email,
//     subject: 'Verify your email address',
//     html,
//   });
// }