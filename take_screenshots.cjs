const puppeteer = require('puppeteer');
const fs = require('fs');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:5173');
  
  await page.evaluate(() => {
    localStorage.setItem('billium_welcomed_v2', 'true');
    localStorage.setItem('billium_db', JSON.stringify({ type: 'sqlite', name: 'billium.db' }));
  });
  
  await page.reload();
  await wait(2000);
  
  console.log('Capturing Dashboard...');
  await page.screenshot({ path: 'docs/images/dashboard.png' });
  
  console.log('Capturing Settings...');
  await page.evaluate(() => {
    const menus = Array.from(document.querySelectorAll('a, button, div'));
    const settings = menus.find(a => a.textContent && a.textContent.trim() === 'Settings');
    if (settings) settings.click();
  });
  await wait(1000);
  await page.screenshot({ path: 'docs/images/settings.png' });

  console.log('Capturing Clients...');
  await page.evaluate(() => {
    const menus = Array.from(document.querySelectorAll('a, button, div'));
    const clients = menus.find(a => a.textContent && a.textContent.trim() === 'Clients');
    if (clients) clients.click();
  });
  await wait(1000);
  await page.screenshot({ path: 'docs/images/clients.png' });

  console.log('Capturing Invoice Editor...');
  await page.evaluate(() => {
    const menus = Array.from(document.querySelectorAll('a, button, div'));
    const invoices = menus.find(a => a.textContent && a.textContent.trim() === 'Invoices');
    if (invoices) invoices.click();
  });
  await wait(1000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const newBtn = btns.find(b => b.textContent && (b.textContent.includes('New Invoice') || b.textContent.includes('Create')));
    if (newBtn) newBtn.click();
  });
  await wait(1000);
  await page.screenshot({ path: 'docs/images/invoice-editor.png' });

  await browser.close();
  console.log('Done!');
})();
