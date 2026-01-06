const http = require('http');
const fs = require('fs');

const API_KEY = 'hexai_evolution_global_key_123';
const INSTANCE_NAME = 'Hexai';

async function request(path, method, body = null, retries = 5) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            const options = {
                hostname: 'localhost',
                port: 8080,
                path: path,
                method: method,
                headers: {
                    'apikey': API_KEY,
                    'Content-Type': 'application/json'
                }
            };

            const req = http.request(options, (res) => {
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

            req.on('error', (e) => {
                if (n > 0) {
                    setTimeout(() => attempt(n - 1), 2000);
                } else {
                    reject(e);
                }
            });
            if (body) req.write(JSON.stringify(body));
            req.end();
        };
        attempt(retries);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveQr(base64) {
    const finalBase64 = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;

    const html = `
     <html>
     <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0;font-family:sans-serif;">
        <div style="background:white;padding:2rem;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;">
            <h2 style="color: #27ae60;">QR Code Gerado!</h2>
            <p>Escaneie agora com seu WhatsApp Business</p>
            <img src="${finalBase64}" style="width:300px;border:1px solid #ccc"/>
            <p>1. WhatsApp Business > Ajustes/Menu > Aparelhos Conectados</p>
            <p>2. Conectar Aparelho</p>
        </div>
     </body>
     </html>
     `;
    fs.writeFileSync('qrcode.html', html);
    console.log('[[QR_SAVED]]');
}

async function main() {
    try {
        console.log('--- ROBUST SETUP ---');

        // 1. Cleanup
        await request(`/instance/logout/${INSTANCE_NAME}`, 'DELETE');
        await request(`/instance/delete/${INSTANCE_NAME}`, 'DELETE');
        await delay(1000);

        // 2. Create
        console.log('Creating instance...');
        const createBody = {
            instanceName: INSTANCE_NAME,
            token: 'hexai_token_secure',
            qrcode: true,
            integration: "WHATSAPP-BAILEYS"
        };
        await request('/instance/create', 'POST', createBody);

        // 3. Robust Loop
        console.log('Entering connection loop...');
        for (let i = 0; i < 30; i++) {
            process.stdout.write(`.` + (i % 10 === 0 ? '\n' : ''));

            // Force trigger connect every time
            await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');
            await delay(2000); // give it a moment

            // Check for QR
            const check = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');

            if (check.base64 || (check.qrcode && check.qrcode.base64)) {
                const qr = check.base64 || check.qrcode.base64;
                saveQr(qr);
                break;
            }
        }
        console.log('\nDone.');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
