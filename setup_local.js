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

async function main() {
    try {
        console.log('--- LOCAL FULL RESET ---');

        // 1. DELETE Instance
        console.log('Deleting Instance...');
        await request(`/instance/delete/${INSTANCE_NAME}`, 'DELETE');
        await delay(2000);

        // 2. CREATE Instance
        // IMPORTANT: Evolution API V2 'create' usually takes instanceName in body or just path
        console.log('Creating Instance...');
        const createBody = {
            instanceName: INSTANCE_NAME,
            token: 'hexai_token_secure',
            qrcode: true,
            integration: "WHATSAPP-BAILEYS"
        };
        const createRes = await request('/instance/create', 'POST', createBody);
        console.log('Create Res:', JSON.stringify(createRes, null, 2));

        // 3. Connect (Just in case Create didn't return QR immediately or if it needs mapped)
        if (createRes.qrcode && createRes.qrcode.base64) {
            saveQr(createRes.qrcode.base64);
            return;
        }

        console.log('Waiting 3s...');
        await delay(3000);

        // 4. Fetch Connect QR
        console.log('Fetching QR...');
        const connect = await request(`/instance/connect/${INSTANCE_NAME}`, 'GET');

        if (connect.base64) {
            saveQr(connect.base64);
        } else if (connect.qrcode && connect.qrcode.base64) {
            saveQr(connect.qrcode.base64);
        } else {
            console.log('QR Result:', JSON.stringify(connect, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function saveQr(base64) {
    const fs = require('fs');
    // Remove data:image/png;base64, prefix if present for saving file, but for HTML img src it is needed
    // actually for HTML img src, we want the prefix.
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

main();
