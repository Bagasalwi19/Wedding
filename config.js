// Konfigurasi Integrasi Website Undangan Bagas & Vania
const WEDDING_CONFIG = {
  // Masukkan URL Google Apps Script Web App yang Anda peroleh setelah Deploy:
  // Contoh: "https://script.google.com/macros/s/AKfycbx.../exec"
  googleSheetWebAppUrl: "https://script.google.com/macros/s/AKfycbxTTSidq67xM7Usv15sySVSK6F-dtSsbWJoQHb1oKwai037Y72xCQmpuwtz1DexDedS/exec"
};

// Rekening Vania
const vaniaGiftCard = document.querySelector('#amplop-digital .gift-card:nth-child(2)');
if (vaniaGiftCard) {
  vaniaGiftCard.querySelector('.gift-bank').textContent = 'BANK BCA';
  vaniaGiftCard.querySelector('.gift-number').textContent = '0980648940';
  vaniaGiftCard.querySelector('.copy-account').dataset.account = '0980648940';
}
