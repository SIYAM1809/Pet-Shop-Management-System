import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const targetDir = path.join(__dirname, '../../client/public/images/payments');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Logo URLs (Using Wikimedia Commons which is bot-friendly)
const logos = [
    { name: 'bkash.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/BKash-bKash-Logo.wine.svg/320px-BKash-bKash-Logo.wine.svg.png' },
    { name: 'nagad.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Nagad_Logo_2019.svg/320px-Nagad_Logo_2019.svg.png' }, // Updated Nagad URL
    { name: 'rocket.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Rocket_Mobile_Banking_Logo.svg/320px-Rocket_Mobile_Banking_Logo.svg.png' },
    { name: 'visa.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/320px-Visa_Inc._logo.svg.png' },
    { name: 'mastercard.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/320px-Mastercard-logo.svg.png' },
    { name: 'bank.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bank_icon.svg/320px-Bank_icon.svg.png' } // A generic bank icon from commons
];

const downloadImage = (url, filename) => {
    const file = fs.createWriteStream(path.join(targetDir, filename));
    https.get(url, function (response) {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            // Handle redirects, though Wikimedia usually doesn't need this for these URLs
            console.log(`Redirecting to ${response.headers.location}`);
            downloadImage(response.headers.location, filename);
            return;
        }
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
        });
    }).on('error', function (err) {
        fs.unlink(filename);
        console.error(`Error downloading ${filename}: ${err.message}`);
    });
};

logos.forEach(logo => downloadImage(logo.url, logo.name));
