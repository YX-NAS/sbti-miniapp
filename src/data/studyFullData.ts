export type StudyFullDimension = 'B' | 'S' | 'P' | 'F' | 'I' | 'C' | 'K' | 'D'

export type StudyFullQuestion = {
  id: string
  text: string
  note: string
  options: Array<{
    text: string
    scores: Partial<Record<StudyFullDimension, number>>
  }>
}

export type StudyFullAxisResult = {
  axis: string
  leftCode: StudyFullDimension
  rightCode: StudyFullDimension
  leftTitle: string
  rightTitle: string
  dominantCode: StudyFullDimension
  dominantTitle: string
  leftScore: number
  rightScore: number
}

export type StudyFullResult = {
  code: string
  title: string
  subtitle: string
  summary: string
  shareTitle: string
  guide: string
  axes: StudyFullAxisResult[]
}

const AXIS_PAIRS: Array<[StudyFullDimension, StudyFullDimension, string]> = [
  ['B', 'S', '启动节奏'],
  ['P', 'F', '任务组织'],
  ['I', 'C', '学习陪伴'],
  ['K', 'D', '处理重点'],
]

export const STUDY_FULL_DIMENSION_META: Record<
  StudyFullDimension,
  { title: string; summary: string }
> = {
  B: { title: '冲刺激活', summary: '越接近节点越能拉起状态，适合在压力下集中爆发。' },
  S: { title: '稳步积累', summary: '更依赖稳定节奏和日常积累，提前推进会更安心。' },
  P: { title: '计划拆解', summary: '喜欢把任务拆清楚，再一步步执行。' },
  F: { title: '灵活应对', summary: '更习惯边做边调，给自己留机动空间。' },
  I: { title: '独立专注', summary: '一个人推进时更容易沉下去，不喜欢被频繁打断。' },
  C: { title: '互助陪学', summary: '有人一起学时更容易维持状态和动力。' },
  K: { title: '抓重点', summary: '擅长优先锁定高收益内容，先把关键部分拿下。' },
  D: { title: '细节沉浸', summary: '会自然看到细节和漏洞，适合把内容做扎实。' },
}

const ARCHETYPE_META: Record<
  string,
  { title: string; subtitle: string; summary: string; shareTitle: string; guide: string }
> = {
  BPIK: {
    title: '冲刺领航倾向',
    subtitle: '会先拉起节奏，再把最关键的部分迅速推进。',
    summary: '你在学习里常常是“先看主线、再狠狠干”的那类人。越接近节点，你越容易集中精力把重要内容拉起来。',
    shareTitle: '我当前更接近冲刺领航倾向',
    guide: '适合继续用你的爆发力冲关键节点，同时提前留一个缓冲段，避免所有压力都堆到最后。 ',
  },
  BPID: {
    title: '冲刺拆解倾向',
    subtitle: '临近节点会迅速进入状态，但也会把细节补得很完整。',
    summary: '你属于“爆发不是乱冲，而是带结构补洞”的类型。关键时刻很能拉起效率，也不容易把细节完全丢掉。',
    shareTitle: '我当前更接近冲刺拆解倾向',
    guide: '你很适合在阶段末做总复盘，建议把易错点单独收口，会比重复刷题更有效。',
  },
  BPCK: {
    title: '组队破题倾向',
    subtitle: '在紧张阶段更容易靠互动和主线任务一起推进。',
    summary: '你在学习里既需要节奏，也很容易被同伴带动。关键时刻找对搭子，会明显提升你的稳定性和行动力。',
    shareTitle: '我当前更接近组队破题倾向',
    guide: '适合保留搭子机制，但最好把共同目标写清楚，避免“聊得很努力，产出却不稳定”。',
  },
  BPCD: {
    title: '陪学冲刺倾向',
    subtitle: '越到后段越能被气氛和陪伴感推起来。',
    summary: '你更像“有人在身边就能越学越起劲”的类型。临近节点时，学习氛围和他人反馈会明显影响你的效率。',
    shareTitle: '我当前更接近陪学冲刺倾向',
    guide: '适合选择节奏接近、不会过度分心的搭子，把互相监督变成真正有效的推进器。',
  },
  BFIK: {
    title: '临场提效倾向',
    subtitle: '更喜欢边做边调，但很会先抓最值钱的部分。',
    summary: '你不是严格照计划推进的人，但对“先做什么最有效”有很强直觉。很多时候你是在行动中找到节奏。',
    shareTitle: '我当前更接近临场提效倾向',
    guide: '适合保留你的快速判断力，同时给自己一个最小清单，防止灵活变成频繁切换。',
  },
  BFID: {
    title: '弹性补洞倾向',
    subtitle: '学习时很会根据状态调整，也愿意把漏洞慢慢补齐。',
    summary: '你做事有弹性，也不会完全忽略细节。更适合在变化中保留一点秩序，而不是被严格计划卡住。',
    shareTitle: '我当前更接近弹性补洞倾向',
    guide: '建议把“今天先修哪几个漏洞”写成可见项，这样你的灵活性会更容易变成稳定进步。',
  },
  BFCK: {
    title: '互动提效倾向',
    subtitle: '容易在协作和交流里找到学习推进感。',
    summary: '你更容易在互动中提效，讨论、提问、互相解释都会帮助你更快进入状态。你适合把学习变成有来有回的过程。',
    shareTitle: '我当前更接近互动提效倾向',
    guide: '适合多用口头复述、互讲和限时讨论，但要记得给自己留一点安静吸收的时间。',
  },
  BFCD: {
    title: '气氛续航倾向',
    subtitle: '状态和学习氛围高度相关，适合在轻松但持续的节奏里推进。',
    summary: '你不是靠死压自己学习的人，更适合在舒服、能被接住的环境里慢慢拉长效率曲线。',
    shareTitle: '我当前更接近气氛续航倾向',
    guide: '建议先把环境稳定下来，比如固定座位、固定时间段，再谈更高强度的目标。',
  },
  SPIK: {
    title: '稳步主线倾向',
    subtitle: '更愿意按计划推进，也很擅长持续抓主线。',
    summary: '你属于“平时看起来不炸裂，但最后常常很稳”的类型。你相信长期推进，不太依赖最后冲刺。',
    shareTitle: '我当前更接近稳步主线倾向',
    guide: '继续保持你的稳定节奏，同时留一个弹性缓冲，避免计划一旦被打断就整体受影响。',
  },
  SPID: {
    title: '细节稳进倾向',
    subtitle: '会按自己的步骤慢慢做扎实，不喜欢临时慌乱。',
    summary: '你更看重“今天推进一点、最后不慌”这种节奏。你对细节和完成度比较在意，适合长期积累型任务。',
    shareTitle: '我当前更接近细节稳进倾向',
    guide: '适合继续坚持你的稳定推进，同时把阶段结果可视化，不然你容易低估自己已经做了多少。',
  },
  SPCK: {
    title: '节奏互助倾向',
    subtitle: '在稳定节奏里，有搭子会让你学得更轻松也更久。',
    summary: '你需要节奏，也能从陪伴感里获得持续动力。你不是靠最后一口气的人，而是更适合稳稳往前走。',
    shareTitle: '我当前更接近节奏互助倾向',
    guide: '适合和节奏相近的人一起打卡，把互相陪伴变成长期机制，而不是只在焦虑时临时抱团。',
  },
  SPCD: {
    title: '陪学守序倾向',
    subtitle: '喜欢按部就班，也会在合作里照顾彼此的推进感。',
    summary: '你既重视秩序，也在意相处中的稳定感。你更适合“节奏明确、氛围不乱”的学习环境。',
    shareTitle: '我当前更接近陪学守序倾向',
    guide: '适合制定固定学习时段和共同规则，这会让你的舒服节奏更容易长期保持。',
  },
  SFIK: {
    title: '自由抓重点倾向',
    subtitle: '不喜欢被卡得太死，但很会判断哪些内容值得先做。',
    summary: '你对学习有自己的判断，不太依赖标准模板。只要方向判断准，你往往能用更少时间拿到更高收益。',
    shareTitle: '我当前更接近自由抓重点倾向',
    guide: '建议把你的“重点判断”外化成笔记或清单，这样临时状态波动时也不会失去主线。',
  },
  SFID: {
    title: '沉浸自学倾向',
    subtitle: '更适合独自慢慢进入状态，在自己的节奏里补齐细节。',
    summary: '你不是那种被外界一推就冲的人，更像在安静里慢慢发力。你适合沉浸式独立学习。',
    shareTitle: '我当前更接近沉浸自学倾向',
    guide: '继续保护你的独立专注力，也别把所有任务都拖到“等我状态完全对了再开始”。',
  },
  SFCK: {
    title: '弹性搭子倾向',
    subtitle: '节奏不想太硬，但有人陪着会更容易持续投入。',
    summary: '你需要空间，也需要陪伴感。你不太适合高压、死板的学习方式，更适合柔和但持续的推进。',
    shareTitle: '我当前更接近弹性搭子倾向',
    guide: '建议选择不强控、不内耗的搭子关系，让陪伴是加分项，而不是额外负担。',
  },
  SFCD: {
    title: '松弛细磨倾向',
    subtitle: '不喜欢过度逼迫自己，更适合在舒服节奏里把内容磨扎实。',
    summary: '你更重视状态和吸收感，而不是表面的“卷”。只要环境合适，你其实很能慢慢把内容做细。',
    shareTitle: '我当前更接近松弛细磨倾向',
    guide: '适合把目标拆得更小、更可完成，让松弛感和完成度同时存在，而不是互相拉扯。',
  },
}

export const STUDY_FULL_QUESTIONS: StudyFullQuestion[] = [
  {
    id: 'study_full_001',
    text: '考试周刚开始时，你通常更像哪种状态？',
    note: '看你会怎么启动学习节奏',
    options: [
      { text: '先缓一缓，等压力上来后再集中冲', scores: { B: 2, F: 1 } },
      { text: '提前排好节奏，尽量别让自己临时乱掉', scores: { S: 2, P: 1 } },
      { text: '先摸清这周最难的点，再决定节奏怎么拉', scores: { K: 1, S: 1 } },
    ],
  },
  {
    id: 'study_full_002',
    text: '面对一大堆作业和复习任务，你第一步通常会？',
    note: '看你组织任务的方法',
    options: [
      { text: '先列出来，按优先级拆分', scores: { P: 2, D: 1 } },
      { text: '先做最想做或最顺手的，边做边调', scores: { F: 2, B: 1 } },
      { text: '先判断哪部分最值，再优先推进', scores: { K: 2, F: 1 } },
    ],
  },
  {
    id: 'study_full_003',
    text: '学习状态不稳时，哪种方式最容易把你拉回来？',
    note: '看你如何恢复专注',
    options: [
      { text: '关掉干扰，自己安静学一会儿', scores: { I: 2, D: 1 } },
      { text: '找搭子一起学，有人陪更容易进入状态', scores: { C: 2, S: 1 } },
      { text: '先做一道容易见效的题，把节奏拉起来', scores: { B: 1, K: 1 } },
    ],
  },
  {
    id: 'study_full_004',
    text: '老师刚讲完一章内容，你最自然的复习动作是？',
    note: '看你如何处理信息',
    options: [
      { text: '先把框架和重点记下来', scores: { K: 2, P: 1 } },
      { text: '先补例题和细节点，怕后面漏掉', scores: { D: 2, S: 1 } },
      { text: '先看自己最不懂的是哪里，再决定怎么复习', scores: { F: 1, K: 1 } },
    ],
  },
  {
    id: 'study_full_005',
    text: '如果突然加了一项临时任务，你通常会？',
    note: '看你应对变化的习惯',
    options: [
      { text: '重新排一下顺序，把计划调整好', scores: { P: 2, S: 1 } },
      { text: '先顶上去做，边做边看要不要改安排', scores: { F: 2, B: 1 } },
      { text: '先砍掉不重要的部分，只保留主线任务', scores: { K: 2, P: 1 } },
    ],
  },
  {
    id: 'study_full_006',
    text: '你更容易在哪种学习场景里持续投入？',
    note: '看你需要什么环境',
    options: [
      { text: '一个人待着，没人打断最舒服', scores: { I: 2, S: 1 } },
      { text: '有人一起坐着，各学各的也很好', scores: { C: 2, P: 1 } },
      { text: '有一点互动和交流，状态更容易续上', scores: { C: 2, F: 1 } },
    ],
  },
  {
    id: 'study_full_007',
    text: '做错题整理时，你更看重什么？',
    note: '看你是先收主线还是先补细节',
    options: [
      { text: '先看这类题背后的规律和重点', scores: { K: 2, I: 1 } },
      { text: '先逐题补漏洞，别让同样的错再出现', scores: { D: 2, P: 1 } },
      { text: '先把最容易提分的错题挑出来', scores: { K: 2, B: 1 } },
    ],
  },
  {
    id: 'study_full_008',
    text: '当计划被打乱时，你更容易是哪种反应？',
    note: '看你对秩序和变化的容忍度',
    options: [
      { text: '会有点不舒服，但会尽快重排', scores: { P: 2, S: 1 } },
      { text: '问题不大，直接换一种做法继续', scores: { F: 2, B: 1 } },
      { text: '先看剩下时间够不够，再保重点', scores: { K: 1, F: 1 } },
    ],
  },
  {
    id: 'study_full_009',
    text: '距离截止时间只剩不多时，你常见的表现是？',
    note: '看压力会怎样改变你',
    options: [
      { text: '效率突然拔高，整个人都进入状态', scores: { B: 2 } },
      { text: '如果前面跟得稳，后面反而不太慌', scores: { S: 2 } },
      { text: '会先删掉枝节内容，只做最关键的', scores: { K: 2, B: 1 } },
    ],
  },
  {
    id: 'study_full_010',
    text: '要准备一个比较大的学习目标时，你更像？',
    note: '看你如何推进长期任务',
    options: [
      { text: '先分阶段安排，每段完成什么都写清楚', scores: { P: 2, S: 1 } },
      { text: '先开始，做到哪一步再决定下一步', scores: { F: 2, I: 1 } },
      { text: '先确定最核心的结果，其他再围着它展开', scores: { K: 2, P: 1 } },
    ],
  },
  {
    id: 'study_full_011',
    text: '当你学不进去时，更可能找谁来帮自己？',
    note: '看你会不会借力',
    options: [
      { text: '一般先自己调状态，不太想麻烦别人', scores: { I: 2, D: 1 } },
      { text: '找学习搭子互相监督，会更有劲', scores: { C: 2, B: 1 } },
      { text: '看情况，有时自己扛，有时借一下别人节奏', scores: { I: 1, C: 1 } },
    ],
  },
  {
    id: 'study_full_012',
    text: '如果只能保留一种学习优势，你更希望是哪种？',
    note: '看你最信任的能力',
    options: [
      { text: '关键时刻能迅速进入高效状态', scores: { B: 2, K: 1 } },
      { text: '长期稳定地慢慢推进，不轻易掉线', scores: { S: 2, P: 1 } },
      { text: '一眼判断哪里最值得投入精力', scores: { K: 2, I: 1 } },
    ],
  },
]

export function buildStudyFullResult(answers: Record<string, number>): StudyFullResult {
  const totals: Record<StudyFullDimension, number> = {
    B: 0,
    S: 0,
    P: 0,
    F: 0,
    I: 0,
    C: 0,
    K: 0,
    D: 0,
  }

  STUDY_FULL_QUESTIONS.forEach(question => {
    const selectedIndex = answers[question.id]
    if (typeof selectedIndex !== 'number') return
    const option = question.options[selectedIndex]
    if (!option) return
    Object.entries(option.scores).forEach(([key, value]) => {
      totals[key as StudyFullDimension] += value || 0
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
      leftTitle: STUDY_FULL_DIMENSION_META[leftCode].title,
      rightTitle: STUDY_FULL_DIMENSION_META[rightCode].title,
      dominantCode,
      dominantTitle: STUDY_FULL_DIMENSION_META[dominantCode].title,
      leftScore,
      rightScore,
    }
  })

  const code = axes.map(axis => axis.dominantCode).join('')
  const meta = ARCHETYPE_META[code] || ARCHETYPE_META.SPIK

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
