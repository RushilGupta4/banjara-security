// pages/api/sendRegistrationEmail.ts
import { NextResponse, type NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(req: NextRequest) {
  const emailOptions = await req.json();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_EMAIL,
      pass: process.env.NODE_PASS,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.NODE_EMAIL,
    ...emailOptions,
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed!' }, { status: 500 });
  }
}
