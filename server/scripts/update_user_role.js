/**
 * update_user_role.js
 * One-time script to update any user's role in the database.
 *
 * Usage:
 *   node scripts/update_user_role.js <email> <newRole>
 *
 * Example:
 *   node scripts/update_user_role.js sam1234@gmail.com staff
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const [, , email, newRole] = process.argv;

if (!email || !newRole) {
    console.error('❌  Usage: node scripts/update_user_role.js <email> <newRole>');
    console.error('     Roles: admin | staff | customer');
    process.exit(1);
}

const VALID_ROLES = ['admin', 'staff', 'customer'];
if (!VALID_ROLES.includes(newRole)) {
    console.error(`❌  Invalid role "${newRole}". Must be one of: ${VALID_ROLES.join(', ')}`);
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅  Connected to MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.error(`❌  No user found with email: ${email}`);
            process.exit(1);
        }

        const oldRole = user.role;
        user.role = newRole;
        await user.save();

        console.log(`\n✅  Role updated successfully!`);
        console.log(`   Name:  ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role:  ${oldRole} → ${newRole}\n`);

    } catch (err) {
        console.error('❌  Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
