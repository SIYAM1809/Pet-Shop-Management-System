import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../../client/public/images/payments');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Refined Authentic SVG paths
const logos = [
    {
        name: 'bkash.svg',
        content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Authentic Pink Origami Bird (Butterfly) -->
            <path d="M48 25 L85 10 L65 50 L48 25 Z" fill="#D81B60"/>
            <path d="M48 25 L20 40 L48 55 L48 25 Z" fill="#E91E63"/>
            <path d="M48 55 L20 70 L48 85 L48 55 Z" fill="#E91E63"/>
            <path d="M48 55 L65 60 L85 100 L48 55 Z" fill="#C2185B"/>
            <text x="50" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#E91E63">bKash</text>
        </svg>`
    },
    {
        name: 'nagad.svg',
        content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Nagad Orange Circle with Running Man Abstract -->
            <circle cx="50" cy="40" r="30" fill="#f68b1e" />
            <!-- Abstract "Running Man" shape in white -->
            <path d="M50 20 C55 20 58 24 58 24 L52 32 L48 28 C48 28 46 26 50 20 M50 20 L50 45 L65 55 M50 45 L35 55 M50 45 L60 30" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="52" cy="22" r="3" fill="white" />
            
             <!-- Bengali Text "Nagad" -->
            <text x="25" y="85" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#ec1d24">ন</text>
            <text x="45" y="85" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#ec1d24">গ</text>
            <text x="65" y="85" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#ec1d24">দ</text>
        </svg>`
    },
    {
        name: 'rocket.svg',
        content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Authentic Purple Rocket -->
             <path d="M50 10 L75 50 L60 50 L75 90 L50 70 L25 90 L40 50 L25 50 Z" fill="#8c3494"/>
             <text x="50" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#8c3494">Rocket</text>
        </svg>`
    }
];

logos.forEach(logo => {
    fs.writeFileSync(path.join(targetDir, logo.name), logo.content);
    console.log(`Created ${logo.name}`);
});
