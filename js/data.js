/* =========================================================
 * 数据层：POI + 分类 + 园区路网（1040×720 手绘地图坐标）
 * 点位名称/相对布局按万岁山武侠城真实结构标定，
 * 正式版可替换为勘测坐标与官方节目单接口。
 * ========================================================= */

export const CATS = {
  gate:    { label:'出入口', color:'#b23a2a', soft:'#f3dcd6' },
  show:    { label:'演艺场', color:'#cf8f2e', soft:'#f7e8cd' },
  spot:    { label:'景 点', color:'#6f9f52', soft:'#e2efd8' },
  service: { label:'服务区', color:'#3f8fa8', soft:'#d6ecf2' },
  wc:      { label:'卫生间', color:'#4f93b8', soft:'#dceef5' },
}

export const POIS = [
  // —— 出入口 ——
  { id:'gate-n', node:'gate-n', cat:'gate', x:430, y:84,  char:'门', name:'北大门',
    desc:'园区主入口。游客中心、售票处方向入园最近，万岁寺在入园右手侧。' },
  { id:'gate-s', node:'gate-s', cat:'gate', x:478, y:606, char:'门', name:'南门',
    desc:'南侧出入口，邻近主停车场，步行至城寨沙场约 6 分钟。' },
  { id:'gate-e', node:'gate-e', cat:'gate', x:886, y:344, char:'门', name:'东门',
    desc:'东侧出入口，离仙侠湖、城寨沙场最近。' },
  { id:'gate-m', node:'gate-m', cat:'gate', x:344, y:600, char:'门', name:'中门',
    desc:'西南侧出入口，邻近水浒街与大宋武馆。' },

  // —— 服务 ——
  { id:'center', node:'youke', cat:'service', x:372, y:118, char:'问', name:'游客中心',
    desc:'游园咨询、导览图领取、物品寄存、轮椅与婴儿车租借（服务项以现场公示为准）。' },
  { id:'ticket', node:'ticket', cat:'service', x:528, y:530, char:'票', name:'售票处',
    desc:'线上购票可直接刷码入园，窗口处理优惠票与团体票。' },

  // —— 演艺场 ——
  { id:'arena', node:'arena', cat:'show', x:692, y:300, char:'演', name:'城寨沙场', main:true,
    desc:'全园最大的实景剧场，城楼配半环形看台。白天是《三打祝家庄》马战，夜场为 1600℃ 非遗《打铁花》。2025 年起夜场实行预约制。',
    schedule:[
      { t:'10:30', n:'三打祝家庄 · 马战实景' },
      { t:'15:00', n:'三打祝家庄 · 马战实景' },
      { t:'19:30', n:'打铁花（夜场）', hot:true },
    ] },
  { id:'yuanxing', node:'yuanxing', cat:'show', x:300, y:356, char:'艺', name:'圆形沙场',
    desc:'露天圆形小剧场，轮番上演民间杂耍与民俗绝活，行经主环路即可围观。',
    schedule:[
      { t:'11:20', n:'民间杂耍轮演' },
      { t:'16:10', n:'民俗绝活展演' },
    ] },
  { id:'shizipo', node:'cross', cat:'show', x:470, y:398, char:'剧', name:'十字坡',
    desc:'园区中路交会处的街头演艺点，武侠互动短剧与巡游在此停留。',
    schedule:[
      { t:'10:50', n:'武侠互动短剧' },
      { t:'14:30', n:'江湖巡游停留' },
    ] },
  { id:'theater', node:'theater', cat:'show', x:206, y:300, char:'院', name:'万岁山大剧院',
    desc:'室内大型剧目剧场，雨天照常演出，场次随季度调整。',
    schedule:[ { t:'11:00', n:'室内大戏 · 轮演剧目' } ] },

  // —— 景点 ——
  { id:'temple', node:'temple', cat:'spot', x:438, y:150, char:'寺', name:'万岁寺',
    desc:'仿古寺院，五层宝塔是全园制高点之一，寺前广场适合拍全园取景。' },
  { id:'lake', node:'lake', cat:'spot', x:794, y:172, char:'湖', name:'仙侠湖',
    desc:'湖光水景区：湖心亭、月桥与环湖步道相连，春有樱花秋有灯，拍照歇脚两相宜。' },
  { id:'pool', node:'jiulong', cat:'spot', x:292, y:206, char:'潭', name:'九龙潭',
    desc:'西北角水潭，九曲小桥连临水小榭，人少清静。' },
  { id:'wuguan', node:'wuguan', cat:'spot', x:226, y:452, char:'武', name:'大宋武馆',
    desc:'仿宋代武馆院落，白天有武术教习与体验场次，可入内参观。' },
  { id:'shuijie', node:'shuijie', cat:'spot', x:312, y:498, char:'街', name:'水浒街',
    desc:'宋代风情商业街：木楼黛瓦、幌子灯笼，开封小吃与武侠文创都在这条街。' },

  // —— 卫生间（沿路 4 处） ——
  { id:'wc1', node:'W2', cat:'wc', x:372, y:300, char:'WC', name:'卫生间', small:true },
  { id:'wc2', node:'E1', cat:'wc', x:628, y:252, char:'WC', name:'卫生间', small:true },
  { id:'wc3', node:'E2', cat:'wc', x:748, y:436, char:'WC', name:'卫生间', small:true },
  { id:'wc4', node:'SW', cat:'wc', x:330, y:560, char:'WC', name:'卫生间', small:true },
]

/* ---------- 路网节点（与手绘道路一致，用于步行路线） ---------- */
export const NODES = {
  // 主环路
  N :{ x:430, y:172 }, NE:{ x:572, y:196 }, E1:{ x:644, y:306 }, E2:{ x:742, y:386 },
  E3:{ x:700, y:478 }, SE:{ x:552, y:536 }, SW:{ x:330, y:548 }, W3:{ x:236, y:486 },
  W2:{ x:212, y:384 }, W1:{ x:250, y:256 }, C :{ x:468, y:402 },
  // 支路终端（POI 节点）
  'gate-n':{ x:430, y:92 }, 'gate-s':{ x:482, y:600 }, 'gate-e':{ x:878, y:346 }, 'gate-m':{ x:342, y:592 },
  youke:{ x:372, y:122 }, ticket:{ x:534, y:532 },
  arena:{ x:672, y:302 }, lake:{ x:700, y:246 }, temple:{ x:438, y:156 },
  theater:{ x:206, y:306 }, yuanxing:{ x:296, y:356 }, jiulong:{ x:288, y:214 },
  wuguan:{ x:230, y:462 }, shuijie:{ x:316, y:512 },
}

export const EDGES = [
  // 环
  ['N','NE'],['NE','E1'],['E1','E2'],['E2','E3'],['E3','SE'],['SE','SW'],
  ['SW','W3'],['W3','W2'],['W2','W1'],['W1','N'],
  // 中心十字坡支路
  ['C','E1'],['C','W2'],['C','SE'],
  // POI 支路
  ['N','gate-n'],['SE','gate-s'],['E2','gate-e'],['SW','gate-m'],
  ['N','youke'],['SE','ticket'],
  ['E1','arena'],['NE','lake'],['N','temple'],
  ['W2','theater'],['W2','yuanxing'],['W1','jiulong'],
  ['W3','wuguan'],['SW','shuijie'],
]

/* 像素→米 的示意比例（园区东西约 600m） */
export const UNIT_M = 0.62
export const START_NODE = 'gate-n'
