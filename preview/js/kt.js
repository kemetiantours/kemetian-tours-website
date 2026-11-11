/* Kemetian Tours — shared site script (all pages).
   Every feature checks that its elements exist, so pages only get what they use. */

/* ---------- Analytics (Google Analytics 4) ----------
   Paste your Measurement ID (looks like "G-ABC123XYZ") between the quotes to
   switch tracking on for the whole site. Leave it empty to keep it off. */
var KT_GA_ID = '';

(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- analytics ---------- */
  window.ktTrack=function(name,params){try{if(window.gtag)window.gtag('event',name,params||{})}catch(_){}};
  if(KT_GA_ID){
    var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+KT_GA_ID;document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config',KT_GA_ID,{anonymize_ip:true});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href')||'',where=(a.closest('[data-track-area]')||{}).dataset;where=where&&where.trackArea||document.body.dataset.page||'';
    if(/wa\.me\//.test(h))ktTrack('whatsapp_click',{area:where,link_text:(a.textContent||'').trim().slice(0,60)});
    else if(/^mailto:/.test(h))ktTrack('email_click',{area:where});
    else if(/^tel:/.test(h))ktTrack('phone_click',{area:where});
    else if(/(^|\/)booking(\?|$|\.html)/.test(h))ktTrack('plan_trip_click',{area:where,link_text:(a.textContent||'').trim().slice(0,60)});
    else if(/tripadvisor\./.test(h))ktTrack('tripadvisor_click',{area:where});
  },true);

  /* ---------- destinations (single source of truth) ---------- */
  var C='https://res.cloudinary.com/cqqzdbnz/image/upload/f_auto,q_auto,w_900/';
  // [slug, name, tagline, image, card shape, focal point]
  var D=window.KT_DESTS=[
    ['giza','Giza','The last wonder of the ancient world','v1785531488/kemetian/2025/11/2023_04_01_15_13_IMG_3271-768x1024.webp','tall','42% 18%'],
    ['luxor','Luxor','The world\'s greatest open-air museum','v1785531508/kemetian/2025/11/WhatsApp-Image-2025-11-30-at-3.57.50-PM-768x1024.webp','tall','50% 35%'],
    ['aswan','Aswan','Nubian colour on the Nile','v1785531492/kemetian/2025/11/2023_04_23_12_00_IMG_4441-1024x768.webp','wide','50% 58%'],
    ['cairo','Cairo','A thousand minarets and a thousand years','v1785531502/kemetian/2025/11/MPNY1155-1024x768.webp','wide','50% 28%'],
    ['siwa','Siwa','Where tradition meets serenity','v1785531509/kemetian/2025/11/WhatsApp-Image-2025-11-30-at-4.08.33-PM-768x1024.webp','tall','50% 50%'],
    ['faiyum','Faiyum','Lakes, dunes and starry desert nights','v1785531511/kemetian/2025/11/WhatsApp-Image-2025-11-30-at-4.27.44-PM-682x1024.webp','tall','50% 62%'],
    ['dahab','Dahab','Red Sea reefs and Sinai calm','v1785531510/kemetian/2025/11/WhatsApp-Image-2025-11-30-at-4.25.03-PM-576x1024.webp','tall','50% 45%'],
    ['white-desert','The White Desert','Chalk sculptures under the stars','v1785531512/kemetian/2025/11/WhatsApp-Image-2025-11-30-at-4.32.56-PM-768x1024.webp','tall','50% 72%']
  ];
  window.ktImg=function(path,w){return 'https://res.cloudinary.com/cqqzdbnz/image/upload/f_auto,q_auto,w_'+(w||900)+'/'+path};
  document.querySelectorAll('[data-dest-grid]').forEach(function(grid){
    var skip=grid.getAttribute('data-exclude'),base=grid.getAttribute('data-base')||'',list=D.filter(function(d){return d[0]!==skip});
    if(grid.hasAttribute('data-simple'))list=list.slice(0,4);
    grid.innerHTML=list.map(function(d){
      var shape=grid.hasAttribute('data-simple')?'':d[4];
      return '<a class="dest '+shape+'" href="'+base+d[0]+'"><img src="'+C+d[3]+'" alt="'+d[1]+', Egypt" loading="lazy" style="object-position:'+d[5]+'"><span><b>'+d[1]+'</b><small>'+d[2]+' →</small></span></a>';
    }).join('');
  });

  /* ---------- FAQ tabs (homepage) ---------- */
  var tabs=document.getElementById('faqTabs'),panels=document.getElementById('faqPanels');
  if(tabs&&panels){
    var faq={
      'Booking':[
        ['How do I book a tour package?','Book through our website, by phone or on WhatsApp. Choose your package, share traveller details and pay to confirm.'],
        ['How far in advance should I book?','We recommend booking at least 2–3 months ahead, especially for peak season (October–April).'],
        ['Will I receive a confirmation?','Yes — you\'ll get a confirmation email with your itinerary, payment receipt and contact details.'],
        ['Can I book for a group?','Absolutely. We offer special rates and custom itineraries for groups. Contact us to arrange it.']],
      'Payment & refunds':[
        ['What payment methods do you accept?','Major credit cards, bank transfers and online payment gateways. Some packages allow installments.'],
        ['Is my payment refundable if I cancel?','It depends on the package — some allow free cancellation within a set period, others carry a fee. See our terms for details.'],
        ['Are there fees beyond the package price?','Any optional add-ons, taxes or service fees are always shown clearly before you confirm.'],
        ['What if my refund is delayed?','Processing times vary by payment method. If it takes longer than expected, contact us and we\'ll follow up.']],
      'Travel requirements':[
        ['Do I need a visa for Egypt?','It depends on your nationality. We can advise you and help with the visa process if needed.'],
        ['What documents should I bring?','A valid passport, your visa if required, and a copy of your booking confirmation.'],
        ['Can you help with flights?','Yes, we can arrange flight bookings as part of your travel package.']],
      'On the trip':[
        ['Will I have a tour guide?','Yes — most of our packages include a professional local Egyptologist guide.'],
        ['What if my flight is delayed?','Let us know right away and we\'ll adjust your itinerary and transfers.'],
        ['Can I request special meals?','Of course. Tell us your dietary preferences and we\'ll arrange suitable meals.'],
        ['Is there 24/7 support while travelling?','Yes, our team is available around the clock throughout your journey.']]
    },i=0;
    Object.keys(faq).forEach(function(k){
      var id='faq'+i;
      tabs.insertAdjacentHTML('beforeend','<button class="tab" role="tab" aria-controls="'+id+'" aria-selected="'+(i===0)+'">'+k+'</button>');
      panels.insertAdjacentHTML('beforeend','<div class="faq-panel" role="tabpanel" id="'+id+'"'+(i?' hidden':'')+'>'+faq[k].map(function(q){return '<details><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'}).join('')+'</div>');
      i++;
    });
    tabs.addEventListener('click',function(e){
      var b=e.target.closest('.tab');if(!b)return;
      tabs.querySelectorAll('.tab').forEach(function(t){t.setAttribute('aria-selected',t===b)});
      panels.querySelectorAll('.faq-panel').forEach(function(p){p.hidden=p.id!==b.getAttribute('aria-controls')});
    });
  }

  /* ---------- header ---------- */
  var nav=document.getElementById('nav'),links=document.getElementById('navLinks'),burger=document.getElementById('burger');
  if(nav){
    var onScroll=function(){nav.classList.toggle('stuck',window.scrollY>80||nav.classList.contains('solid'))};
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  }
  if(burger&&links){
    burger.addEventListener('click',function(){
      var o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o);
      burger.innerHTML=o?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
      document.documentElement.style.overflow=o?'hidden':'';
    });
    links.addEventListener('click',function(e){if(e.target.closest('a')&&links.classList.contains('open'))burger.click()});
  }

  /* ---------- word-by-word headings ---------- */
  document.querySelectorAll('main h2:not(.no-split)').forEach(function(h){
    if(!h.classList.contains('split'))h.classList.add('split');
    var n=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var f=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(part){
            if(!part)return;
            if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part));return}
            var w=document.createElement('span');w.className='w';w.textContent=part;w.style.transitionDelay=(n++*0.06)+'s';f.appendChild(w);
          });
          node.replaceChild(f,c);
        }else if(c.nodeType===1){walk(c)}
      });
    })(h);
  });
  document.querySelectorAll('.stagger').forEach(function(g){
    Array.prototype.forEach.call(g.children,function(c,i){c.style.transitionDelay=(i*0.09)+'s'});
  });

  /* ---------- YouTube background videos ----------
     IFrame API: no playlist reload on loop; fade to black across the loop point. */
  var vboxes=[].slice.call(document.querySelectorAll('.vbg[data-yt]')),ytQueue=[],ytReady=false;
  function ytLoadApi(){
    if(window.YT&&window.YT.Player){ytReady=true;return}
    if(document.getElementById('yt-api'))return;
    var t=document.createElement('script');t.id='yt-api';t.src='https://www.youtube.com/iframe_api';document.head.appendChild(t);
  }
  window.onYouTubeIframeAPIReady=function(){ytReady=true;ytQueue.splice(0).forEach(makePlayer)};
  function makePlayer(box){
    var holder=document.createElement('div');box.appendChild(holder);
    var timer;
    new YT.Player(holder,{
      videoId:box.getAttribute('data-yt'),host:'https://www.youtube-nocookie.com',
      playerVars:{autoplay:1,mute:1,controls:0,vq:'hd1080',playsinline:1,rel:0,modestbranding:1,iv_load_policy:3,disablekb:1,fs:0,cc_load_policy:0},
      events:{
        onReady:function(e){
          var f=e.target.getIframe();f.setAttribute('tabindex','-1');f.setAttribute('aria-hidden','true');f.title='';
          (window.ktPlayers=window.ktPlayers||[]).push(e.target);
          e.target.mute();try{e.target.setPlaybackQuality('hd1080')}catch(_){}e.target.playVideo();
          clearInterval(timer);
          timer=setInterval(function(){
            try{var d=e.target.getDuration(),c=e.target.getCurrentTime();
              if(d&&c>d-0.9&&!box.dataset.dip){
                box.dataset.dip=1;box.classList.add('dip');
                setTimeout(function(){e.target.seekTo(0.05,true)},480);
                setTimeout(function(){box.classList.remove('dip')},1500);
                setTimeout(function(){delete box.dataset.dip},2200);
              }}catch(_){}
          },200);
        },
        onStateChange:function(e){
          if(e.data===YT.PlayerState.PLAYING&&!box.classList.contains('playing')){
            setTimeout(function(){box.classList.add('playing')},700);
          }
          if(e.data===YT.PlayerState.ENDED){e.target.seekTo(0.05,true);e.target.playVideo()}
        }
      }
    });
  }
  function loadVideo(box){
    if(box.dataset.loaded)return;box.dataset.loaded=1;
    if(ytReady)makePlayer(box);else{ytQueue.push(box);ytLoadApi()}
  }
  if(!reduce&&vboxes.length){
    ytLoadApi();loadVideo(vboxes[0]);
    var vio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){loadVideo(en.target);vio.unobserve(en.target)}})},{rootMargin:'900px'});
    vboxes.slice(1).forEach(function(b){vio.observe(b)});
  }

  /* ---------- parallax ---------- */
  var px=[].slice.call(document.querySelectorAll('.parallax'));
  if(px.length&&!reduce){
    var ticking=false;
    var upd=function(){px.forEach(function(el){var r=el.getBoundingClientRect();var c=r.top+r.height/2-window.innerHeight/2;el.style.transform='translateY('+(c*parseFloat(el.dataset.speed)).toFixed(1)+'px)'});ticking=false};
    window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(upd);ticking=true}},{passive:true});upd();
  }

  /* ---------- 3D tilt on destination cards (mouse only) ---------- */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
    document.querySelectorAll('[data-dest-grid]').forEach(function(grid){
      grid.addEventListener('mousemove',function(e){
        var d=e.target.closest('.dest');if(!d)return;
        var r=d.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        d.classList.add('tilting');d.style.transform='perspective(900px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg)';
      });
      grid.addEventListener('mouseout',function(e){
        var d=e.target.closest('.dest');if(d&&!d.contains(e.relatedTarget)){d.classList.remove('tilting');d.style.transition='transform .6s ease';d.style.transform='';setTimeout(function(){d.style.transition=''},600)}
      });
    });
  }

  /* ---------- reviews carousel ---------- */
  var rt=document.getElementById('rvTrack');
  if(rt){
    var step=function(dir){var c=rt.querySelector('.rv');rt.scrollBy({left:dir*((c?c.offsetWidth:360)+20),behavior:reduce?'auto':'smooth'})};
    var pv=document.getElementById('rvPrev'),nx=document.getElementById('rvNext');
    if(pv)pv.addEventListener('click',function(){step(-1)});
    if(nx)nx.addEventListener('click',function(){step(1)});
  }

  /* ---------- gallery lightbox ---------- */
  var gal=[].slice.call(document.querySelectorAll('[data-lightbox] a'));
  if(gal.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
    lb.innerHTML='<button class="lb-x" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><button class="lb-p" aria-label="Previous photo"><i class="fa-solid fa-arrow-left"></i></button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Next photo"><i class="fa-solid fa-arrow-right"></i></button>';
    document.body.appendChild(lb);
    var cur=0,img=lb.querySelector('img'),cap=lb.querySelector('figcaption'),last=null;
    var show=function(i){cur=(i+gal.length)%gal.length;var a=gal[cur];img.src=a.getAttribute('href');img.alt=a.querySelector('img').alt;cap.textContent=a.getAttribute('data-caption')||a.querySelector('img').alt};
    var open=function(i){last=document.activeElement;show(i);lb.classList.add('on');document.documentElement.style.overflow='hidden';lb.querySelector('.lb-x').focus()};
    var close=function(){lb.classList.remove('on');document.documentElement.style.overflow='';if(last)last.focus()};
    gal.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i)})});
    lb.querySelector('.lb-x').addEventListener('click',close);
    lb.querySelector('.lb-p').addEventListener('click',function(){show(cur-1)});
    lb.querySelector('.lb-n').addEventListener('click',function(){show(cur+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
    var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))},{passive:true});
  }

  /* ---------- reveal on scroll ---------- */
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal,.split,.stagger').forEach(function(el){io.observe(el)});
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
})();
