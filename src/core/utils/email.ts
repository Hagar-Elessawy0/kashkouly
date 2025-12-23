import nodemailer from 'nodemailer';
import { logger } from './logger';
import { config } from '../../config';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
}

enum EmailPurpose {
  VERIFICATION = 'Verification Email',
  PASSWORD_RESET = 'Password Reset Email',
  WELCOME = 'Welcome Email',
}

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

const renderTemplate = async (templateName: string, data: object): Promise<string> => {
  const templatePath = path.join(__dirname, '..', '..', 'shared', 'templates', `${templateName}.ejs`);
  return await ejs.renderFile(templatePath, data);
};

export const sendEmail = async (options: EmailOptions, purpose: EmailPurpose): Promise<void> => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`${purpose} sent successfully to ${options.to}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
): Promise<void> => {
  const verificationUrl = `${config.frontend.url}/verify-email?token=${verificationToken}`;

  const html = await renderTemplate('verificationEmail', { verificationUrl });

  await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
  }, EmailPurpose.VERIFICATION);
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;

  const html = await renderTemplate('passwordResetEmail', { resetUrl });

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  }, EmailPurpose.PASSWORD_RESET);
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const html = await renderTemplate('welcomeEmail', { name });

  await sendEmail({
    to: email,
    subject: 'Welcome to KashKoly! ^_~',
    html,
  }, EmailPurpose.WELCOME);
};
