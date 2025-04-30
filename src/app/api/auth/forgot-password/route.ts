import { NextResponse } from "next/server";
import crypto from "crypto";
import connectViaMongoose from "@/lib/db";
import User from "@/models/user";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  await connectViaMongoose();
  
  try {
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, you'll receive a password reset link" },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; 

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(resetTokenExpiry);
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM, 
      to: email,                  
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error processing your request", error },
      { status: 500 }
    );
  }
}

















// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// import crypto from "crypto";
// import connectViaMongoose from "@/lib/db";
// import User from "@/models/user";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   await connectViaMongoose();
  
//   try {
//     const { email } = await request.json();
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json(
//         { message: "If an account exists, you'll receive a password reset link" },
//         { status: 200 }
//       );
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     const resetTokenExpiry = Date.now() + 3600000; 

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpire = new Date(resetTokenExpiry);
//     await user.save();

//     const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

//     console.log("Resend API Key:", process.env.RESEND_API_KEY ? "exists" : "missing");
    
//     await resend.emails.send({
//       from: "no-reply@yourdomain.com",
//       to: email,
//       subject: "Password Reset Request",
//       html: `
//         <p>You requested a password reset. Click the link below to reset your password:</p>
//         <a href="${resetUrl}">${resetUrl}</a>
//         <p>This link will expire in 1 hour.</p>
//       `
//     });

//     return NextResponse.json(
//       { message: "Password reset link sent to your email" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error processing your request" },
//       { status: 500 }
//     );
//   }
// }