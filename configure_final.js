const axios = require('axios');

const API_URL = 'http://localhost:8080';
const GLOBAL_KEY = 'hexai_evolution_global_key_123';
const INSTANCE_NAME = 'Hexai';
// Docker internal URL for n8n
const WEBHOOK_URL = 'http://31.97.20.238:5678/webhook/whatsapp';

const headers = {
    'apikey': GLOBAL_KEY,
    'Content-Type': 'application/json'
};

async function main() {
    console.log('--- FINAL CONFIGURATION ---');

    try {
        // 1. Set Webhook
        console.log(`Setting Webhook to: ${WEBHOOK_URL}...`);
        try {
            await axios.post(`${API_URL}/webhook/set/${INSTANCE_NAME}`, {
                "webhook": {
                    "enabled": true,
                    "url": WEBHOOK_URL,
                    "webhookByEvents": false,
                    "events": ["MESSAGES_UPSERT"]
                }
            }, { headers });
            console.log('✅ Webhook configured successfully!');
        } catch (e) {
            console.error('❌ Failed to set webhook:', JSON.stringify(e.response?.data || e.message, null, 2));
        }

        // 2. Check Connection Status
        console.log('\nChecking Connection Status...');
        const status = await axios.get(`${API_URL}/instance/connectionState/${INSTANCE_NAME}`, { headers });
        console.log('Current State:', status.data?.instance?.state || 'Unknown');

        // 3. Output Keys for User
        console.log('\n--- CREDENTIALS FOR N8N ---');
        console.log(`Global API Key: ${GLOBAL_KEY}`);
        console.log(`Instance Name:  ${INSTANCE_NAME}`);
        console.log(`Instance Token: hexai_token_secure`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
