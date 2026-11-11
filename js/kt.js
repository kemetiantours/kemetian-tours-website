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
        ['What payment methods do you accept?','Major credit cards, bank transfers and online payment gateways.'],
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

  /* ---------- scroll cue: hide after scrolling a little, show again at the top ---------- */
  var cue=document.querySelector('.scroll-cue');
  if(cue){var cueUpd=function(){cue.classList.toggle('gone',window.scrollY>60)};window.addEventListener('scroll',cueUpd,{passive:true});cueUpd()}

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

  /* ---------- gallery lightbox (works for galleries added later too) ---------- */
  var lb=null,lbItems=[],cur=0,lastFocus=null,fullCache={};
  function lbBuild(){
    lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
    lb.innerHTML='<button class="lb-x" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><button class="lb-p" aria-label="Previous photo"><i class="fa-solid fa-arrow-left"></i></button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Next photo"><i class="fa-solid fa-arrow-right"></i></button>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-x').addEventListener('click',lbClose);
    lb.querySelector('.lb-p').addEventListener('click',function(){lbShow(cur-1)});
    lb.querySelector('.lb-n').addEventListener('click',function(){lbShow(cur+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbShow(cur-1);if(e.key==='ArrowRight')lbShow(cur+1)});
    var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)lbShow(cur+(dx<0?1:-1))},{passive:true});
  }
  function lbShow(i){
    cur=(i+lbItems.length)%lbItems.length;var a=lbItems[cur],im=a.querySelector('img'),big=lb.querySelector('img'),id=a.getAttribute('data-media-id');
    big.src=id?(fullCache[id]||(im?im.src:'')):a.getAttribute('href');
    big.alt=im?im.alt:'';lb.querySelector('figcaption').textContent=a.getAttribute('data-caption')||'';
    if(id&&!fullCache[id]&&window.ktMediaFull){var want=cur;window.ktMediaFull(id).then(function(u){if(u){fullCache[id]=u;if(cur===want)big.src=u}})}
  }
  function lbClose(){lb.classList.remove('on');document.documentElement.style.overflow='';if(lastFocus)lastFocus.focus()}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-lightbox] a');if(!a)return;
    e.preventDefault();if(!lb)lbBuild();
    lbItems=[].slice.call(a.closest('[data-lightbox]').querySelectorAll('a'));lastFocus=a;
    lbShow(lbItems.indexOf(a));lb.classList.add('on');document.documentElement.style.overflow='hidden';lb.querySelector('.lb-x').focus();
  });

  /* ---------- photos managed from the Events Admin dashboard (Photos tab) ----------
     Firestore siteContent/media  -> items: [{id, group, role:'cover'|'gallery', caption, order}]
     Firestore siteContent/media_<id> -> { thumb, full }   (data URLs or https URLs)
     group is 'home' (homepage traveller gallery) or a destination slug.
     Nothing uploaded yet = the built-in photos stay. */
  function esc(t){var d=document.createElement('div');d.textContent=t==null?'':String(t);return d.innerHTML}
  var MEDIA=null;
  function fsBase(c){return 'https://firestore.googleapis.com/v1/projects/'+c.projectId+'/databases/(default)/documents'}
  function getCfg(){return import(new URL('js/firebase-config.js',document.baseURI).href).then(function(m){return m.firebaseConfig})}
  function fetchFields(c,ids,field){
    if(!ids.length)return Promise.resolve({});
    var root='projects/'+c.projectId+'/databases/(default)/documents/siteContent/media_';
    var chunks=[];for(var i=0;i<ids.length;i+=40)chunks.push(ids.slice(i,i+40));
    return Promise.all(chunks.map(function(ch){
      return fetch(fsBase(c)+':batchGet?key='+c.apiKey,{method:'POST',body:JSON.stringify({documents:ch.map(function(id){return root+id}),mask:{fieldPaths:[field]}})}).then(function(r){return r.ok?r.json():[]});
    })).then(function(parts){
      var out={};parts.forEach(function(arr){(arr||[]).forEach(function(x){
        if(!x.found)return;var id=x.found.name.split('/siteContent/media_')[1],f=x.found.fields&&x.found.fields[field];
        if(f&&f.stringValue&&/^(data:image\/|https:\/\/)/.test(f.stringValue))out[id]=f.stringValue;
      })});return out;
    });
  }
  window.ktMediaFull=function(id){return getCfg().then(function(c){return fetchFields(c,[id],'full')}).then(function(m){return m[id]})};
  function galleryHtml(list,thumbs,alt){
    return list.filter(function(it){return thumbs[it.id]}).map(function(it){
      return '<a href="#" data-media-id="'+esc(it.id)+'" data-caption="'+esc(it.caption)+'"><img src="'+esc(thumbs[it.id])+'" alt="'+esc(it.caption||alt)+'" loading="lazy"></a>';
    }).join('');
  }
  var wantCards=document.querySelector('[data-dest-grid]'),heroEl=document.querySelector('[data-city-hero]'),
      cityGal=document.querySelector('[data-city-gallery]'),homeGal=document.querySelector('[data-media-gallery]');
  if(wantCards||heroEl||cityGal||homeGal){
    getCfg().then(function(c){
      return fetch(fsBase(c)+'/siteContent/media?key='+c.apiKey).then(function(r){return r.ok?r.json():null}).then(function(j){
        var arr=j&&j.fields&&j.fields.items&&j.fields.items.arrayValue&&j.fields.items.arrayValue.values||[];
        MEDIA=arr.map(function(v){var f=(v.mapValue&&v.mapValue.fields)||{},g=function(k){return f[k]&&(f[k].stringValue!=null?f[k].stringValue:f[k].integerValue!=null?Number(f[k].integerValue):f[k].doubleValue)};
          return {id:g('id'),group:g('group'),role:g('role'),caption:g('caption')||'',order:Number(g('order')||0)}}).filter(function(x){return x.id&&x.group});
        MEDIA.sort(function(a,b){return a.order-b.order});
        if(!MEDIA.length)return;
        var covers={};MEDIA.forEach(function(m){if(m.role==='cover')covers[m.group]=m});
        var thumbIds=[],fullIds=[];
        if(wantCards)D.forEach(function(d){if(covers[d[0]])thumbIds.push(covers[d[0]].id)});
        var heroSlug=heroEl&&heroEl.getAttribute('data-city-hero');if(heroSlug&&covers[heroSlug])fullIds.push(covers[heroSlug].id);
        var galSlug=cityGal&&cityGal.getAttribute('data-city-gallery'),cityList=galSlug?MEDIA.filter(function(m){return m.group===galSlug&&m.role==='gallery'}):[];
        var homeList=homeGal?MEDIA.filter(function(m){return m.group==='home'&&m.role==='gallery'}):[];
        cityList.concat(homeList).forEach(function(m){thumbIds.push(m.id)});
        return Promise.all([fetchFields(c,thumbIds,'thumb'),fetchFields(c,fullIds,'full')]).then(function(res){
          var thumbs=res[0],fulls=res[1];
          if(wantCards)D.forEach(function(d){var cv=covers[d[0]];if(cv&&thumbs[cv.id])document.querySelectorAll('[data-dest-grid] a[href$="'+d[0]+'"] img').forEach(function(i){i.src=thumbs[cv.id];i.style.objectPosition='50% 50%'})});
          if(heroSlug&&covers[heroSlug]&&fulls[covers[heroSlug].id]){heroEl.style.backgroundImage="url('"+fulls[covers[heroSlug].id]+"')";heroEl.style.backgroundPosition='50% 50%'}
          if(cityGal&&cityList.length){var h=galleryHtml(cityList,thumbs,'Egypt');if(h){cityGal.innerHTML=h;var s=cityGal.closest('[data-gallery-section]');if(s)s.hidden=false}}
          if(homeGal&&homeList.length){var h2=galleryHtml(homeList,thumbs,'Kemetian Tours travellers in Egypt');if(h2){homeGal.innerHTML=h2;var s2=homeGal.closest('[data-gallery-section]');if(s2){s2.hidden=false;s2.querySelectorAll('.reveal').forEach(function(x){x.classList.add('in')})}}}
        });
      });
    }).catch(function(e){console.error('photos: could not load',e)});
  }

  /* ---------- reveal on scroll ---------- */
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal,.split,.stagger').forEach(function(el){io.observe(el)});
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
})();
