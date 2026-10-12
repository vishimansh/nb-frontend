const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artDir = 'C:\\Users\\vishw\\.gemini\\antigravity-ide\\brain\\26716361-bf3e-4f52-bc53-0658583325d6';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.pending = new Map();
  }

  init() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function captureScreenViaCdp(url, filename, width = 430, height = 932) {
  console.log(`\nNavigating to ${url}...`);

  // Create new target/tab
  const newTabRes = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(url), { method: 'PUT' });
  const tab = await newTabRes.json();
  console.log('Tab created:', tab.id, tab.webSocketDebuggerUrl);

  const session = new CdpSession(tab.webSocketDebuggerUrl);
  await session.init();

  await session.send('Page.enable');
  await session.send('DOM.enable');

  // Set mobile device metrics
  await session.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: true,
  });

  // Wait 3 seconds for React and all images to load cleanly
  console.log('Waiting 3.5s for React render and images to settle...');
  await sleep(3500);

  // Capture screenshot
  const result = await session.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });

  const buffer = Buffer.from(result.data, 'base64');
  console.log(`Captured screenshot for ${filename}: ${buffer.length} bytes`);

  // Save to public/prototypes
  const pubPath = path.join('public', 'prototypes', filename);
  fs.writeFileSync(pubPath, buffer);
  console.log(`Saved: ${pubPath}`);

  // Save to src/flows/v2/assets/examples
  const exPath = path.join('src', 'flows', 'v2', 'assets', 'examples', filename);
  fs.writeFileSync(exPath, buffer);
  console.log(`Saved: ${exPath}`);

  // Save to Artifact directory
  const artPath = path.join(artDir, filename);
  fs.writeFileSync(artPath, buffer);
  console.log(`Saved: ${artPath}`);

  session.close();
  await fetch(`http://127.0.0.1:9222/json/close/${tab.id}`);
}

async function main() {
  console.log('Launching headless Chrome with remote debugging on port 9222...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    await captureScreenViaCdp(
      'http://localhost:5174/?flow=b&preview=feed_card_ad',
      'preview-feed-card-screen.png'
    );

    await captureScreenViaCdp(
      'http://localhost:5174/?flow=b&preview=sponsored_ad',
      'preview-sponsored-card-screen.png'
    );

    console.log('\nAll preview screens successfully captured and saved!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chrome.kill();
  }
}

main();
