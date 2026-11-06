(function () {
  var KEY = 'fabrico_consent';

  // If already decided, no banner needed
  try { if (localStorage.getItem(KEY) !== null) return; } catch(e) {}

  // Inject styles
  var style = document.createElement('style');
  style.textContent =
    '#cb{position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
    'background:#0f0f0d;color:rgba(255,255,255,.75);' +
    'padding:16px 60px;display:flex;align-items:center;' +
    'justify-content:space-between;gap:24px;' +
    'font-family:Outfit,sans-serif;font-size:12px;font-weight:300;' +
    'border-top:1px solid rgba(255,255,255,.08);}' +
    '#cb p{margin:0;line-height:1.6;}' +
    '#cb a{color:#2e8a71;text-decoration:underline;}' +
    '#cb .ca{display:flex;gap:10px;flex-shrink:0;}' +
    '#cb-ok,#cb-no{padding:8px 20px;border:none;cursor:pointer;' +
    'font-family:Outfit,sans-serif;font-size:9px;font-weight:400;' +
    'letter-spacing:.15em;text-transform:uppercase;transition:all .2s;}' +
    '#cb-ok{background:#1b5e50;color:#fff;}' +
    '#cb-ok:hover{background:#2e8a71;}' +
    '#cb-no{background:transparent;color:rgba(255,255,255,.5);' +
    'border:1px solid rgba(255,255,255,.15);}' +
    '#cb-no:hover{border-color:rgba(255,255,255,.4);color:rgba(255,255,255,.75);}' +
    '@media(max-width:768px){#cb{flex-direction:column;align-items:flex-start;' +
    'padding:20px 24px;gap:16px;}}';
  document.head.appendChild(style);

  // Render banner
  var banner = document.createElement('div');
  banner.id = 'cb';
  banner.innerHTML =
    '<p>We use analytics cookies to understand how visitors use this site. ' +
    '<a href="/privacy-policy">Privacy&nbsp;Policy</a></p>' +
    '<div class="ca">' +
    '<button id="cb-ok">Accept</button>' +
    '<button id="cb-no">Decline</button>' +
    '</div>';
  document.body.appendChild(banner);

  // Accept
  document.getElementById('cb-ok').addEventListener('click', function () {
    try { localStorage.setItem(KEY, 'granted'); } catch(e) {}
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
    banner.remove();
  });

  // Decline
  document.getElementById('cb-no').addEventListener('click', function () {
    try { localStorage.setItem(KEY, 'denied'); } catch(e) {}
    banner.remove();
  });
})();
