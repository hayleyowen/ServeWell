import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure your email transport
// For production, you would use your actual SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@example.com',
    pass: process.env.EMAIL_PASSWORD || 'your-password',
  },
});

export async function POST(request: Request) {
  try {
    const { to, message, memberName } = await request.json();

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'church@example.com',
      to,
      subject: `Message from ServeWell Church`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${memberName},</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p style="margin-top: 20px;">Blessings,</p>
          <p>ServeWell Church Team</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This email was sent from the ServeWell Church Management System.
            Please do not reply directly to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 