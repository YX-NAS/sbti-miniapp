export type CharFullDimension = 'M' | 'Q' | 'W' | 'L' | 'P' | 'X' | 'G' | 'S'

export type CharFullQuestion = {
  id: string
  text: string
  note: string
  options: Array<{
    text: string
    scores: Partial<Record<CharFullDimension, number>>
  }>
}

export type CharFullAxisResult = {
  axis: string
  leftCode: CharFullDimension
  rightCode: CharFullDimension
  leftTitle: string
  rightTitle: string
  dominantCode: CharFullDimension
  dominantTitle: string
  leftScore: number
  rightScore: number
}

export type CharFullResult = {
  code: string
  title: string
  subtitle: string
  summary: string
  shareTitle: string
  guide: string
  axes: CharFullAxisResult[]
}

const AXIS_PAIRS: Array<[CharFullDimension, CharFullDimension, string]> = [
  ['M', 'Q', '表达方式'],
  ['W', 'L', '相处底色'],
  ['P', 'X', '处理方式'],
  ['G', 'S', '社交节奏'],
]

export const CHAR_FULL_DIMENSION_META: Record<
  CharFullDimension,
  { title: string; summary: string }
> = {
  M: { title: '主动带动', summary: '更愿意先开场、先回应，也更容易把气氛带起来。' },
  Q: { title: '稳静观察', summary: '更习惯先观察再表达，判断清楚后再推进关系。' },
  W: { title: '温暖照顾', summary: '更容易先照顾关系感受，关注别人是否舒服。' },
  L: { title: '边界清醒', summary: '更在意分寸与边界，会先确认值不值得靠近。' },
  P: { title: '计划执行', summary: '做事更偏向先理顺步骤，再稳定推进。' },
  X: { title: '灵感探索', summary: '容易被新点子和有趣可能性吸引，擅长跳出常规。' },
  G: { title: '群体联结', summary: '在群体和互动里更容易发挥存在感和影响力。' },
  S: { title: '自主节奏', summary: '更重视自己的节奏和空间，不喜欢被过度牵着走。' },
}

const ARCHETYPE_META: Record<
  string,
  { title: string; subtitle: string; summary: string; shareTitle: string; guide: string }
> = {
  MWPG: {
    title: '热场统筹倾向',
    subtitle: '会先把人带动起来，也很会把局面组织顺。',
    summary: '你通常是班里或宿舍里那个既能开场、又能把事推进下去的人。你的存在感不是靠吵，而是靠稳定的带动能力。',
    shareTitle: '我当前更接近热场统筹倾向',
    guide: '适合继续用好你的组织感，同时别把“我来撑场”变成默认责任，给别人一点上场空间。',
  },
  MWPS: {
    title: '暖感主线倾向',
    subtitle: '会带动气氛，也会努力让关系保持舒服和稳定。',
    summary: '你很容易成为团队里的温度来源。别人会觉得有你在，事情更顺、人也更容易放松下来。',
    shareTitle: '我当前更接近暖感主线倾向',
    guide: '继续保持你的温度和推进力，也记得别总是把他人的情绪放在自己前面。',
  },
  MWXG: {
    title: '气氛创意倾向',
    subtitle: '能量感、亲和力和新点子会一起出现。',
    summary: '你很适合做场面里的“灵感点火器”。你不只会把人带进互动里，还能让普通场景突然变得更有意思。',
    shareTitle: '我当前更接近气氛创意倾向',
    guide: '适合把你的点子留下一两个落地步骤，这样大家不只会觉得你好玩，也会觉得你很能成事。',
  },
  MWXS: {
    title: '灵感陪伴倾向',
    subtitle: '热情和温柔并存，更愿意用有趣方式靠近关系。',
    summary: '你在关系里很容易让别人感到轻松。你有自己的想法，也愿意用不冒犯的方式把气氛慢慢带起来。',
    shareTitle: '我当前更接近灵感陪伴倾向',
    guide: '继续保留你的柔软和创意，也可以练习在关键时刻更明确地表达需求。',
  },
  MLPG: {
    title: '边界组织倾向',
    subtitle: '会主动承担事情，但对分寸和效率要求也很清楚。',
    summary: '你并不是冷，而是会自然判断什么值得投入、怎么做更有效。你适合做团队里既能带头又不糊涂的人。',
    shareTitle: '我当前更接近边界组织倾向',
    guide: '适合继续发挥你的判断力，也别让“我已经想清楚了”变成别人难以靠近的门槛。',
  },
  MLPS: {
    title: '清醒执行倾向',
    subtitle: '更信任规则、节奏和清楚的边界。',
    summary: '你在群体里常给人一种很稳的感觉。你不一定最热闹，但通常是说到做到、分寸清楚的那一个。',
    shareTitle: '我当前更接近清醒执行倾向',
    guide: '继续保持你的可靠感，同时允许自己偶尔在不确定里放松一点，不必每次都那么绷紧。',
  },
  MLXG: {
    title: '观察策划倾向',
    subtitle: '会主动参与，但更习惯带着判断和创意去靠近现场。',
    summary: '你很少盲目跟场子走，而是边看边想。你常常不是最外放的人，但一旦出手就很容易给出高质量想法。',
    shareTitle: '我当前更接近观察策划倾向',
    guide: '适合把你的想法更早说一点，不然别人容易只看到你的冷静，看不到你的价值。',
  },
  MLXS: {
    title: '独立灵感倾向',
    subtitle: '更喜欢按自己的判断和兴趣节奏靠近人群。',
    summary: '你对关系有边界，对想法有坚持。你适合做那个有自己世界、但又不缺趣味的人。',
    shareTitle: '我当前更接近独立灵感倾向',
    guide: '继续保留你的独特感，也可以为信任的人多留一点可读懂你的入口。',
  },
  QWPG: {
    title: '稳定照顾倾向',
    subtitle: '不急着抢表达，但会在关键时刻把事和人一起接住。',
    summary: '你更像是那种安静但很让人放心的人。很多时候你不抢镜，却会自然把气氛和细节照顾到位。',
    shareTitle: '我当前更接近稳定照顾倾向',
    guide: '适合继续保留你的细腻，也可以练习让别人知道你并不是“永远没需求”的那个人。',
  },
  QWPS: {
    title: '温和守序倾向',
    subtitle: '更喜欢在稳定节奏里，慢慢把关系和事情都做好。',
    summary: '你不靠大开大合赢存在感，而是靠长期的可靠和舒服感被人记住。你在熟人关系里通常很有后劲。',
    shareTitle: '我当前更接近温和守序倾向',
    guide: '继续保持你的稳和温柔，同时也别因为太想维持和谐，就总把自己的想法往后放。',
  },
  QWXG: {
    title: '安静共鸣倾向',
    subtitle: '会在不张扬的状态里，用想法和感受连接别人。',
    summary: '你更擅长安静地理解人，也容易在细小互动里建立深一点的连接。你不一定最显眼，但通常很耐相处。',
    shareTitle: '我当前更接近安静共鸣倾向',
    guide: '适合继续用你的观察力和共情力，也可以在合适的时候多迈一步，让别人更容易发现你的在意。',
  },
  QWXS: {
    title: '柔和自持倾向',
    subtitle: '外在不吵闹，内在有温度，也有自己的边界和节奏。',
    summary: '你给人的感觉通常是舒服、稳定、不难靠近，但也不会轻易被场面带着走。你有一种很安静的存在感。',
    shareTitle: '我当前更接近柔和自持倾向',
    guide: '继续保护你的节奏感，也别总把“我自己消化一下”当成唯一处理方式。',
  },
  QLPG: {
    title: '冷静规划倾向',
    subtitle: '习惯先想清楚，再稳定推进自己的位置和关系。',
    summary: '你更相信判断和结构，不喜欢无效热闹。你适合做那个看起来不张扬，但关键时刻特别靠谱的人。',
    shareTitle: '我当前更接近冷静规划倾向',
    guide: '适合继续发挥你的清晰度，也可以给别人一点试错和解释的机会，关系会更松一点。',
  },
  QLPS: {
    title: '低调可靠倾向',
    subtitle: '不急着表达，也不轻易承诺，但一旦进入状态就很稳。',
    summary: '你常常给人“表面淡定、实际很能扛事”的感觉。你不爱铺张情绪，但会用行动证明自己。',
    shareTitle: '我当前更接近低调可靠倾向',
    guide: '继续保持你的稳定感，也试着在关键节点多说一点，让别人知道你不是冷淡，只是谨慎。',
  },
  QLXG: {
    title: '深想观察倾向',
    subtitle: '会在安静里判断局面，再用有质量的想法回应世界。',
    summary: '你更像一个先把信息在心里转几遍的人。别人可能觉得你慢热，但熟起来后会发现你很有想法。',
    shareTitle: '我当前更接近深想观察倾向',
    guide: '适合继续保留你的深度，也别让“我再想想”拖太久，好的想法需要被拿出来。',
  },
  QLXS: {
    title: '自持脑洞倾向',
    subtitle: '有独立的判断，也有只属于自己的想法和世界。',
    summary: '你不容易被外界节奏裹走，更适合在自己的空间里慢慢形成观点。你常常不是最先发声的，但一开口就有辨识度。',
    shareTitle: '我当前更接近自持脑洞倾向',
    guide: '适合继续用好你的独立性，同时把真正重要的想法更早拿出来，不必总等到完全确定。',
  },
}

export const CHAR_FULL_QUESTIONS: CharFullQuestion[] = [
  {
    id: 'char_full_001',
    text: '刚到一个新的班级或社团时，你更像哪种进入状态的方式？',
    note: '看你会怎么进入新环境',
    options: [
      { text: '会主动找人开口，先把气氛带起来', scores: { M: 2, G: 1 } },
      { text: '先观察一圈，再决定和谁靠近', scores: { Q: 2, S: 1 } },
      { text: '看现场感觉，觉得合适就自然加入', scores: { M: 1, Q: 1 } },
    ],
  },
  {
    id: 'char_full_002',
    text: '宿舍里有人情绪不太对时，你第一反应通常是？',
    note: '看你处理关系的底色',
    options: [
      { text: '会先照顾一下对方情绪，看看要不要聊聊', scores: { W: 2, G: 1 } },
      { text: '先判断现在适不适合靠近，不想越界', scores: { L: 2, S: 1 } },
      { text: '会先观察一下，等对方愿意再接', scores: { W: 1, L: 1 } },
    ],
  },
  {
    id: 'char_full_003',
    text: '小组任务开始时，你更习惯哪种做法？',
    note: '看你推进事情的方式',
    options: [
      { text: '先把流程分一下，确定谁做什么', scores: { P: 2, M: 1 } },
      { text: '先抛几个新思路，看能不能做得更有意思', scores: { X: 2, G: 1 } },
      { text: '先听一圈，再决定自己补哪一块', scores: { Q: 1, P: 1 } },
    ],
  },
  {
    id: 'char_full_004',
    text: '群聊冷场的时候，你通常更像？',
    note: '看你在关系现场的存在感',
    options: [
      { text: '会发点东西续上，不想气氛掉下去', scores: { M: 2, G: 1 } },
      { text: '一般不急着说，除非我真有想法', scores: { Q: 2, S: 1 } },
      { text: '如果想到有趣角度，会突然开口', scores: { X: 2, M: 1 } },
    ],
  },
  {
    id: 'char_full_005',
    text: '朋友来找你商量事时，你更容易先做什么？',
    note: '看你处理人和事的优先顺序',
    options: [
      { text: '先接住感受，让对方不要太难受', scores: { W: 2, S: 1 } },
      { text: '先帮对方理顺重点和边界', scores: { L: 2, P: 1 } },
      { text: '先看这件事有没有别的解法', scores: { X: 1, L: 1 } },
    ],
  },
  {
    id: 'char_full_006',
    text: '如果今天有一整天空档，你更想怎么过？',
    note: '看你更偏群体还是自主节奏',
    options: [
      { text: '约朋友一起做点事，热闹一点更舒服', scores: { G: 2, M: 1 } },
      { text: '按自己的节奏来，不太想被安排', scores: { S: 2, Q: 1 } },
      { text: '最好留一点弹性，想社交时再去', scores: { G: 1, S: 1 } },
    ],
  },
  {
    id: 'char_full_007',
    text: '遇到一个有点尴尬的新场面，你通常会？',
    note: '看你在不确定里的反应',
    options: [
      { text: '先主动做点什么，让大家松下来', scores: { M: 2, W: 1 } },
      { text: '先看看局面，再决定自己要不要出手', scores: { Q: 2, L: 1 } },
      { text: '脑子里会快速想几个能救场的办法', scores: { X: 2, P: 1 } },
    ],
  },
  {
    id: 'char_full_008',
    text: '别人通常会因为什么记住你？',
    note: '看你的长期存在感来自哪里',
    options: [
      { text: '你会带场子，也不太怕生', scores: { M: 2, G: 1 } },
      { text: '你很细腻，跟你相处有安全感', scores: { W: 2, S: 1 } },
      { text: '你有判断力，也挺有自己那一套', scores: { L: 1, X: 1 } },
    ],
  },
  {
    id: 'char_full_009',
    text: '面对一堆安排和消息时，你更像哪种处理方式？',
    note: '看你对秩序和变化的偏好',
    options: [
      { text: '先分清轻重缓急，一项项来', scores: { P: 2, L: 1 } },
      { text: '先看哪些更有意思或更值得投入', scores: { X: 2, S: 1 } },
      { text: '会边处理边微调，不想太死板', scores: { P: 1, X: 1 } },
    ],
  },
  {
    id: 'char_full_010',
    text: '和不太熟的人相处时，你更像哪一种？',
    note: '看你靠近关系的方式',
    options: [
      { text: '会先放出一点友好信号，看看对方接不接', scores: { M: 1, W: 1 } },
      { text: '会保持礼貌，但不太会一下子靠太近', scores: { Q: 1, L: 1 } },
      { text: '如果对方刚好有趣，会主动多说几句', scores: { X: 1, G: 1 } },
    ],
  },
  {
    id: 'char_full_011',
    text: '被别人误解时，你更常见的反应是？',
    note: '看你如何处理自我表达',
    options: [
      { text: '如果重要，我会解释清楚', scores: { M: 2, P: 1 } },
      { text: '先想想值不值得解释，不一定每次都说', scores: { L: 2, S: 1 } },
      { text: '会有点别扭，但更想等对方自己感受到', scores: { Q: 2, W: 1 } },
    ],
  },
  {
    id: 'char_full_012',
    text: '如果只能保留一种你的优势，你更希望是哪一种？',
    note: '看你最信任的那部分自己',
    options: [
      { text: '让人放松、愿意靠近的亲和力', scores: { W: 2, G: 1 } },
      { text: '想事情清楚、有分寸的判断力', scores: { L: 2, P: 1 } },
      { text: '能想出新办法、让事情变有趣的脑洞', scores: { X: 2, M: 1 } },
    ],
  },
]

export function buildCharFullResult(answers: Record<string, number>): CharFullResult {
  const totals: Record<CharFullDimension, number> = {
    M: 0,
    Q: 0,
    W: 0,
    L: 0,
    P: 0,
    X: 0,
    G: 0,
    S: 0,
  }

  CHAR_FULL_QUESTIONS.forEach(question => {
    const selectedIndex = answers[question.id]
    if (typeof selectedIndex !== 'number') return
    const option = question.options[selectedIndex]
    if (!option) return
    Object.entries(option.scores).forEach(([key, value]) => {
      totals[key as CharFullDimension] += value || 0
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
      leftTitle: CHAR_FULL_DIMENSION_META[leftCode].title,
      rightTitle: CHAR_FULL_DIMENSION_META[rightCode].title,
      dominantCode,
      dominantTitle: CHAR_FULL_DIMENSION_META[dominantCode].title,
      leftScore,
      rightScore,
    }
  })

  const code = axes.map(axis => axis.dominantCode).join('')
  const meta = ARCHETYPE_META[code] || ARCHETYPE_META.QLPS

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
