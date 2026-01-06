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
        console.log('--- Checking Instance ---');
        // 1. Fetch Instance State (check if exists)
        // If connects logic, fine.

        // 2. Set Webhook
        console.log('Setting Webhook...');
        const webhook = await request(`/webhook/set/${INSTANCE_NAME}`, 'POST', {
            "enabled": true,
            "url": "http://hexai_n8n:5678/webhook/whatsapp",
            "webhookByEvents": true,
            "events": ["MESSAGES_UPSERT"]
        });
        console.log('Webhook Result:', JSON.stringify(webhook, null, 2));

        // 3. Connect/Get QR
        console.log('Fetching QR Code (Attempt 1)...');
        // Call connect to ensure it's trying to connect
        await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');

        await delay(2000); // Wait for generation

        // In V2, calling connect repeatedly might return the QR.
        const connect = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');
        console.log('QR Code Result:', JSON.stringify(connect, null, 2));

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
