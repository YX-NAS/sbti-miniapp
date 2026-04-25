export type StudentTendencyDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export type StudentTendencyQuestion = {
  id: string
  text: string
  note: string
  options: Array<{
    text: string
    scores: Partial<Record<StudentTendencyDimension, number>>
  }>
}

export type StudentTendencyAxisResult = {
  axis: string
  leftCode: StudentTendencyDimension
  rightCode: StudentTendencyDimension
  leftTitle: string
  rightTitle: string
  dominantCode: StudentTendencyDimension
  dominantTitle: string
  leftScore: number
  rightScore: number
}

const AXIS_PAIRS: Array<[StudentTendencyDimension, StudentTendencyDimension, string]> = [
  ['E', 'I', '表达方式'],
  ['S', 'N', '信息偏好'],
  ['T', 'F', '判断方式'],
  ['J', 'P', '节奏风格'],
]

export const STUDENT_TENDENCY_DIMENSION_META: Record<
  StudentTendencyDimension,
  { title: string; summary: string }
> = {
  E: { title: '外向表达', summary: '更愿意通过交流和行动把自己放进现场' },
  I: { title: '内向沉静', summary: '更习惯先观察、沉淀，再逐步表达自己' },
  S: { title: '现实落地', summary: '更关注当下事实、可执行性和具体细节' },
  N: { title: '想象探索', summary: '更容易被可能性、联想和新方向吸引' },
  T: { title: '分析判断', summary: '更看重逻辑、边界和问题本身的结构' },
  F: { title: '感受共情', summary: '更在意关系体验、情绪反馈和相处氛围' },
  J: { title: '节奏规划', summary: '更倾向先建立秩序，再一步步推进' },
  P: { title: '弹性体验', summary: '更愿意保留空间，在变化里边走边调' },
}

const ARCHETYPE_META: Record<
  string,
  { title: string; subtitle: string; shareTitle: string; guide: string }
> = {
  ENTJ: {
    title: '主动组织倾向',
    subtitle: '更愿意把方向说清楚，也更想推动事情发生',
    shareTitle: '我当前更接近主动组织倾向',
    guide: '你现在更容易在团队里承担发起和整合的角色。适合继续保留行动力，同时提醒自己给别人一点表达空间。',
  },
  ENTP: {
    title: '点子驱动倾向',
    subtitle: '容易被新想法点燃，也很擅长抛出不同角度',
    shareTitle: '我当前更接近点子驱动倾向',
    guide: '你在校园场景里通常是灵感比较快的人。继续用好你的发散力，同时给重要事情留一点收束和落地的步骤。',
  },
  ENFJ: {
    title: '共情带动倾向',
    subtitle: '能感受到人，也愿意把大家往同一方向带',
    shareTitle: '我当前更接近共情带动倾向',
    guide: '你很适合做连接人与气氛的人。保持你的温度，也记得别总是先顾别人，把自己的感受放到最后。',
  },
  ENFP: {
    title: '灵感联结倾向',
    subtitle: '热情、共情和想象力会一起工作',
    shareTitle: '我当前更接近灵感联结倾向',
    guide: '你更容易被人和新鲜感激活。适合把灵感写下来、做成计划，这样好点子才不会只停在一时兴奋里。',
  },
  ESTJ: {
    title: '稳定执行倾向',
    subtitle: '看重规则、效率和可推进的安排',
    shareTitle: '我当前更接近稳定执行倾向',
    guide: '你通常能让事情变得更有秩序。继续保持推进力，也可以适当放宽对自己和别人的“必须做到”。',
  },
  ESTP: {
    title: '行动试探倾向',
    subtitle: '更喜欢先上手，再用反馈修正方向',
    shareTitle: '我当前更接近行动试探倾向',
    guide: '你更擅长在现场找到感觉。适合把行动力和一点复盘结合起来，这会让你的冲劲更稳定。',
  },
  ESFJ: {
    title: '关系照顾倾向',
    subtitle: '会自然关注场面和他人的舒服程度',
    shareTitle: '我当前更接近关系照顾倾向',
    guide: '你在人际里很容易成为让人放心的那个人。继续保留温柔，也要练习说出自己的边界和真实需求。',
  },
  ESFP: {
    title: '气氛感染倾向',
    subtitle: '容易把轻松感和存在感带进现场',
    shareTitle: '我当前更接近气氛感染倾向',
    guide: '你通常能让场子活起来，也能把人拉进互动。适合把这种感染力用在长期目标上，而不只停在当下热闹。',
  },
  INTJ: {
    title: '独立规划倾向',
    subtitle: '先想清楚结构，再决定自己要不要投入',
    shareTitle: '我当前更接近独立规划倾向',
    guide: '你更擅长在心里建立完整判断。适合继续保护你的思考深度，同时让信任的人更容易读懂你。',
  },
  INTP: {
    title: '观察拆解倾向',
    subtitle: '喜欢先分析原理，再决定要不要表态',
    shareTitle: '我当前更接近观察拆解倾向',
    guide: '你很适合做问题的拆解者。继续用好这份清醒，也别让“想更明白一点”变成迟迟不行动。',
  },
  INFJ: {
    title: '深度共鸣倾向',
    subtitle: '会在安静里感知人，也在心里建立自己的判断',
    shareTitle: '我当前更接近深度共鸣倾向',
    guide: '你对关系和意义都很敏感。适合把内在感受慢慢转成可表达的话，让别人更容易接住你。',
  },
  INFP: {
    title: '内在理想倾向',
    subtitle: '更容易被感受、价值观和想象中的可能性牵动',
    shareTitle: '我当前更接近内在理想倾向',
    guide: '你很看重真实和共鸣。继续保护你的感受力，也给理想一点具体行动，让它慢慢落下来。',
  },
  ISTJ: {
    title: '守序稳进倾向',
    subtitle: '更信任稳定节奏、责任感和说到做到',
    shareTitle: '我当前更接近守序稳进倾向',
    guide: '你会给周围人很强的靠谱感。适合在保留稳定感的同时，偶尔给自己一点变化和松动的空间。',
  },
  ISTP: {
    title: '冷静实作倾向',
    subtitle: '会优先看问题本身，再用实际办法处理它',
    shareTitle: '我当前更接近冷静实作倾向',
    guide: '你适合在复杂局面里保持冷静。继续发挥你的执行判断，也别忽略关系里需要被说出来的部分。',
  },
  ISFJ: {
    title: '细致陪伴倾向',
    subtitle: '安静、细腻，也会把照顾别人放进细节里',
    shareTitle: '我当前更接近细致陪伴倾向',
    guide: '你常常是别人觉得“有你在就安心”的那种人。继续保留细致，也要记得照顾自己不是自私。',
  },
  ISFP: {
    title: '温和体验倾向',
    subtitle: '更在意感受是否真实，也希望节奏保有呼吸感',
    shareTitle: '我当前更接近温和体验倾向',
    guide: '你适合按自己的节奏生活和表达。继续保持松弛感，也可以练习在关键时刻更明确地表达立场。',
  },
}

export const STUDENT_TENDENCY_FULL_QUESTIONS: StudentTendencyQuestion[] = [
  {
    id: 'st_001',
    text: '新学期开学第一周，班里或社团出现很多不熟的人，你通常更接近哪种状态？',
    note: '看你会怎么进入新场景',
    options: [
      { text: '会主动去搭话，先把场子熟起来', scores: { E: 2, P: 1 } },
      { text: '先观察大家，再决定跟谁靠近', scores: { I: 2, J: 1 } },
      { text: '如果刚好有人开口，也能自然加入', scores: { E: 1, I: 1 } },
    ],
  },
  {
    id: 'st_002',
    text: '结束一天课程后，你更常靠什么恢复状态？',
    note: '看你如何充电',
    options: [
      { text: '找朋友聊聊，互动一下会更快恢复', scores: { E: 2 } },
      { text: '先自己待一会儿，安静下来更有用', scores: { I: 2 } },
      { text: '看当天状态，有时聊天有时独处', scores: { E: 1, I: 1 } },
    ],
  },
  {
    id: 'st_003',
    text: '老师临时点你表达看法时，你通常会怎么组织语言？',
    note: '看你在现场的输出方式',
    options: [
      { text: '想到什么先说出来，再边说边整理', scores: { E: 2, P: 1 } },
      { text: '先在心里过一遍，确认后再表达', scores: { I: 2, J: 1 } },
      { text: '会先抓重点，再决定说多少', scores: { E: 1, I: 1 } },
    ],
  },
  {
    id: 'st_004',
    text: '做课堂项目时，你更容易先注意到什么？',
    note: '看你处理信息的入口',
    options: [
      { text: '老师要求、时间节点和具体怎么做', scores: { S: 2, J: 1 } },
      { text: '这个题有没有更有趣的新方向', scores: { N: 2, P: 1 } },
      { text: '先把目标和可能性都扫一遍', scores: { S: 1, N: 1 } },
    ],
  },
  {
    id: 'st_005',
    text: '面对一段陌生材料，你更偏向哪种理解方式？',
    note: '看你更信任什么线索',
    options: [
      { text: '先抓明确内容、例子和能落地的部分', scores: { S: 2 } },
      { text: '先想它背后还有什么延伸和联系', scores: { N: 2 } },
      { text: '会在事实和联想之间来回切换', scores: { S: 1, N: 1 } },
    ],
  },
  {
    id: 'st_006',
    text: '如果朋友提出一个很跳跃的新点子，你第一反应更像？',
    note: '看你对新可能性的接受度',
    options: [
      { text: '先问它具体怎么执行', scores: { S: 2, T: 1 } },
      { text: '先顺着想下去，看它还能长出什么', scores: { N: 2, F: 1 } },
      { text: '看场景，有时先落地有时先发散', scores: { S: 1, N: 1 } },
    ],
  },
  {
    id: 'st_007',
    text: '朋友遇到冲突来找你时，你更自然的处理方式是？',
    note: '看你怎么做判断',
    options: [
      { text: '先帮对方理清问题和可做的选择', scores: { T: 2, J: 1 } },
      { text: '先接住情绪，让对方感觉被理解', scores: { F: 2, I: 1 } },
      { text: '会先安抚，再一起看问题', scores: { T: 1, F: 1 } },
    ],
  },
  {
    id: 'st_008',
    text: '小组里有人效率很低时，你更容易在意哪一边？',
    note: '看你优先权衡什么',
    options: [
      { text: '事情能不能按时推进、分工是否合理', scores: { T: 2 } },
      { text: '这个人是不是有压力、要不要先缓一下', scores: { F: 2 } },
      { text: '会同时看进度和人的状态', scores: { T: 1, F: 1 } },
    ],
  },
  {
    id: 'st_009',
    text: '当你要给别人反馈时，你通常更接近哪一种？',
    note: '看你表达判断的方式',
    options: [
      { text: '会比较直接，希望问题尽快解决', scores: { T: 2, E: 1 } },
      { text: '会顾及语气和接受度，尽量不伤人', scores: { F: 2, I: 1 } },
      { text: '看关系和场合决定直接到什么程度', scores: { T: 1, F: 1 } },
    ],
  },
  {
    id: 'st_010',
    text: '面对期中周或活动周，你更习惯怎样安排自己？',
    note: '看你的节奏偏好',
    options: [
      { text: '先列清单和节奏，按计划推进', scores: { J: 2, S: 1 } },
      { text: '先抓大方向，执行时再灵活调整', scores: { P: 2, N: 1 } },
      { text: '有一个大概框架，但不想排太死', scores: { J: 1, P: 1 } },
    ],
  },
  {
    id: 'st_011',
    text: '如果原定计划突然被打乱，你更可能？',
    note: '看你面对变化时的反应',
    options: [
      { text: '会想尽快重新建立秩序和安排', scores: { J: 2 } },
      { text: '会顺着新情况调整，先别把自己卡住', scores: { P: 2 } },
      { text: '会短暂不适应，但很快找到折中方案', scores: { J: 1, P: 1 } },
    ],
  },
  {
    id: 'st_012',
    text: '做一个重要决定前，你更希望自己是什么状态？',
    note: '看你怎么把事情定下来',
    options: [
      { text: '尽量信息清楚、节奏明确，再下决定', scores: { J: 2, T: 1 } },
      { text: '保留一点弹性，边走边看也没关系', scores: { P: 2, F: 1 } },
      { text: '先定一个方向，后面再按情况调整', scores: { J: 1, P: 1 } },
    ],
  },
]

export function buildStudentTendencyResult(answers: Record<string, number>) {
  const scores: Record<StudentTendencyDimension, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  }

  STUDENT_TENDENCY_FULL_QUESTIONS.forEach(question => {
    const selectedIndex = answers[question.id]
    if (typeof selectedIndex !== 'number') return
    const option = question.options[selectedIndex]
    if (!option) return

    Object.entries(option.scores).forEach(([dimension, value]) => {
      scores[dimension as StudentTendencyDimension] += value || 0
    })
  })

  const axes: StudentTendencyAxisResult[] = AXIS_PAIRS.map(([leftCode, rightCode, axis]) => {
    const leftScore = scores[leftCode]
    const rightScore = scores[rightCode]
    const dominantCode = leftScore >= rightScore ? leftCode : rightCode

    return {
      axis,
      leftCode,
      rightCode,
      leftTitle: STUDENT_TENDENCY_DIMENSION_META[leftCode].title,
      rightTitle: STUDENT_TENDENCY_DIMENSION_META[rightCode].title,
      dominantCode,
      dominantTitle: STUDENT_TENDENCY_DIMENSION_META[dominantCode].title,
      leftScore,
      rightScore,
    }
  })

  const code = axes.map(item => item.dominantCode).join('')
  const meta = ARCHETYPE_META[code] || ARCHETYPE_META.INFP
  const dominantSummaries = axes
    .map(item => STUDENT_TENDENCY_DIMENSION_META[item.dominantCode].summary)
    .join('；')

  return {
    code,
    title: meta.title,
    subtitle: meta.subtitle,
    shareTitle: meta.shareTitle,
    guide: meta.guide,
    summary: `你当前更接近「${meta.title}」。这更像你在校园学习、社交和合作中的阶段性偏好：${dominantSummaries}。`,
    axes,
    scores,
  }
}
