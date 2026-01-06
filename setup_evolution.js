const https = require('http');

const API_KEY = 'hexai_evolution_global_key_123';
const API_URL = 'http://hexai_evolution_api:8080';

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
            res.on('end', () => resolve(JSON.parse(data || '{}')));
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    try {
        // 1. Create Instance
        console.log('Creating Instance...');
        const create = await request('/instance/create', 'POST', {
            instanceName: 'Hexai',
            token: 'hexai_token_secure',
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
        });
        console.log('Create:', create);

        // 2. Set Webhook
        console.log('Setting Webhook...');
        const webhook = await request('/webhook/set/Hexai', 'POST', {
            webhookUrl: 'http://hexai_n8n:5678/webhook/whatsapp',
            webhookByEvents: false,
            webhookBase64: false,
            events: ['MESSAGES_UPSERT'],
            enabled: true
        });
        console.log('Webhook:', webhook);

        // 3. Get QR Code
        console.log('Getting QR Code...');
        const connect = await request('/instance/connect/Hexai', 'GET');
        console.log('Connect Result:', JSON.stringify(connect));

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
