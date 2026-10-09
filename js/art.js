/* =========================================================
 * 美术层：国风水彩手绘地图 SVG（1040×720）
 * 克制的统一色板 + 手绘抖动描边，全部元素程序化绘制
 * ========================================================= */

const C = {
  grass:'#b6d88e', grassWash:'#c6e4a2', grassWash2:'#a9cf82', edge:'#86b364',
  road:'#f2e2b6', roadEdge:'#d9c184', pebble:'#e2cf9d',
  water:'#7fc2d8', waterDeep:'#74b8d0', ripple:'#c6ebf4', waterEdge:'#5fa9c2',
  wall:'#f0e2c0', wallSide:'#dcc8a0', wood:'#7a5230', red:'#b04632', redD:'#93372a',
  roof:'#5d6e7c', roofD:'#46555f', gold:'#d9a53c',
  trunk:'#8a6238', leaf:'#609e4f', leafD:'#4c8440', willow:'#7fb063', sakura:'#f0a0be',
  rock:'#b4ad9c', ink:'#4a3d2c',
}

/* ---------- 小建筑：统一的宋代小房子（伪轴测，可旋转） ---------- */
function house(x, y, a=0, s=1, wall=C.wall, roof=C.roof) {
  return `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})">
    <polygon points="24,-10 32,-15 32,1 24,6" fill="${C.wallSide}" stroke="${C.ink}" stroke-width="1" opacity=".95"/>
    <rect x="0" y="-10" width="24" height="16" fill="${wall}" stroke="${C.ink}" stroke-width="1.1"/>
    <rect x="9" y="-2" width="6" height="8" fill="${C.red}" opacity=".85"/>
    <line x1="0" y1="-10" x2="0" y2="6" stroke="${C.ink}" stroke-width=".8" opacity=".5"/>
    <polygon points="27,-10 32,-15 20,-24 12,-19" fill="${C.roofD}" stroke="${C.ink}" stroke-width=".9"/>
    <path d="M-3,-10 Q1,-13 5,-11 L12,-20 Q14,-22 16,-20 L22,-11 Q26,-13 27,-10 Z"
      fill="${roof}" stroke="${C.ink}" stroke-width="1.1" stroke-linejoin="round"/>
  </g>`
}

/* ---------- 单层殿堂（正面，不旋转） ---------- */
function hall(x, y, w, bodyH, roofH) {
  return `<g transform="translate(${x},${y})">
    <rect x="${-w/2}" y="${-bodyH}" width="${w}" height="${bodyH}" fill="${C.wall}" stroke="${C.ink}" stroke-width="1.3"/>
    <rect x="${-w*.32}" y="${-bodyH*.55}" width="${w*.64}" height="${bodyH*.55}" fill="${C.redD}" opacity=".85"/>
    <line x1="${-w*.16}" y1="${-bodyH*.55}" x2="${-w*.16}" y2="0" stroke="${C.ink}" stroke-width="1" opacity=".6"/>
    <line x1="${w*.16}" y1="${-bodyH*.55}" x2="${w*.16}" y2="0" stroke="${C.ink}" stroke-width="1" opacity=".6"/>
    <path d="M${-w/2-5},${-bodyH} Q${-w*.1},${-bodyH-roofH*.35} 0,${-bodyH-roofH}
      Q${w*.1},${-bodyH-roofH*.35} ${w/2+5},${-bodyH} Z"
      fill="${C.roof}" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round"/>
    <rect x="${-w/2-5}" y="${-bodyH-2.4}" width="${w+10}" height="2.6" fill="${C.roofD}"/>
  </g>`
}

/* ---------- 树 ---------- */
function tree(x,y,s=1,kind='dec'){
  if(kind==='pine') return `<g transform="translate(${x},${y}) scale(${s})" stroke="${C.ink}" stroke-width=".8">
    <rect x="-1.6" y="0" width="3.2" height="7" fill="${C.trunk}"/>
    <path d="M0,-22 L9,-6 L-9,-6 Z" fill="${C.leafD}"/>
    <path d="M0,-29 L7,-15 L-7,-15 Z" fill="${C.leaf}"/>
    <path d="M0,-35 L5,-23 L-5,-23 Z" fill="${C.leafD}"/>
  </g>`
  if(kind==='willow') return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1.8" y="-2" width="3.6" height="10" fill="${C.trunk}" stroke="${C.ink}" stroke-width=".7"/>
    <ellipse cx="0" cy="-12" rx="15" ry="11" fill="${C.willow}" stroke="${C.ink}" stroke-width=".9"/>
    ${[-10,-5,0,5,10].map(dx=>`<path d="M${dx},-6 Q${dx*1.15},2 ${dx*.7},12" fill="none" stroke="${C.leafD}" stroke-width="1.3" opacity=".8"/>`).join('')}
  </g>`
  if(kind==='sakura') return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-1.8" y="-2" width="3.6" height="9" fill="${C.trunk}" stroke="${C.ink}" stroke-width=".7"/>
    <circle cx="-6" cy="-11" r="9" fill="${C.sakura}" stroke="${C.ink}" stroke-width=".9"/>
    <circle cx="6" cy="-12" r="10" fill="#f4b0c9" stroke="${C.ink}" stroke-width=".9"/>
    <circle cx="0" cy="-19" r="9" fill="#f6bdd2" stroke="${C.ink}" stroke-width=".9"/>
  </g>`
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-2" y="-2" width="4" height="9" fill="${C.trunk}" stroke="${C.ink}" stroke-width=".7"/>
    <circle cx="-7" cy="-9" r="9.5" fill="${C.leaf}" stroke="${C.ink}" stroke-width=".9"/>
    <circle cx="7" cy="-10" r="10.5" fill="${C.leaf}" stroke="${C.ink}" stroke-width=".9"/>
    <circle cx="0" cy="-18" r="9" fill="${C.leafD}" stroke="${C.ink}" stroke-width=".9"/>
  </g>`
}

/* ---------- 牌坊 ---------- */
function paifang(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})" stroke="${C.ink}" stroke-width="1">
    <rect x="-2.6" y="-26" width="5.2" height="26" fill="${C.red}"/>
    <rect x="-2.6" y="-26" width="5.2" height="26" fill="${C.red}" transform="translate(-13,0)"/>
    <rect x="-2.6" y="-26" width="5.2" height="26" fill="${C.red}" transform="translate(13,0)"/>
    <rect x="-17" y="-28" width="34" height="3.4" rx="1" fill="${C.redD}"/>
    <rect x="-15" y="-33" width="30" height="2.8" rx="1" fill="${C.gold}"/>
    <path d="M-19,-28 L0,-40 L19,-28 Z" fill="${C.roofD}"/>
    <rect x="-8" y="-25" width="16" height="6" rx="1" fill="#f3e3b8"/>
  </g>`
}

/* ---------- 宝塔 ---------- */
function pagoda(x,y,s=1){
  let t=''
  for(let i=0;i<5;i++){
    const bw=34-i*5.5, yy=-4-i*9
    t+=`<rect x="${-bw/2}" y="${yy-7}" width="${bw}" height="7" fill="${C.redD}" stroke="${C.ink}" stroke-width=".9"/>
      <path d="M${-bw/2-3.4},${yy-7} L0,${yy-12.6} L${bw/2+3.4},${yy-7} Z" fill="${C.roof}" stroke="${C.ink}" stroke-width=".9" stroke-linejoin="round"/>`
  }
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-20" y="-4" width="40" height="6" rx="1" fill="${C.stone||'#cbbf9f'}" stroke="${C.ink}" stroke-width="1"/>
    ${t}
    <path d="M0,-49 L3,-57 L-3,-57 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width=".8"/>
  </g>`
}

const P = d => d.map(([x,y])=>`${x},${y}`).join(' ')

export function buildArt(){
  const parkPath = `M150,210 C110,120 250,70 380,86 C470,54 640,66 740,110 C850,140 918,250 896,350
    C922,450 842,556 716,586 C600,640 430,648 320,596 C200,576 104,470 110,360
    C112,290 128,248 150,210 Z`
  const loop = `M430,172 C480,178 540,184 572,196 C612,236 632,268 644,306
    C690,330 724,352 742,386 C730,428 714,456 700,478 C650,516 596,528 552,536
    C470,556 380,556 330,548 C276,530 248,508 236,486 C214,448 210,416 212,384
    C214,330 226,286 250,256 C286,222 350,192 430,172 Z`

  const branches = [
    'M430,172 L430,94',                 // 北
    'M552,536 C524,560 500,584 484,598', // 南
    'M742,386 C790,372 838,352 876,346', // 东
    'M330,548 L342,590',                // 中门
    'M430,172 L380,128',                // 游客中心
    'M552,536 L534,532',                // 售票
    'M590,212 C628,224 664,238 696,248', // 仙湖
    'M644,306 L668,302',                // 沙场
    'M430,172 L438,158',                // 寺
    'M212,384 C208,356 206,328 206,308', // 剧院
    'M236,372 C262,362 280,358 294,356', // 圆形沙场
    'M256,250 C268,236 280,224 286,216', // 九龙潭
    'M236,486 L230,464',                // 武馆
    'M330,548 L318,514',                // 水浒街
    // 中心十字坡
    'M644,306 C586,332 522,372 482,398',
    'M300,366 C360,388 412,396 468,402',
    'M468,402 C500,450 528,496 548,528',
    // 水浒街斜街
    'M250,522 C282,482 320,448 352,422',
  ]

  const lake = `M636,112 C690,78 780,92 808,140 C836,186 798,238 742,246 C686,254 620,224 612,176 C608,150 616,128 636,112 Z`

  /* 植被布点（避开道路/建筑的人工挑选位置） */
  const pines   = [[498,136,.9],[516,166,.8],[392,164,.85],[356,148,.8],[300,150,.75],[166,276,.95],[140,386,.9],[172,498,.85]]
  const sakuras = [[644,94,.95],[774,104,1],[830,160,.9],[814,224,.85],[758,264,.9],[650,268,.85],[612,148,.8],[588,244,.75]]
  const willows = [[618,178,.8],[636,226,.75],[760,252,.8],[240,190,.8],[338,176,.75],[348,244,.8],[792,120,.7]]
  const trees = [
    [196,210],[176,330],[160,420],[270,150],[560,108],[700,86],[842,286],[868,402],[836,498],
    [742,540],[612,596],[470,612],[388,606],[280,572],[368,470],[402,432],[430,300],[560,430],
    [600,470],[520,268],[688,360],[250,596],[640,560],[760,330],[420,240],[570,350],[330,286],
  ]
  const bushes = [
    [182,250],[170,360],[210,460],[300,120],[500,96],[620,92],[800,180],[870,330],[870,440],
    [780,530],[660,600],[520,622],[410,612],[300,586],[200,540],[150,460],[132,320],[168,230],
    [380,340],[530,340],[590,396],[470,470],[350,400],[660,420],[260,330],[400,560],[600,570],
  ]
  const outerTrees = [[120,150],[200,96],[320,60],[470,44],[600,46],[720,66],[840,110],[916,210],
    [952,330],[936,450],[872,556],[760,626],[620,660],[470,666],[330,650],[200,618],[108,520],[72,400],[78,270]]

  /* 水浒街两排店铺（沿斜街） */
  let shops=''
  const rowA=[[268,498],[298,468],[328,438],[356,412]], rowB=[[300,528],[330,498],[360,468],[386,442]]
  rowA.forEach((p,i)=> shops += house(p[0],p[1],-36+(i%2?2:0),.72, i%2?C.wall:'#ead8b2'))
  rowB.forEach((p,i)=> shops += house(p[0],p[1],144+(i%2?-2:0),.72, i%2?'#ead8b2':C.wall, i%2?C.roof:C.roofD))

  /* 灯笼串 */
  const lanternLine=(x1,y1,x2,y2)=>
    `<path d="M${x1},${y1} Q${(x1+x2)/2},${Math.min(y1,y2)-14} ${x2},${y2}" fill="none" stroke="${C.wood}" stroke-width="1.4"/>`+
    [0.25,0.5,0.75].map(t=>{const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t-8;return `<circle cx="${x}" cy="${y}" r="3" fill="#e2553a" stroke="${C.ink}" stroke-width=".7"/>`}).join('')
  const lanterns = lanternLine(258,486,360,404)+lanternLine(292,540,392,460)

  return `
  <!-- 园外林带 -->
  <g opacity=".9">${outerTrees.map(([x,y],i)=>tree(x,y,1+(i%3)*.15,i%4===0?'pine':'dec')).join('')}</g>

  <!-- 地块水彩 -->
  <path d="${parkPath}" fill="${C.grass}" stroke="${C.edge}" stroke-width="6" stroke-linejoin="round" filter="url(#rough)"/>
  <path d="${parkPath}" fill="none" stroke="#6f9c52" stroke-width="2" opacity=".35"/>
  <g filter="url(#wash)" opacity=".8">
    <ellipse cx="330" cy="320" rx="150" ry="110" fill="${C.grassWash}"/>
    <ellipse cx="640" cy="420" rx="150" ry="100" fill="${C.grassWash}"/>
    <ellipse cx="560" cy="180" rx="120" ry="70" fill="${C.grassWash2}" opacity=".7"/>
    <ellipse cx="280" cy="520" rx="110" ry="70" fill="${C.grassWash2}" opacity=".6"/>
  </g>

  <!-- 水系 -->
  <g>
    <path d="${lake}" fill="${C.water}" stroke="${C.waterEdge}" stroke-width="4" filter="url(#rough)"/>
    <path d="M648,130 C690,106 760,112 790,150" fill="none" stroke="${C.ripple}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <path d="M640,190 C680,210 740,214 780,196" fill="none" stroke="${C.ripple}" stroke-width="2.5" stroke-linecap="round" opacity=".7" class="ripple"/>
    <!-- 荷叶与小船 -->
    <ellipse cx="672" cy="232" rx="7" ry="4" fill="#6fae7a"/><ellipse cx="690" cy="237" rx="6" ry="3.4" fill="#7fbd83"/>
    <ellipse cx="660" cy="200" rx="6" ry="3.4" fill="#7fbd83"/>
    <path d="M668,158 q8,-5 16,0 q-2,4 -8,4 q-6,0 -8,-4 Z" fill="#7a5230" stroke="${C.ink}" stroke-width=".8"/>
    <path d="M752,232 q8,-5 16,0 q-2,4 -8,4 q-6,0 -8,-4 Z" fill="#7a5230" stroke="${C.ink}" stroke-width=".8"/>

    <ellipse cx="292" cy="206" rx="54" ry="31" fill="${C.water}" stroke="${C.waterEdge}" stroke-width="3.5" filter="url(#rough)"/>
    <path d="M262,214 C278,206 306,206 322,214" fill="none" stroke="${C.ripple}" stroke-width="2.5" opacity=".8"/>
    <!-- 九曲桥 -->
    <path d="M268,232 L292,232 L282,222 L310,222 L300,212 L330,212" fill="none" stroke="${C.roadEdge}" stroke-width="5" stroke-linecap="round"/>
  </g>

  <!-- 道路（外描边 + 路面 + 碎石点，用于生长动画） -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path id="r-loop-edge" d="${loop}" stroke="${C.roadEdge}" stroke-width="22"/>
    ${branches.map((d,i)=>`<path class="r-br-edge" data-i="${i}" d="${d}" stroke="${C.roadEdge}" stroke-width="14"/>`).join('')}
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path id="r-loop" d="${loop}" stroke="${C.road}" stroke-width="14"/>
    ${branches.map((d,i)=>`<path class="r-br" data-i="${i}" d="${d}" stroke="${C.road}" stroke-width="8"/>`).join('')}
    <path d="${loop}" stroke="${C.pebble}" stroke-width="2" stroke-dasharray="1 13" opacity=".7"/>
  </g>

  <!-- 广场 -->
  <circle cx="692" cy="300" r="40" fill="#dcb57e" stroke="#b0834a" stroke-width="3"/>
  <circle cx="692" cy="300" r="28" fill="#d0a468" stroke="#a37640" stroke-width="2"/>
  <circle cx="300" cy="356" r="22" fill="#e3c086" stroke="#b0834a" stroke-width="2.5"/>
  <circle cx="300" cy="356" r="13" fill="#d4ac6c" stroke="#a37640" stroke-width="1.6"/>
  <circle cx="470" cy="398" r="14" fill="#ecd9a8" stroke="#d3b87f" stroke-width="2.2"/>

  <!-- 仙湖：湖心亭 + 月桥 -->
  <g>
    <ellipse cx="700" cy="200" rx="17" ry="12" fill="#cbbf9f" stroke="${C.ink}" stroke-width="1"/>
    ${[[-9,-2],[9,-2],[-9,6],[9,6]].map(([dx,dy])=>`<rect x="${700+dx-1.6}" y="${200+dy-10}" width="3.2" height="11" fill="${C.red}"/>`).join('')}
    <path d="M682,190 L700,178 L718,190 Z" fill="${C.roofD}" stroke="${C.ink}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M686,250 Q700,268 714,250" fill="none" stroke="${C.roadEdge}" stroke-width="7" stroke-linecap="round"/>
    <path d="M686,250 Q700,268 714,250" fill="none" stroke="${C.road}" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- 城寨沙场：半环看台 + 城楼 + 战旗 -->
  <g>
    <path d="M656,292 A38,38 0 0 1 728,292" fill="none" stroke="#9c6b38" stroke-width="7" stroke-linecap="round"/>
    <path d="M662,284 A31,31 0 0 1 722,284" fill="none" stroke="#b4854c" stroke-width="6" stroke-linecap="round"/>
    ${[666,680,704,718].map(xx=>`<line x1="${xx}" y1="262" x2="${xx-6}" y2="278" stroke="#8a5e34" stroke-width="1.6"/>`).join('')}
    <!-- 城楼 -->
    <rect x="672" y="246" width="40" height="14" fill="${C.redD}" stroke="${C.ink}" stroke-width="1.1"/>
    <path d="M668,246 L692,232 L716,246 Z" fill="${C.roofD}" stroke="${C.ink}" stroke-width="1.1" stroke-linejoin="round"/>
    <rect x="680" y="230" width="24" height="9" fill="${C.red}" stroke="${C.ink}" stroke-width="1"/>
    <path d="M677,230 L692,220 L707,230 Z" fill="${C.roof}" stroke="${C.ink}" stroke-width="1" stroke-linejoin="round"/>
    <rect x="687" y="252" width="10" height="8" fill="#6b4326"/>
    <!-- 战旗 -->
    ${[640,744].map(xx=>`<line x1="${xx}" y1="300" x2="${xx}" y2="272" stroke="${C.wood}" stroke-width="2"/>
      <path d="M${xx},272 L${xx+13},276 L${xx},283 Z" fill="#c8492f" stroke="${C.ink}" stroke-width=".8"/>`).join('')}
  </g>

  <!-- 万岁寺：院墙 + 大雄殿 + 宝塔 -->
  <g>
    <rect x="392" y="106" width="92" height="66" rx="4" fill="#efe4c6" stroke="#b9a578" stroke-width="2" opacity=".92"/>
    ${hall(420,168,34,15,11)}
    ${pagoda(466,160,.78)}
  </g>

  <!-- 大剧院 -->
  <g>
    ${hall(206,300,52,20,14)}
    <line x1="178" y1="300" x2="178" y2="268" stroke="${C.wood}" stroke-width="1.8"/>
    <line x1="234" y1="300" x2="234" y2="268" stroke="${C.wood}" stroke-width="1.8"/>
    <path d="M178,268 L192,272 L178,279 Z" fill="#c8492f"/><path d="M234,268 L220,272 L234,279 Z" fill="#c8492f"/>
  </g>

  <!-- 大宋武馆院落 -->
  <g>
    <rect x="196" y="424" width="62" height="52" rx="3" fill="#f0e6cc" stroke="#b9a578" stroke-width="1.8" opacity=".9"/>
    ${house(208,470,0,.72)}
    ${house(250,470,0,.72,C.wall,C.roofD)}
    ${hall(227,430,30,10,8)}
  </g>

  <!-- 水浒街店铺 + 灯笼 -->
  ${shops}${lanterns}

  <!-- 牌坊（北大门）与其余门头 -->
  ${paifang(430,92,1)}
  ${house(478,600,180,.9)}
  ${house(886,344,90,.9)}
  ${house(344,600,180,.85)}

  <!-- 植被（树压住地块边缘最自然） -->
  <g>${pines.map(p=>tree(...p,'pine')).join('')}</g>
  <g>${sakuras.map(p=>tree(...p,'sakura')).join('')}</g>
  <g>${willows.map(p=>tree(...p,'willow')).join('')}</g>
  <g>${trees.map((p,i)=>tree(p[0],p[1],.85+(i%3)*.12)).join('')}</g>
  <g>${bushes.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${3.4+(i%3)*.8}" fill="${i%2?'#7bb05c':'#8cbf6a'}" stroke="${C.edge}" stroke-width=".7" opacity=".9"/>`).join('')}</g>

  <!-- 山石 -->
  ${[[150,330,1],[838,372,.9],[600,470,.8],[178,470,1],[660,120,.8],[410,250,.7],[770,470,.9]].map(([x,y,s])=>
    `<path d="M${x-7*s},${y+5*s} q-2,-9 6,-10 q6,-4 9,4 q5,2 1,8 Z" fill="${C.rock}" stroke="${C.ink}" stroke-width=".9" opacity=".95"/>`).join('')}

  <!-- 罗盘 -->
  <g transform="translate(866,498)">
    <circle r="30" fill="#fbf4e2" stroke="${C.ink}" stroke-width="2"/>
    <circle r="23" fill="none" stroke="#b8a37a" stroke-width="1"/>
    <path d="M0,-22 L6,0 L0,22 L-6,0 Z" fill="#c04a2e" opacity=".85"/>
    <circle r="4" fill="${C.ink}"/>
    <text x="0" y="-32" text-anchor="middle" font-family="STKaiti,KaiTi,serif" font-size="13" fill="${C.ink}">北</text>
    <text x="0" y="42" text-anchor="middle" font-family="STKaiti,KaiTi,serif" font-size="11" fill="${C.ink}">南</text>
    <text x="36" y="4" text-anchor="middle" font-family="STKaiti,KaiTi,serif" font-size="11" fill="${C.ink}">东</text>
    <text x="-36" y="4" text-anchor="middle" font-family="STKaiti,KaiTi,serif" font-size="11" fill="${C.ink}">西</text>
  </g>

  <!-- 祥云（纸面四角装饰） -->
  <g fill="none" stroke="#c9b78f" stroke-width="2.4" opacity=".7" stroke-linecap="round">
    <path d="M40,50 q14,-14 28,0 M54,42 q10,-10 20,0 M70,50 q10,-8 18,2" transform="scale(1.1)"/>
    <path d="M880,648 q14,-14 28,0 M894,640 q10,-10 20,0 M910,648 q10,-8 18,2" transform="scale(1.15)"/>
  </g>
`
}
