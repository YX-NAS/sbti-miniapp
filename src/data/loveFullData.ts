export type LoveFullDimension = 'D' | 'O' | 'S' | 'B' | 'H' | 'P' | 'L' | 'M'

export type LoveFullQuestion = {
  id: string
  text: string
  note: string
  options: Array<{
    text: string
    scores: Partial<Record<LoveFullDimension, number>>
  }>
}

export type LoveFullAxisResult = {
  axis: string
  leftCode: LoveFullDimension
  rightCode: LoveFullDimension
  leftTitle: string
  rightTitle: string
  dominantCode: LoveFullDimension
  dominantTitle: string
  leftScore: number
  rightScore: number
}

export type LoveFullResult = {
  code: string
  title: string
  subtitle: string
  summary: string
  shareTitle: string
  guide: string
  axes: LoveFullAxisResult[]
}

const AXIS_PAIRS: Array<[LoveFullDimension, LoveFullDimension, string]> = [
  ['D', 'O', '表达方式'],
  ['S', 'B', '靠近边界'],
  ['H', 'P', '互动频率'],
  ['L', 'M', '关系节奏'],
]

export const LOVE_FULL_DIMENSION_META: Record<
  LoveFullDimension,
  { title: string; summary: string }
> = {
  D: { title: '直接表达', summary: '更愿意把在意说出来，不喜欢过度猜来猜去。' },
  O: { title: '观察确认', summary: '更习惯先确认对方状态，再决定是否推进。' },
  S: { title: '安心靠近', summary: '更重视被回应、被接住，以及关系里的稳定感。' },
  B: { title: '边界筛选', summary: '更看重标准、分寸和匹配度，不会轻易交出自己。' },
  H: { title: '高频互动', summary: '靠聊天、分享和回应频率来建立连接感。' },
  P: { title: '个人空间', summary: '需要距离和留白，不喜欢关系里过度黏住。' },
  L: { title: '长线规划', summary: '更容易从长期可持续的角度看关系。' },
  M: { title: '当下感受', summary: '更容易被当下的感觉、氛围和心动体验带动。' },
}

const ARCHETYPE_META: Record<
  string,
  { title: string; subtitle: string; summary: string; shareTitle: string; guide: string }
> = {
  DSHL: {
    title: '稳定直球倾向',
    subtitle: '在意会表达，也更愿意把关系往长期方向推进。',
    summary: '你在关系里更看重真诚和回应。你不喜欢一直猜来猜去，通常希望在确定感里慢慢把关系做稳。',
    shareTitle: '我当前更接近稳定直球倾向',
    guide: '适合继续保持你的坦诚，也别把“我要稳定”变成过早替关系下结论。',
  },
  DSHM: {
    title: '心动推进倾向',
    subtitle: '容易在回应感里快速升温，也很重视互动里的感觉。',
    summary: '你更容易被同频和回应点燃。一旦确认彼此有来有回，你通常会想让关系更快一点靠近。',
    shareTitle: '我当前更接近心动推进倾向',
    guide: '适合享受你的热度，同时给关系留一点观察窗口，避免全靠情绪推进。',
  },
  DSPL: {
    title: '清晰长线倾向',
    subtitle: '会表达在意，但也需要彼此保有空间和长期共识。',
    summary: '你不是不主动，而是更希望主动之后，关系能进入更清楚、更长期的状态。你重视舒服也重视边界。',
    shareTitle: '我当前更接近清晰长线倾向',
    guide: '适合继续保留你的清晰感，也不必每次都太快把未来问题提前到最前面。',
  },
  DSPM: {
    title: '自在表达倾向',
    subtitle: '会说出喜欢，也希望关系里有松弛和呼吸感。',
    summary: '你在关系里既愿意表达，也不太想被“必须如何”捆住。你更适合在自然感里靠近，而不是被高压关系裹挟。',
    shareTitle: '我当前更接近自在表达倾向',
    guide: '适合继续保留你的松弛感，也可以在关键时刻更明确一点，让对方知道你的认真程度。',
  },
  DBHL: {
    title: '清醒筛选倾向',
    subtitle: '会表达好感，但前提是你已经判断过值不值得。',
    summary: '你在关系里有热度，但不会随便交出去。你希望靠近是基于匹配，而不是单纯一时上头。',
    shareTitle: '我当前更接近清醒筛选倾向',
    guide: '继续保留你的判断力，也别把“先判断”变成完全不给关系试探空间。',
  },
  DBHM: {
    title: '试探观察倾向',
    subtitle: '会释放信号，但也会一直观察对方是不是稳定。',
    summary: '你不是彻底慢热，只是不会轻易全开。你更喜欢在互动里边试边看，确认对方到底靠不靠谱。',
    shareTitle: '我当前更接近试探观察倾向',
    guide: '适合继续用你的清醒感保护自己，也别让过多试探把本来能靠近的关系拖散。',
  },
  DBPL: {
    title: '边界规划倾向',
    subtitle: '很重视分寸、长期感和彼此是否合适。',
    summary: '你更像那种“宁可慢一点，也不要乱一点”的人。你会把关系质量看得很重，不容易只靠情绪做决定。',
    shareTitle: '我当前更接近边界规划倾向',
    guide: '适合继续保持你的标准，也允许自己在安全范围里体验一点不那么可控的靠近。',
  },
  DBPM: {
    title: '自主试探倾向',
    subtitle: '既有边界，也很在意当下相处是不是真的舒服。',
    summary: '你对关系有判断，不喜欢太快失去自己的节奏。你更适合从舒服和真实开始，而不是被模板推进。',
    shareTitle: '我当前更接近自主试探倾向',
    guide: '适合保留你的自主感，同时把关键边界说出来，别总靠对方自己猜。',
  },
  OSHL: {
    title: '慢热投入倾向',
    subtitle: '确认过安心感之后，会认真把关系往更稳定的方向走。',
    summary: '你不会轻易进入一段关系，但一旦决定靠近，通常是带着认真和长期感去的。你需要被看见，也需要被确认。',
    shareTitle: '我当前更接近慢热投入倾向',
    guide: '适合继续保护你的认真，也可以在更早一点的时候给对方一些可读信号。',
  },
  OSHM: {
    title: '柔和心动倾向',
    subtitle: '先慢慢确认，再在回应里一点点升温。',
    summary: '你不是完全被动，只是需要时间让关系变得安全。你适合在细水长流里心动，而不是突然被拉得太快。',
    shareTitle: '我当前更接近柔和心动倾向',
    guide: '适合继续按你的节奏靠近，同时也别总把好感埋太深，不然别人很难接收到。',
  },
  OSPL: {
    title: '安静长线倾向',
    subtitle: '重视确认、边界和长期的关系质量。',
    summary: '你在关系里更像低调但认真型。你不太会被表面的热闹打动，更看重相处是否舒服、稳定、可持续。',
    shareTitle: '我当前更接近安静长线倾向',
    guide: '适合继续相信你的判断力，也别因为太怕出错就完全不让关系有推进机会。',
  },
  OSPM: {
    title: '慢热体验倾向',
    subtitle: '需要时间确认，也需要在相处中保有轻松感。',
    summary: '你更适合慢慢来、边相处边确认。只要关系不让你有压迫感，你其实会比别人想象中更愿意靠近。',
    shareTitle: '我当前更接近慢热体验倾向',
    guide: '适合继续按舒服节奏靠近，同时练习把“我需要慢一点”说得更明确。',
  },
  OBHL: {
    title: '谨慎确认倾向',
    subtitle: '会先观察很多细节，确认安全后才愿意真正投入。',
    summary: '你对关系的判断很细，通常不会因为一时心动就完全交出去。你更在意人品、稳定感和长期风险。',
    shareTitle: '我当前更接近谨慎确认倾向',
    guide: '继续保护你的边界感，同时别让谨慎变成过度预判，错过真实相处带来的信息。',
  },
  OBHM: {
    title: '观察拉扯倾向',
    subtitle: '会反复确认对方的稳定度，也容易在细节里上心。',
    summary: '你更容易在“想靠近”和“再看看”之间拉扯。你不是不真诚，而是太在意自己投入之后会不会受伤。',
    shareTitle: '我当前更接近观察拉扯倾向',
    guide: '适合给自己设一个观察边界，别让无限观察替代真正的判断。',
  },
  OBPL: {
    title: '标准感情倾向',
    subtitle: '会优先看关系有没有长期价值，再决定要不要靠近。',
    summary: '你在关系里很重视匹配度和长期逻辑。你不太吃一时上头，更相信时间、稳定度和现实感。',
    shareTitle: '我当前更接近标准感情倾向',
    guide: '适合继续坚持你的标准，也要给“现实里慢慢长出来的好感”一点空间。',
  },
  OBPM: {
    title: '留白感受倾向',
    subtitle: '很看重边界和舒服感，不喜欢被关系快速定义。',
    summary: '你更适合带着空间感去认识一个人。你在意真实感受，也很需要保住自己不被关系吞没。',
    shareTitle: '我当前更接近留白感受倾向',
    guide: '适合继续尊重自己的边界，同时别让“先留白”变成长期不给回应。',
  },
}

export const LOVE_FULL_QUESTIONS: LoveFullQuestion[] = [
  {
    id: 'love_full_001',
    text: '对一个人刚有点在意时，你更常见的反应是？',
    note: '看你会怎么开始靠近',
    options: [
      { text: '会想办法释放一点信号，看看对方会不会接', scores: { D: 2, H: 1 } },
      { text: '先观察对方是不是也有类似的意思', scores: { O: 2, B: 1 } },
      { text: '先不急着推进，想再感受一下自己的状态', scores: { O: 1, M: 1 } },
    ],
  },
  {
    id: 'love_full_002',
    text: '别人回你消息忽快忽慢时，你更像哪种反应？',
    note: '看你对不确定的处理方式',
    options: [
      { text: '如果在意，会想直接问清楚', scores: { D: 2, S: 1 } },
      { text: '先观察几天，再决定要不要继续靠近', scores: { O: 2, B: 1 } },
      { text: '会有点在意，但先看整体相处感觉', scores: { S: 1, M: 1 } },
    ],
  },
  {
    id: 'love_full_003',
    text: '你更容易通过什么确认一段关系的温度？',
    note: '看你感受靠近感的来源',
    options: [
      { text: '聊天频率、互动感和回应速度', scores: { H: 2, S: 1 } },
      { text: '对方是否尊重我的边界和节奏', scores: { P: 1, B: 1 } },
      { text: '能不能看到长期相处下去的稳定感', scores: { L: 2, S: 1 } },
    ],
  },
  {
    id: 'love_full_004',
    text: '如果你喜欢的人主动靠近，你更可能？',
    note: '看你在被回应时的节奏',
    options: [
      { text: '会更愿意表达，关系可能升温得比较快', scores: { D: 2, M: 1 } },
      { text: '会开心，但仍然需要继续确认', scores: { O: 2, S: 1 } },
      { text: '会先享受相处，再慢慢判断下一步', scores: { M: 2, P: 1 } },
    ],
  },
  {
    id: 'love_full_005',
    text: '你最不能接受哪种关系状态？',
    note: '看你的核心雷区',
    options: [
      { text: '一直模糊不清，不给明确回应', scores: { D: 2, L: 1 } },
      { text: '没有边界，动不动就消耗我', scores: { B: 2, P: 1 } },
      { text: '只有热度，没有稳定性和长期感', scores: { L: 2, B: 1 } },
    ],
  },
  {
    id: 'love_full_006',
    text: '在关系里，你更需要哪种安全感？',
    note: '看你最在意被怎样接住',
    options: [
      { text: '对方会回应、会表达、会让我知道被在意', scores: { S: 2, H: 1 } },
      { text: '对方不会越界，也不会逼我太快', scores: { B: 2, P: 1 } },
      { text: '对方对未来和关系方向是认真的', scores: { L: 2, S: 1 } },
    ],
  },
  {
    id: 'love_full_007',
    text: '暧昧阶段里，你更常见的状态是？',
    note: '看你会怎样维持关系温度',
    options: [
      { text: '互动一多，我很容易进入认真模式', scores: { H: 2, M: 1 } },
      { text: '会边相处边看，不想太快定义关系', scores: { P: 2, O: 1 } },
      { text: '先观察长期匹配度，再决定要不要投入更多', scores: { L: 2, B: 1 } },
    ],
  },
  {
    id: 'love_full_008',
    text: '如果关系出现一点误会，你通常更像？',
    note: '看你处理关系波动的方式',
    options: [
      { text: '会想尽快说清楚，不喜欢卡在那里', scores: { D: 2, L: 1 } },
      { text: '会先缓一缓，整理完再看要不要聊', scores: { O: 2, P: 1 } },
      { text: '先感受对方态度，再决定自己要不要开口', scores: { O: 1, S: 1 } },
    ],
  },
  {
    id: 'love_full_009',
    text: '你更希望关系如何推进？',
    note: '看你对节奏的期待',
    options: [
      { text: '只要彼此有感觉，就可以更明确一点', scores: { D: 2, M: 1 } },
      { text: '慢一点没关系，但要越来越稳定', scores: { O: 1, L: 1 } },
      { text: '别太急着定义，舒服相处更重要', scores: { P: 2, M: 1 } },
    ],
  },
  {
    id: 'love_full_010',
    text: '你更像通过什么判断“这个人靠不靠谱”？',
    note: '看你的判断依据',
    options: [
      { text: '会不会稳定回应，会不会说到做到', scores: { S: 2, L: 1 } },
      { text: '是不是尊重边界，不玩消耗和拉扯', scores: { B: 2, P: 1 } },
      { text: '相处是不是轻松自然，不需要硬撑', scores: { M: 2, P: 1 } },
    ],
  },
  {
    id: 'love_full_011',
    text: '当你真的开始喜欢一个人后，你更容易？',
    note: '看你投入后的状态',
    options: [
      { text: '会想更多互动，想知道对方的一切近况', scores: { H: 2, D: 1 } },
      { text: '会认真观察，想确认对方值不值得长期投入', scores: { O: 2, L: 1 } },
      { text: '会更在意相处感受，想知道自己待得舒不舒服', scores: { M: 2, B: 1 } },
    ],
  },
  {
    id: 'love_full_012',
    text: '如果只能保留一种你的感情优势，你更希望是？',
    note: '看你最信任的那部分自己',
    options: [
      { text: '真诚表达，让关系不总停在猜测里', scores: { D: 2, S: 1 } },
      { text: '清醒筛选，不让自己轻易掉进消耗里', scores: { B: 2, O: 1 } },
      { text: '认真经营，把好感慢慢变成稳定关系', scores: { L: 2, H: 1 } },
    ],
  },
]

export function buildLoveFullResult(answers: Record<string, number>): LoveFullResult {
  const totals: Record<LoveFullDimension, number> = {
    D: 0,
    O: 0,
    S: 0,
    B: 0,
    H: 0,
    P: 0,
    L: 0,
    M: 0,
  }

  LOVE_FULL_QUESTIONS.forEach(question => {
    const selectedIndex = answers[question.id]
    if (typeof selectedIndex !== 'number') return
    const option = question.options[selectedIndex]
    if (!option) return
    Object.entries(option.scores).forEach(([key, value]) => {
      totals[key as LoveFullDimension] += value || 0
    })
  })

  const axes = AXIS_PAIRS.map(([leftCode, rightCode, axis]) => {
    const leftScore = totals[leftCode]
    const rightScore = totals[rightCode]
    const dominantCode = leftScore >= rightScore ? leftCode : rightCode

    return {
      axis,
      leftCode,
      rightCode,
      leftTitle: LOVE_FULL_DIMENSION_META[leftCode].title,
      rightTitle: LOVE_FULL_DIMENSION_META[rightCode].title,
      dominantCode,
      dominantTitle: LOVE_FULL_DIMENSION_META[dominantCode].title,
      leftScore,
      rightScore,
    }
  })

  const code = axes.map(axis => axis.dominantCode).join('')
  const meta = ARCHETYPE_META[code] || ARCHETYPE_META.OSPL

  return {
    code,
    title: meta.title,
    subtitle: meta.subtitle,
    summary: meta.summary,
    shareTitle: meta.shareTitle,
    guide: meta.guide,
    axes,
  }
}
