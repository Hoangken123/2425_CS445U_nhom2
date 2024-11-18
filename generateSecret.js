const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Thư viện để tạo mã ngẫu nhiên

const envPath = path.join(__dirname, '.env'); // Đường dẫn tới tệp .env
const secret = crypto.randomBytes(32).toString('hex'); // Tạo secret key ngẫu nhiên

fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading .env file:', err);
        return;
    }

    let updated = false;
    const newData = data.split('\n').map(line => {
        if (line.startsWith('SESSION_SECRET=')) {
            updated = true;
            return `SESSION_SECRET=${secret}`;
        }
        return line;
    }).join('\n');

    // Nếu không có SESSION_SECRET, thêm mới
    if (!updated) {
        newData += `\nSESSION_SECRET=${secret}`;
    }

    fs.writeFile(envPath, newData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to .env file:', err);
            return;
        }
        console.log('Updated SESSION_SECRET in .env file');
    });
});
