const axios = require('axios');

const API_URL = 'http://localhost:8080';
const GLOBAL_KEY = 'hexai_evolution_global_key_123';
const INSTANCE_NAME = 'hexai'; // User suggested lowercase
// Docker internal URL for n8n
const WEBHOOK_URL = 'http://31.97.20.238:5678/webhook/whatsapp';

const headers = {
    'apikey': GLOBAL_KEY,
    'Content-Type': 'application/json'
};

async function main() {
    console.log('--- RECREATING INSTANCE FOR QR CODE ---');

    try {
        // 0. Delete existing instance (ignore error if not exists)
        console.log(`Deleting instance ${INSTANCE_NAME}...`);
        try {
            await axios.delete(`${API_URL}/instance/delete/${INSTANCE_NAME}`, { headers });
            console.log('✅ Instance deleted.');
        } catch (e) {
            console.log('ℹ️ Instance deletion skipped (maybe didn\'t exist).');
        }

        // 1. Create Instance
        console.log(`Creating instance ${INSTANCE_NAME}...`);
        await axios.post(`${API_URL}/instance/create`, {
            "instanceName": INSTANCE_NAME,
            "token": "hexai_token_secure",
            "qrcode": false,
            "integration": "WHATSAPP-BAILEYS"
        }, { headers });
        console.log('✅ Instance created successfully!');

        // 2. Set Webhook
        console.log(`Setting Webhook to: ${WEBHOOK_URL}...`);
        await axios.post(`${API_URL}/webhook/set/${INSTANCE_NAME}`, {
            "webhook": {
                "enabled": true,
                "url": WEBHOOK_URL,
                "webhookByEvents": false,
                "events": ["MESSAGES_UPSERT"]
            }
        }, { headers });
        console.log('✅ Webhook configured!');

        // 3. Get QR Code
        console.log('\nGenerating QR Code...');
        const qr = await axios.get(`${API_URL}/instance/connect/${INSTANCE_NAME}`, { headers });
        console.log('QR Code Refreshed:', qr.data?.code || qr.data?.base64 ? 'YES' : 'NO');

        // 4. Output Keys for User
        console.log('\n--- CREDENTIALS FOR N8N ---');
        console.log(`Global API Key: ${GLOBAL_KEY}`);
        console.log(`Instance Name:  ${INSTANCE_NAME}`);
        console.log(`Instance Token: hexai_token_secure`);
    } catch (error) {
        console.error('Error:', JSON.stringify(error.response?.data || error.message, null, 2));
    }
}

main();
