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
        console.log('--- RESETTING INSTANCE ---');
        // 1. Delete Instance
        console.log('Deleting existing instance...');
        await request(`/instance/logout/${INSTANCE_NAME}`, 'DELETE'); // Try logout first
        await request(`/instance/delete/${INSTANCE_NAME}`, 'DELETE');

        await delay(2000);

        // 2. Create Instance with Webhook embedded
        console.log('Creating Instance with Full Config...');
        const create = await request('/instance/create', 'POST', {
            "instanceName": INSTANCE_NAME,
            "token": "hexai_token_secure",
            "qrcode": true,
            "integration": "WHATSAPP-BAILEYS",
            "webhook": {
                "enabled": true,
                "url": "http://hexai_n8n:5678/webhook/whatsapp",
                "webhookByEvents": true,
                "events": ["MESSAGES_UPSERT"]
            }
        });

        console.log('Create Response:', JSON.stringify(create, null, 2));

        if (create.qrcode && create.qrcode.base64) {
            console.log('[[QR_FOUND]]');
            console.log(create.qrcode.base64);
            console.log('[[QR_END]]');
            return;
        }

        // 3. Fallback: Get QR if not in create response
        console.log('Fetching QR Code (Fallback)...');
        await delay(1000);
        const connect = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');
        console.log('Connect QR Result:', JSON.stringify(connect, null, 2));

        if (connect.base64) {
            console.log('[[QR_FOUND]]');
            console.log(connect.base64);
            console.log('[[QR_END]]');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
