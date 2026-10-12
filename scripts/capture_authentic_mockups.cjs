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

async function captureMockup(url, focusType, filename, aliases = []) {
  console.log(`\nNavigating to ${url} for ${focusType}...`);
  const newTabRes = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(url), { method: 'PUT' });
  const tab = await newTabRes.json();

  const session = new CdpSession(tab.webSocketDebuggerUrl);
  await session.init();

  await session.send('Page.enable');
  await session.send('DOM.enable');
  await session.send('Runtime.enable');

  // Set window dimensions so DeviceFrame has scale = 1.0 (requires height >= 934px)
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: 600,
    height: 1040,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Wait 4s for React mount, images, fonts
  await sleep(4000);

  // Position the feed scroll
  const scrollRes = await session.send('Runtime.evaluate', {
    expression: `(() => {
      // 1. Hide the dev color picker widget for a 100% clean production mockup
      const cp = document.getElementById('color-picker-widget-root');
      if (cp) {
        cp.style.display = 'none';
      }

      // 2. Set background transparent so the phone chassis and shadows render with clean alpha
      const pageWrapper = document.querySelector('.h-screen.w-screen');
      if (pageWrapper) {
        pageWrapper.style.backgroundColor = 'transparent';
      }

      // 3. Perform targeted scroll
      if ('${focusType}' === 'sponsored') {
        const spon = document.querySelector('[data-ad-role="sponsored-feed-card"]') ||
          Array.from(document.querySelectorAll('article')).find(el => el.innerText.includes('प्रायोजित'));
        if (spon) {
          spon.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      } else if ('${focusType}' === 'feed_ad') {
        const ad = document.querySelector('[data-ad-role="native-feed-ad"]') ||
          document.querySelectorAll('aside')[1] ||
          document.querySelector('aside');
        if (ad) {
          ad.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }

      // Find the phone chassis element bounding box
      const chassis = document.querySelector('.shadow-device') || document.getElementById('iphone-screen');
      if (!chassis) return null;
      const rect = chassis.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    })()`,
    returnByValue: true,
  });

  console.log('Chassis rect for ${focusType}:', scrollRes.result.value);
  await sleep(1200);

  const rect = scrollRes.result.value;
  let screenshotParams = {
    format: 'png',
    fromSurface: true,
  };

  if (rect && rect.width > 0 && rect.height > 0) {
    // Add small 20px padding around chassis for soft drop-shadow
    const pad = 24;
    screenshotParams.clip = {
      x: Math.max(0, rect.x - pad),
      y: Math.max(0, rect.y - pad),
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
      scale: 1,
    };
  }

  const result = await session.send('Page.captureScreenshot', screenshotParams);
  const buffer = Buffer.from(result.data, 'base64');
  console.log(`Captured screenshot for ${filename}: ${buffer.length} bytes`);

  const allNames = [filename, ...aliases];
  for (const name of allNames) {
    fs.writeFileSync(path.join('public', 'prototypes', name), buffer);
    fs.writeFileSync(path.join('src', 'flows', 'v2', 'assets', 'examples', name), buffer);
    fs.writeFileSync(path.join(artDir, name), buffer);
    console.log(`Saved: ${name}`);
  }

  session.close();
  await fetch(`http://127.0.0.1:9222/json/close/${tab.id}`);
}

async function main() {
  console.log('Launching headless Chrome on port 9222...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    // 1. Sponsored Card Screen Mockup (with highlight and 'स्पॉन्सर्ड' tag)
    await captureMockup(
      'http://localhost:5174/feed?direct=1&highlight=sponsored',
      'sponsored',
      'mockup-sponsored-card-screen.png',
      ['prototype-sponsored-article.png', 'preview-sponsored-card-screen.png', 'example_sponsored_article.png']
    );

    // 2. Feed Card Ad Screen Mockup (Bhopal Haat 3:1 banner with highlight)
    await captureMockup(
      'http://localhost:5174/feed?direct=1&ad=bhopal-haat&highlight=feed_ad',
      'feed_ad',
      'mockup-feed-card-screen.png',
      ['prototype-feed-banner.png', 'preview-feed-card-screen.png', 'example_feed_banner.png']
    );

    console.log('\nBoth mockups and all aliases captured and saved successfully!');
  } catch (err) {
    console.error('Error in capture:', err);
  } finally {
    chrome.kill();
  }
}

main();
