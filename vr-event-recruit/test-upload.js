const fs = require('fs');
const path = require('path');

async function testUpload() {
    const filePath = path.join(process.cwd(), 'src/app/favicon.ico'); // Use an existing file
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/x-icon' });

    const formData = new FormData();
    formData.append('file', blob, 'test-favicon.ico');

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log('Upload success:', data);
        } else {
            console.log('Upload failed:', response.status, await response.text());
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testUpload();
