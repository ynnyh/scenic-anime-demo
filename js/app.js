/* =========================================================
 * 交互层：平移/缩放/筛选/选点/详情/A* 步行路线
 * ========================================================= */
import { POIS, CATS, NODES, EDGES, UNIT_M, START_NODE } from './data.js'
import { buildArt } from './art.js'

const SVG_NS = 'http://www.w3.org/2000/svg'
const WORLD_W = 1040, WORLD_H = 720

const stage = document.getElementById('stage')
const svg = document.getElementById('svg')
const world = document.getElementById('world')
const pinLayer = document.getElementById('pins')
const routeLayer = document.getElementById('routeLayer')

/* ---------- defs + 纸面 + 美术 ---------- */
svg.insertAdjacentHTML('afterbegin', `
<defs>
  <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="9"/>
  </filter>
  <filter id="wash"><feGaussianBlur stdDeviation="10"/></filter>
  <radialGradient id="vignette" cx="50%" cy="46%" r="72%">
    <stop offset="62%" stop-color="#5a4a2e" stop-opacity="0"/>
    <stop offset="100%" stop-color="#b89a68" stop-opacity=".13"/>
  </radialGradient>
</defs>
<rect width="100%" height="100%" fill="url(#vignette)" pointer-events="none"/>`)
document.getElementById('art').innerHTML = `
<rect x="0" y="0" width="1040" height="720" fill="#f5ecd6"/>
<rect x="14" y="14" width="1012" height="692" rx="10" fill="none" stroke="#d5c39b" stroke-width="2"/>
<rect x="20" y="20" width="1000" height="680" rx="8" fill="none" stroke="#e3d5b4" stroke-width="1"/>
${buildArt()}`

/* ---------- POI 标记 ---------- */
function pinHTML(p, idx){
  const cat = CATS[p.cat], r = p.main?19 : p.small?11.5 : 15.5
  const fs = p.main?17 : p.small?9.5 : 14
  const plaque = p.small
    ? `<g class="plaque plaque-wc" transform="translate(0,${r+18})">
        <rect x="-20" y="-10" width="40" height="17" rx="8.5" fill="rgba(255,250,238,.94)" stroke="#c3b38c" stroke-width="1"/>
        <text text-anchor="middle" y="2.5" font-size="10.5" fill="${CATS.wc.color}" font-weight="700">卫生间</text></g>`
    : `<g class="plaque" transform="translate(0,${r+15})">
        <rect x="${-(p.name.length*7.2+9)}" y="-11" width="${p.name.length*14.4+18}" height="19" rx="9.5"
          fill="rgba(255,250,238,.93)" stroke="#c3b38c" stroke-width="1.1"/>
        <text text-anchor="middle" y="2.8" font-size="12.5" fill="#4a3d2c"
          font-family="STKaiti,KaiTi,'Songti SC',serif" font-weight="700" letter-spacing="1">${p.name}</text></g>`
  return `<g class="pin cat-${p.cat}${p.main?' main':''}" data-id="${p.id}" transform="translate(${p.x},${p.y})">
    <g class="pinpop" style="animation-delay:${0.9+idx*.045}s">
    ${p.main?`<circle class="pinpulse" r="${r}" fill="none" stroke="${cat.color}" stroke-width="3"/>`:''}
    <ellipse cx="1.5" cy="${r*.55+3}" rx="${r+2}" ry="${r*.42+2}" fill="#4a3d2c" opacity=".14"/>
    <circle class="ring" r="${r+3.2}" fill="#fffaf0" stroke="#c9b78f" stroke-width="1.1"/>
    <circle class="disc" r="${r}" fill="${cat.color}" stroke="#fff" stroke-width="2"/>
    <text y="${fs*.36}" text-anchor="middle" font-size="${fs}" fill="#fff"
      font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-weight="800">${p.char}</text>
    ${plaque}
    </g>
  </g>`
}
pinLayer.innerHTML = POIS.map((p,i)=>pinHTML(p,i)).join('')

/* ---------- 道路生长动画 ---------- */
function growPath(el, dur, delay){
  const len = el.getTotalLength()
  el.style.strokeDasharray = len
  el.style.strokeDashoffset = len
  el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ el.style.strokeDashoffset = 0 }))
}
growPath(document.getElementById('r-loop-edge'), 1500, 100)
growPath(document.getElementById('r-loop'), 1500, 100)
document.querySelectorAll('.r-br-edge').forEach(el=>growPath(el,900,500+(+el.dataset.i)*70))
document.querySelectorAll('.r-br').forEach(el=>growPath(el,900,500+(+el.dataset.i)*70))

/* ---------- 视口（平移/缩放） ---------- */
const st = { k:1, x:0, y:0 }
let k0 = 1
function fit(){
  const W = stage.clientWidth, H = stage.clientHeight
  k0 = Math.min(W/WORLD_W, H/WORLD_H) * 1.02
  return {
    k: k0*1.18,
    x: W/2 - WORLD_W*k0*1.18/2,
    y: H/2 - WORLD_H*k0*1.18/2,
    k0k: k0,
  }
}
function apply(){ world.setAttribute('transform',`translate(${st.x},${st.y}) scale(${st.k})`); scheduleAutoEnter() }
function clampPan(){
  const W = stage.clientWidth, H = stage.clientHeight
  const w = WORLD_W*st.k, h = WORLD_H*st.k
  if(w >= W) st.x = Math.min(0, Math.max(W-w, st.x)); else st.x = Math.min(W-w, Math.max(0, st.x))
  if(h >= H) st.y = Math.min(0, Math.max(H-h, st.y)); else st.y = Math.min(H-h, Math.max(0, st.y))
}
function toWorld(cx,cy){ const r=svg.getBoundingClientRect(); return {x:(cx-r.left-st.x)/st.k, y:(cy-r.top-st.y)/st.k} }
function zoomAt(cx,cy,f){
  const w0 = toWorld(cx,cy)
  st.k = Math.max(k0*.85, Math.min(k0*4.4, st.k*f))
  st.x = cx - svg.getBoundingClientRect().left - w0.x*st.k
  st.y = cy - svg.getBoundingClientRect().top - w0.y*st.k
  clampPan(); apply()
}
let anim = null
function tweenTo(tx,ty,tk,dur=650){
  anim = { from:{...st}, to:{x:tx,y:ty,k:tk}, t0:performance.now(), dur }
  const tick=now=>{ if(!anim) return
    const e=Math.min(1,(now-anim.t0)/anim.dur), e2=1-Math.pow(1-e,3)
    st.k=anim.from.k+(anim.to.k-anim.from.k)*e2
    st.x=anim.from.x+(anim.to.x-anim.from.x)*e2
    st.y=anim.from.y+(anim.to.y-anim.from.y)*e2
    clampPan(); apply()
    if(e<1) requestAnimationFrame(tick); else anim=null }
  requestAnimationFrame(tick)
}
function centerOn(wx,wy){
  const W=stage.clientWidth, H=stage.clientHeight
  const tk=Math.max(k0*1.7, st.k<k0*1.4? k0*1.9 : st.k)
  const fx = W<720 ? W/2 : W*0.4
  tweenTo(fx-wx*tk, H*(W<720?.33:.5)-wy*tk, tk)
}
/* ---------- 实景场景：放大自动落进 720° 全景（Marzipano） ---------- */
const sceneView=document.getElementById('sceneView')
let sceneOpen=false, panoViewer=null, panoView=null
let lastExit=0, curPoi=null, settleTimer=null

/* 自动进入：缩放足够深 + 全景点位在视野中心附近，且不在退出冷却期 */
function scheduleAutoEnter(){
  clearTimeout(settleTimer)
  settleTimer=setTimeout(checkAutoEnter,260)
}
function checkAutoEnter(){
  if(sceneOpen || Date.now()-lastExit<2500) return
  if(st.k < k0*2.8) return
  const W=stage.clientWidth, H=stage.clientHeight
  const cx=(W/2-st.x)/st.k, cy=(H/2-st.y)/st.k
  const p=POIS.find(p=>p.scene && Math.hypot(p.x-cx,p.y-cy)<=110)
  if(p) enterScene(p)
}

function enterScene(p){
  if(!p.scene||sceneOpen) return
  sceneOpen=true; curPoi=p; closePanel()
  /* 推镜：先把点位继续放大推向满屏，再展开全景 */
  const W=stage.clientWidth, H=stage.clientHeight
  const tk=Math.max(st.k, k0*3.6)
  tweenTo(W/2-p.x*tk, H/2-p.y*tk, tk, 700)
  setTimeout(()=>showPano(p), 620)
}
function showPano(p){
  const r=svg.getBoundingClientRect()
  const sx=r.left+p.x*st.k+st.x, sy=r.top+p.y*st.k+st.y
  sceneView.innerHTML=`
    <div id="pano"></div>
    <div class="sv-top">
      <button class="sv-back" id="svBack">‹ 回到地图</button>
      <div class="sv-title"><span>实景</span><b>${p.scene.name}</b></div>
      <button class="sv-x" id="svX" aria-label="关闭">✕</button>
    </div>
    <div class="pano-hint">拖动环顾四周 · 双指张开退回地图</div>`
  sceneView.style.transition='none'
  sceneView.style.visibility='visible'
  sceneView.setAttribute('aria-hidden','false')
  sceneView.style.clipPath=`circle(0px at ${sx}px ${sy}px)`
  initPano(p.scene.pano)
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    sceneView.style.transition='clip-path .8s cubic-bezier(.5,.06,.2,1)'
    sceneView.style.clipPath=`circle(150% at ${sx}px ${sy}px)`
  }))
  document.getElementById('svBack').onclick=exitScene
  document.getElementById('svX').onclick=exitScene
}
function initPano(src){
  panoViewer=new Marzipano.Viewer(document.getElementById('pano'),{controls:{mouseViewMode:'drag'}})
  const source=Marzipano.ImageUrlSource.fromString(src)
  const geometry=new Marzipano.EquirectGeometry([{width:4096}])
  const limiter=Marzipano.RectilinearView.limit.traditional(4096, 120*Math.PI/180, 176*Math.PI/180)
  panoView=new Marzipano.RectilinearView({yaw:0,pitch:0,fov:1.3}, limiter)
  const scene=panoViewer.createScene({source,geometry,view:panoView})
  scene.switchTo({transitionDuration:0})
  /* 双指张开把视野拉到最广 → 退回地图 */
  panoView.addEventListener('change',()=>{ if(sceneOpen && panoView.fov()>1.7) exitScene() })
}
function exitScene(){
  if(!sceneOpen) return
  const p=curPoi
  const r=svg.getBoundingClientRect()
  const sx=r.left+p.x*st.k+st.x, sy=r.top+p.y*st.k+st.y
  sceneView.style.transition='clip-path .6s cubic-bezier(.55,.06,.6,1)'
  sceneView.style.clipPath=`circle(0px at ${sx}px ${sy}px)`
  let done=false
  const finish=()=>{ if(done) return; done=true
    if(document.activeElement && sceneView.contains(document.activeElement)) document.activeElement.blur()
    sceneView.style.visibility='hidden'; sceneView.style.transition='none'
    sceneView.setAttribute('aria-hidden','true')
    if(panoViewer){ panoViewer.destroy(); panoViewer=null; panoView=null }
    sceneOpen=false; lastExit=Date.now() }
  sceneView.addEventListener('transitionend',finish,{once:true})
  setTimeout(finish,700)
  /* 地图缩回到舒适视野，避免一退出又触发进入 */
  const W=stage.clientWidth, H=stage.clientHeight
  const tk=k0*1.6
  tweenTo(W/2-p.x*tk, H*(W<720?.38:.5)-p.y*tk, tk, 650)
}
addEventListener('keydown',e=>{ if(e.key==='Escape') exitScene() })

/* 初始化 */
{
  const f=fit(); st.k=f.k; st.x=f.x; st.y=f.y; apply()
  setTimeout(()=>tweenTo(stage.clientWidth/2-WORLD_W*k0/2, stage.clientHeight/2-WORLD_H*k0/2, k0, 1400), 250)
}
addEventListener('resize',()=>{ const f=fit(); k0=f.k0k; st.k=Math.max(st.k,k0); clampPan(); apply() })

/* ---------- 指针：拖拽/惯性/双指缩放/滚轮 ---------- */
const pointers = new Map()
let moved=0, last=null, vel={x:0,y:0}, inertia=null
svg.addEventListener('pointerdown',e=>{
  anim=null; stopInertia()
  svg.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})
  moved=0; last={x:e.clientX,y:e.clientY,t:performance.now()}; vel={x:0,y:0}
  svg.dataset.mode='pan'
})
svg.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)) return
  const prev=pointers.get(e.pointerId)
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})
  if(pointers.size===2){
    const [a,b]=[...pointers.values()]
    if(!svg._pinch){ svg._pinch={d:Math.hypot(a.x-b.x,a.y-b.y),m:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},k:st.k,x:st.x,y:st.y}; return }
    const q=svg._pinch, nd=Math.hypot(a.x-b.x,a.y-b.y), nm={x:(a.x+b.x)/2,y:(a.y+b.y)/2}
    const nk=Math.max(k0*.85,Math.min(k0*4.4,q.k*nd/q.d))
    const r=svg.getBoundingClientRect()
    const wx=(q.m.x-r.left-q.x)/q.k, wy=(q.m.y-r.top-q.y)/q.k
    st.k=nk; st.x=nm.x-r.left-wx*nk+(q.m.x-nm.x); st.y=nm.y-r.top-wy*nk+(q.m.y-nm.y)
    clampPan(); apply(); moved=10
    return
  }
  const dx=e.clientX-prev.x, dy=e.clientY-prev.y
  moved+=Math.abs(dx)+Math.abs(dy)
  st.x+=dx; st.y+=dy; clampPan(); apply()
  const now=performance.now(), dt=Math.max(8,now-last.t)
  vel.x=dx/dt*16; vel.y=dy/dt*16; last={x:e.clientX,y:e.clientY,t:now}
})
function endPointer(e){
  if(pointers.has(e.pointerId)) pointers.delete(e.pointerId)
  svg._pinch=null
  if(pointers.size===0 && moved<7) svg.dataset.mode='tap'
  if(pointers.size===0 && moved>=7 && Math.hypot(vel.x,vel.y)>2) startInertia()
}
svg.addEventListener('pointerup',endPointer)
svg.addEventListener('pointercancel',endPointer)
svg.addEventListener('wheel',e=>{ e.preventDefault(); zoomAt(e.clientX,e.clientY,e.deltaY<0?1.14:.88) },{passive:false})
function startInertia(){
  stopInertia()
  const step=()=>{ vel.x*=.93; vel.y*=.93; st.x+=vel.x; st.y+=vel.y; clampPan(); apply()
    if(Math.hypot(vel.x,vel.y)>.4) inertia=requestAnimationFrame(step) }
  inertia=requestAnimationFrame(step)
}
function stopInertia(){ if(inertia){cancelAnimationFrame(inertia);inertia=null} }

/* ---------- 缩放按钮 ---------- */
document.getElementById('zin').onclick=()=>zoomAt(stage.clientWidth/2,stage.clientHeight/2,1.3)
document.getElementById('zout').onclick=()=>zoomAt(stage.clientWidth/2,stage.clientHeight/2,.77)
document.getElementById('zfit').onclick=()=>tweenTo(stage.clientWidth/2-WORLD_W*k0/2, stage.clientHeight/2-WORLD_H*k0/2, k0, 600)

/* ---------- 分类筛选 ---------- */
const chips=document.querySelectorAll('.chip')
chips.forEach(ch=>ch.onclick=()=>{
  chips.forEach(c=>c.classList.remove('on')); ch.classList.add('on')
  const cat=ch.dataset.cat
  pinLayer.querySelectorAll('.pin').forEach(el=>{
    el.classList.toggle('dim', cat!=='all' && !el.classList.contains('cat-'+cat))
  })
})

/* ---------- A* ---------- */
const adj={}
EDGES.forEach(([a,b])=>{ (adj[a]??=[]).push(b); (adj[b]??=[]).push(a) })
const dist=(a,b)=>Math.hypot(NODES[a].x-NODES[b].x,NODES[a].y-NODES[b].y)
function astar(start,goal){
  const open=new Set([start]), from={}, g={[start]:0}, f={[start]:dist(start,goal)}, closed=new Set()
  while(open.size){
    let cur=null
    for(const n of open) if(cur===null||f[n]<f[cur]) cur=n
    if(cur===goal){ const path=[cur]; while(from[cur]){cur=from[cur];path.unshift(cur)} return path }
    open.delete(cur); closed.add(cur)
    for(const nb of adj[cur]||[]){
      if(closed.has(nb)) continue
      const tg=g[cur]+dist(cur,nb)
      if(tg<(g[nb]??Infinity)){ from[nb]=cur; g[nb]=tg; f[nb]=tg+dist(nb,goal); open.add(nb) }
    }
  }
  return null
}

/* ---------- 详情面板 ---------- */
const panel=document.getElementById('panel')
let selected=null, routeOn=false
function fmtRoute(id){
  const seq=astar(START_NODE,id)
  if(!seq) return null
  const pts=seq.map(n=>`${NODES[n].x},${NODES[n].y}`).join(' ')
  let len=0; for(let i=1;i<seq.length;i++) len+=dist(seq[i-1],seq[i])
  return { pts, meters:Math.round(len*UNIT_M/10)*10, mins:Math.max(1,Math.ceil(len*UNIT_M/75)) }
}
function openPanel(p){
  selected=p; routeOn=false; routeLayer.innerHTML=''
  pinLayer.querySelectorAll('.pin').forEach(el=>el.classList.toggle('selected',el.dataset.id===p.id))
  const cat=CATS[p.cat], r=fmtRoute(p.node)
  panel.innerHTML=`
    <div class="p-head" style="background:${cat.color}">
      <span class="p-char">${p.char}</span>
      <div><h2>${p.name}</h2><div class="p-cat">${cat.label}</div></div>
      <button class="p-x" id="pClose" aria-label="关闭">✕</button>
    </div>
    <div class="p-body">
      ${r?`<div class="p-meta">距北大门约 ${r.meters} m · 步行约 ${r.mins} 分钟（沿园内游步道）</div>`:''}
      <p class="p-desc">${p.desc}</p>
      ${p.schedule?`
      <div class="p-sh-title">今日场次 <span>（示意，以官方小程序为准）</span></div>
      <div class="p-shows">${p.schedule.map(s=>
        `<div class="p-show"><span class="p-time">${s.t}</span><span>${s.n}</span>${s.hot?'<em>需预约</em>':''}</div>`).join('')}</div>`:''}
      ${p.scene?`<button class="btn scene-btn" id="pScene">进入实景 · ${p.scene.name}</button>`:''}
      <div class="p-actions">
        <button class="btn pri" id="pRoute">步行怎么去</button>
        <button class="btn sec" id="pKeep">继续看图</button>
      </div>
      <div class="p-foot">点位为示意标定 · 正式版接入勘测坐标与官方节目单</div>
    </div>`
  panel.classList.add('show')
  document.getElementById('pClose').onclick=closePanel
  document.getElementById('pKeep').onclick=closePanel
  document.getElementById('pRoute').onclick=toggleRoute
  const sb=document.getElementById('pScene'); if(sb) sb.onclick=()=>enterScene(p)
  centerOn(p.x,p.y)
}
function closePanel(){
  panel.classList.remove('show'); selected=null; routeOn=false; routeLayer.innerHTML=''
  pinLayer.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'))
}
function toggleRoute(){
  if(!selected) return
  if(routeOn){ routeLayer.innerHTML=''; routeOn=false; document.getElementById('pRoute').textContent='步行怎么去'; return }
  const r=fmtRoute(selected.node); if(!r) return
  routeLayer.innerHTML=`
    <polyline points="${r.pts}" fill="none" stroke="#fff3d8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <polyline id="routeLine" points="${r.pts}" fill="none" stroke="${CATS.gate.color}" stroke-width="4.2"
      stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="9 8"/>`
  const line=document.getElementById('routeLine'), len=line.getTotalLength()
  line.style.strokeDasharray=`${len}`; line.style.strokeDashoffset=len
  line.style.transition='stroke-dashoffset 900ms ease'
  requestAnimationFrame(()=>requestAnimationFrame(()=>{line.style.strokeDashoffset=0}))
  routeOn=true; document.getElementById('pRoute').textContent='清除路线'
}

/* ---------- 标记点点击 ---------- */
pinLayer.querySelectorAll('.pin').forEach(el=>{
  el.addEventListener('click',()=>{
    if(svg.dataset.mode!=='tap') return
    const p=POIS.find(x=>x.id===el.dataset.id)
    openPanel(p)
  })
})
/* 点空白处关闭详情 */
svg.addEventListener('click',e=>{ if(svg.dataset.mode==='tap' && !e.target.closest('.pin')) closePanel() })

/* 初始选一个重点，帮助理解 */
setTimeout(()=>{ const arena=POIS.find(p=>p.id==='arena'); openPanel(arena); }, 2400)
