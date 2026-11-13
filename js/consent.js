/* Kemetian Tours — cookie consent (Google Consent Mode v2).
   Loaded in <head> of every page, BEFORE Google Analytics.
   - EU/EEA, UK and Switzerland: analytics is OFF until the visitor accepts.
   - Everywhere else: analytics is ON, and the visitor can turn it off.
   The choice is kept in localStorage ("kt-consent" = "granted" | "denied").
   Any element with [data-cookie-settings] reopens the banner. */
(function(){
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  var EEA = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
  var ads = { ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' };
  gtag('consent','default', Object.assign({ analytics_storage:'denied', region:EEA, wait_for_update:500 }, ads));
  gtag('consent','default', Object.assign({ analytics_storage:'granted' }, ads));
  gtag('set','ads_data_redaction',true);

  var KEY = 'kt-consent', saved = null;
  try { saved = localStorage.getItem(KEY); } catch(e) {}
  if (saved === 'granted' || saved === 'denied') gtag('consent','update',{ analytics_storage:saved });

  var sv = (document.documentElement.lang || '').slice(0,2) === 'sv';
  var T = sv ? {
    text:'Vi använder cookies från Google Analytics för att förstå hur besökare använder webbplatsen. Inga annonscookies.',
    more:'Integritetspolicy', yes:'Godkänn', no:'Avböj'
  } : {
    text:'We use Google Analytics cookies to understand how visitors use this site. No advertising cookies.',
    more:'Privacy Policy', yes:'Accept', no:'Decline'
  };

  function choose(v){
    try { localStorage.setItem(KEY, v); } catch(e) {}
    gtag('consent','update',{ analytics_storage:v });
    var b = document.getElementById('kt-consent'); if (b) b.remove();
  }

  function show(){
    if (document.getElementById('kt-consent')) return;
    if (!document.getElementById('kt-consent-css')) {
      var s = document.createElement('style'); s.id = 'kt-consent-css';
      s.textContent =
        '#kt-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;' +
        'background:#15120d;color:#f5efe4;border:1px solid rgba(212,174,110,.35);border-radius:14px;padding:18px 20px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.35);font:14px/1.55 Outfit,system-ui,sans-serif}' +
        '#kt-consent p{margin:0 0 14px}#kt-consent a{color:#d4ae6e;text-decoration:underline}' +
        '#kt-consent .kt-c-btns{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
        '#kt-consent button{font:inherit;font-weight:500;cursor:pointer;border-radius:999px;padding:9px 22px;border:1px solid #d4ae6e}' +
        '#kt-consent .kt-c-no{background:transparent;color:#f5efe4}#kt-consent .kt-c-yes{background:#d4ae6e;color:#0c0a07}' +
        '#kt-consent button:focus-visible{outline:2px solid #f5efe4;outline-offset:2px}';
      document.head.appendChild(s);
    }
    var box = document.createElement('div');
    box.id = 'kt-consent'; box.setAttribute('role','dialog'); box.setAttribute('aria-label', sv ? 'Cookie-inställningar' : 'Cookie settings');
    box.innerHTML = '<p>' + T.text + ' <a href="/privacy">' + T.more + '</a></p>' +
      '<div class="kt-c-btns"><button type="button" class="kt-c-no">' + T.no + '</button><button type="button" class="kt-c-yes">' + T.yes + '</button></div>';
    box.querySelector('.kt-c-no').addEventListener('click', function(){ choose('denied'); });
    box.querySelector('.kt-c-yes').addEventListener('click', function(){ choose('granted'); });
    document.body.appendChild(box);
  }

  function init(){
    if (saved !== 'granted' && saved !== 'denied') show();
    document.addEventListener('click', function(e){
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
