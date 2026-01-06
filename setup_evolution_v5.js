const https = require('http');

const API_KEY = 'hexai_evolution_global_key_123';
const INSTANCE_NAME = 'Hexai';

async function request(path, method, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'hexai_evolution_api',
            port: 8080,
            path: path,
            method: method,
            headers: {
                'apikey': API_KEY,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data || '{}'));
                } catch (e) {
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log('--- V5 RETRY ---');

        // 1. Check Status
        const instances = await request('/instance/fetchInstances', 'GET');
        console.log('Instances:', JSON.stringify(instances, null, 2));

        // 2. Trigger Connect
        console.log('Triggering Connect...');
        await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');

        // 3. Wait 5s
        console.log('Waiting 5s for QR...');
        await delay(5000);

        // 4. Get QR
        const connect = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');
        console.log('QR Result:', JSON.stringify(connect, null, 2));

        if (connect.base64) {
            console.log('[[QR_FOUND]]');
            console.log(connect.base64);
            console.log('[[QR_END]]');
        } else if (connect.qrcode && connect.qrcode.base64) {
            console.log('[[QR_FOUND]]');
            console.log(connect.qrcode.base64);
            console.log('[[QR_END]]');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
