import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyEmail = async () => {
    console.log('Attempting to send test email...');
    try {
        await sendEmail({
            email: 'test@example.com',
            subject: 'Test Email from Siyam\'s Praniseba',
            html: '<h1>It Works!</h1><p>This is a test email to verify the notification system.</p>'
        });
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

verifyEmail();
