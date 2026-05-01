export type OceanType = 'dolphin' | 'octopus' | 'turtle' | 'jellyfish'

export type OceanFullQuestion = {
  id: string
  text: string
  note: string
  options: Array<{
    text: string
    scores: Partial<Record<OceanType, number>>
  }>
}

export type OceanTypeScore = {
  type: OceanType
  title: string
  emoji: string
  score: number
}

export type OceanFullResult = {
  code: string
  title: string
  subtitle: string
  summary: string
  shareTitle: string
  guide: string
  dominantType: OceanType
  secondaryType: OceanType
  scores: OceanTypeScore[]
}

const OCEAN_TYPE_META: Record<
  OceanType,
  { title: string; emoji: string; subtitle: string; summary: string; guide: string; order: number }
> = {
  dolphin: {
    title: '海豚型',
    emoji: '🐬',
    subtitle: '连接快、协作强、破冰自然',
    summary: '你在关系里常常是先把气氛拉起来的人，善于把陌生感变成合作感。',
    guide: '保持你的连接优势，同时在关键节点多给出结构化结论，能让你的影响力更稳定。',
    order: 1,
  },
  octopus: {
    title: '章鱼型',
    emoji: '🐙',
    subtitle: '观察细、策略强、应变灵活',
    summary: '你更像先看清局面再出手的人，遇到复杂任务时常有多线方案。',
    guide: '继续发挥你的策略能力，同时在推进中减少过度犹豫，给自己设置决策时限会更高效。',
    order: 2,
  },
  turtle: {
    title: '海龟型',
    emoji: '🐢',
    subtitle: '节奏稳、耐力高、长期靠谱',
    summary: '你不靠短时爆发，更擅长稳定推进。长期任务里，你的持续性是核心优势。',
    guide: '保持你的稳健节奏，并在阶段节点做一次高强度冲刺，能显著提升产出上限。',
    order: 3,
  },
  jellyfish: {
    title: '水母型',
    emoji: '🪼',
    subtitle: '感知细、共情强、氛围敏锐',
    summary: '你对氛围变化和他人情绪很敏感，擅长在关系里调节张力与边界。',
    guide: '保留你的共情力，同时明确自己的表达边界，避免把所有情绪都扛在自己身上。',
    order: 4,
  },
}

export const OCEAN_FULL_QUESTIONS: OceanFullQuestion[] = [
  {
    id: 'ocean_full_001',
    note: '看你在新场景中的第一反应',
    text: '进入一个全新团队时，你更自然的状态是？',
    options: [
      { text: '主动和大家打招呼，先把氛围拉起来', scores: { dolphin: 2, jellyfish: 1 } },
      { text: '先观察每个人的风格，再决定怎么互动', scores: { octopus: 2, turtle: 1 } },
      { text: '先熟悉规则和任务，再逐步进入关系', scores: { turtle: 2, octopus: 1 } },
      { text: '先感受现场情绪，找到舒服的交流距离', scores: { jellyfish: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'ocean_full_002',
    note: '看你面对冲突时的处理方式',
    text: '同伴意见冲突时，你通常会？',
    options: [
      { text: '快速组织共识，先把局面稳住', scores: { dolphin: 2, turtle: 1 } },
      { text: '拆分问题，把分歧点逐条处理', scores: { octopus: 2, turtle: 1 } },
      { text: '先按既定目标推进，减少无效讨论', scores: { turtle: 2, octopus: 1 } },
      { text: '先缓和情绪，再讨论谁对谁错', scores: { jellyfish: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'ocean_full_003',
    note: '看你在压力下的启动方式',
    text: '截止日期临近，你更可能？',
    options: [
      { text: '和人协作加速，把任务切块分工', scores: { dolphin: 2, octopus: 1 } },
      { text: '重排优先级，保住关键产出', scores: { octopus: 2, turtle: 1 } },
      { text: '按既有节奏稳定推进，不轻易乱阵脚', scores: { turtle: 2, jellyfish: 1 } },
      { text: '先稳住情绪，避免焦虑拖垮效率', scores: { jellyfish: 2, turtle: 1 } },
    ],
  },
  {
    id: 'ocean_full_004',
    note: '看你对关系边界的偏好',
    text: '在熟人关系里，你更看重？',
    options: [
      { text: '互动频率和共同体验', scores: { dolphin: 2 } },
      { text: '彼此清晰、可执行的约定', scores: { octopus: 2 } },
      { text: '长期稳定、言行一致', scores: { turtle: 2 } },
      { text: '被理解和情绪上的安全感', scores: { jellyfish: 2 } },
    ],
  },
  {
    id: 'ocean_full_005',
    note: '看你做决定时的依据',
    text: '面对一个不确定机会，你会优先看什么？',
    options: [
      { text: '是否能快速连接人脉和资源', scores: { dolphin: 2, octopus: 1 } },
      { text: '风险收益比与备选方案', scores: { octopus: 2, turtle: 1 } },
      { text: '是否可持续，能否长期兑现', scores: { turtle: 2, octopus: 1 } },
      { text: '这件事是否让你内心舒展', scores: { jellyfish: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'ocean_full_006',
    note: '看你在群体中的角色倾向',
    text: '团队活动里，你通常最像？',
    options: [
      { text: '热场与连接者', scores: { dolphin: 2 } },
      { text: '策略与统筹者', scores: { octopus: 2 } },
      { text: '执行与守稳者', scores: { turtle: 2 } },
      { text: '情绪与关系照顾者', scores: { jellyfish: 2 } },
    ],
  },
  {
    id: 'ocean_full_007',
    note: '看你如何处理失败反馈',
    text: '遇到挫折后，你更容易怎么恢复？',
    options: [
      { text: '找人聊聊，重新拉起行动感', scores: { dolphin: 2, jellyfish: 1 } },
      { text: '复盘过程，找到可改进节点', scores: { octopus: 2, turtle: 1 } },
      { text: '继续做该做的事，慢慢回到轨道', scores: { turtle: 2, octopus: 1 } },
      { text: '先处理情绪，再重启任务', scores: { jellyfish: 2, turtle: 1 } },
    ],
  },
  {
    id: 'ocean_full_008',
    note: '看你在沟通里的表达习惯',
    text: '表达重要想法时，你更习惯？',
    options: [
      { text: '先给结论，再互动推进', scores: { dolphin: 2, octopus: 1 } },
      { text: '先讲逻辑，再说选择建议', scores: { octopus: 2, turtle: 1 } },
      { text: '按步骤说明，确保落地可执行', scores: { turtle: 2, octopus: 1 } },
      { text: '先确认感受，再进入观点讨论', scores: { jellyfish: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'ocean_full_009',
    note: '看你对变化的适应方式',
    text: '计划突然变化时，你第一步会？',
    options: [
      { text: '拉人快速对齐，马上调整分工', scores: { dolphin: 2, octopus: 1 } },
      { text: '先看变量来源，重算最优路径', scores: { octopus: 2, turtle: 1 } },
      { text: '保持主线，避免节奏断裂', scores: { turtle: 2, octopus: 1 } },
      { text: '先稳住团队情绪，再重启推进', scores: { jellyfish: 2, dolphin: 1 } },
    ],
  },
  {
    id: 'ocean_full_010',
    note: '看你对“效率”的定义',
    text: '你更认可哪种高效？',
    options: [
      { text: '让更多人快速协同起来', scores: { dolphin: 2 } },
      { text: '用更少成本达到更好结果', scores: { octopus: 2 } },
      { text: '持续稳定输出，不大起大落', scores: { turtle: 2 } },
      { text: '关系和结果都不被消耗', scores: { jellyfish: 2 } },
    ],
  },
  {
    id: 'ocean_full_011',
    note: '看你在关系中的驱动力',
    text: '让你愿意长期投入一段关系的核心是？',
    options: [
      { text: '有共同目标、能一起成长', scores: { dolphin: 2, turtle: 1 } },
      { text: '彼此聪明、能高质量沟通', scores: { octopus: 2, dolphin: 1 } },
      { text: '稳定可信、承诺可兑现', scores: { turtle: 2, octopus: 1 } },
      { text: '被尊重、被理解、可安心表达', scores: { jellyfish: 2, turtle: 1 } },
    ],
  },
  {
    id: 'ocean_full_012',
    note: '看你当前阶段的主导特征',
    text: '最近的你更接近哪句话？',
    options: [
      { text: '我想连接更多人和机会', scores: { dolphin: 2 } },
      { text: '我想把复杂问题讲清并解开', scores: { octopus: 2 } },
      { text: '我想稳稳推进，不被外界打断', scores: { turtle: 2 } },
      { text: '我想在关系里保持真实与舒展', scores: { jellyfish: 2 } },
    ],
  },
]

function buildInitialScores(): Record<OceanType, number> {
  return {
    dolphin: 0,
    octopus: 0,
    turtle: 0,
    jellyfish: 0,
  }
}

export function buildOceanFullResult(answers: Record<string, number>): OceanFullResult {
  const scores = buildInitialScores()

  OCEAN_FULL_QUESTIONS.forEach(question => {
    const optionIndex = answers[question.id]
    if (typeof optionIndex !== 'number') return

    const option = question.options[optionIndex]
    if (!option) return

    Object.entries(option.scores).forEach(([type, value]) => {
      if (!value) return
      scores[type as OceanType] += value
    })
  })

  const sorted = (Object.keys(scores) as OceanType[])
    .sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a]
      return OCEAN_TYPE_META[a].order - OCEAN_TYPE_META[b].order
    })

  const dominantType = sorted[0]
  const secondaryType = sorted[1]
  const dominantMeta = OCEAN_TYPE_META[dominantType]

  return {
    code: dominantType.toUpperCase(),
    title: dominantMeta.title,
    subtitle: dominantMeta.subtitle,
    summary: dominantMeta.summary,
    shareTitle: `🌊 我在海洋TI完整版测出「${dominantMeta.title}」`,
    guide: dominantMeta.guide,
    dominantType,
    secondaryType,
    scores: sorted.map(type => ({
      type,
      title: OCEAN_TYPE_META[type].title,
      emoji: OCEAN_TYPE_META[type].emoji,
      score: scores[type],
    })),
  }
}
