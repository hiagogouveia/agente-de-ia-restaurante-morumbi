const http = require('http');

const API_KEY = 'hexai_evolution_global_key_123';
const INSTANCE_NAME = 'Hexai';

async function request(path, method, body = null) {
    return new Promise((resolve, reject) => {
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

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveQr(base64) {
    const fs = require('fs');
    const finalBase64 = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;

    const html = `
     <html>
     <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0;font-family:sans-serif;">
        <div style="background:white;padding:2rem;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;">
            <h2>Escaneie para conectar a Ana</h2>
            <img src="${finalBase64}" style="width:300px;border:1px solid #ccc"/>
            <p>1. Abra o WhatsApp Business</p>
            <p>2. Toque em Mais opções (três pontos) > Aparelhos conectados</p>
            <p>3. Toque em Conectar um aparelho</p>
            <p>4. Se pedir PIN, insira a sua senha de 2 etapas</p>
            <p>5. Aponte o celular para esta tela</p>
        </div>
     </body>
     </html>
     `;
    fs.writeFileSync('qrcode.html', html);
    console.log('QR Code saved to qrcode.html');
}

async function main() {
    try {
        console.log('--- POLLING QR CODE ---');

        for (let i = 0; i < 10; i++) {
            console.log(`Attempt ${i + 1}/10...`);
            const connect = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');

            if (connect.base64) {
                saveQr(connect.base64);
                return;
            } else if (connect.qrcode && connect.qrcode.base64) {
                saveQr(connect.qrcode.base64);
                return;
            } else {
                console.log('Result:', JSON.stringify(connect));
            }
            await delay(2000);
        }
        console.log('Failed to get QR after 10 attempts');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
