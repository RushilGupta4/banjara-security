// email/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PW,
  },
});

export async function POST(req: NextRequest) {
  const emailOptions = await req.json();

  const mailOptions: Mail.Options = {
    from: process.env.NODEMAILER_EMAIL,
    ...emailOptions,
  };
  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed!' }, { status: 500 });
  }
}
