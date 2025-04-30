import crypto from "crypto";

// import { sendEmail } from "@/lib/email";
import connectViaMongoose from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function sendPasswordResetEmail(email: string) {
  await connectViaMongoose();
  
  const user = await User.findOne({ email });
  if (!user) return; 

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; 

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(resetTokenExpiry);
  await user.save();

  // Send email
  const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`;

  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}
  
//   await sendEmail({
//     to: email,
//     subject: "Password Reset Request",
//     html: `
//       <p>You requested a password reset. Click the link below to reset your password:</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//       <p>This link will expire in 1 hour.</p>
//     `
//   });
// }

export async function resetPassword(token: string, newPassword: string): Promise<{ error?: string } | void> {
  try {
    await connectViaMongoose();
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
  }  catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}