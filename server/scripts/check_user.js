/**
 * check_user.js — Show exact details of a user by email
 * Usage: node scripts/check_user.js <email>
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const [, , email] = process.argv;
if (!email) { console.error('Usage: node scripts/check_user.js <email>'); process.exit(1); }

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) { console.error(`No user: ${email}`); process.exit(1); }
    console.log('\nUser Details:');
    console.log('  _id   :', user._id.toString());
    console.log('  name  :', user.name);
    console.log('  email :', user.email);
    console.log('  role  :', user.role);
    console.log('  avatar:', user.avatar);
    console.log('  created:', user.createdAt);
    await mongoose.disconnect();
};
run().catch(console.error);
