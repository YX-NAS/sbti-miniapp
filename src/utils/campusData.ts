import {
  DIM_EXPLANATIONS,
  NORMAL_TYPES,
  dimensionMeta,
  dimensionOrder,
} from './data'

export { DIM_EXPLANATIONS, NORMAL_TYPES, dimensionMeta, dimensionOrder }

export interface QuestionOption {
  label: string
  value: number
}

export interface Question {
  id: string
  dim?: string
  text: string
  options: QuestionOption[]
  special?: boolean
  kind?: string
}

export const questions: Question[] = [
  {
    id: 'q1',
    dim: 'S1',
    text: '第一次参加不太熟悉的活动时，你更接近哪种状态？',
    options: [
      { label: '先紧张，怕自己表现不好', value: 1 },
      { label: '看场合决定，大多还能适应', value: 2 },
      { label: '能比较快进入状态，不太自我怀疑', value: 3 },
    ],
  },
  {
    id: 'q2',
    dim: 'S1',
    text: '老师突然让你上台表达观点时，你通常会怎么想？',
    options: [
      { label: '第一反应是“我可能说不好”', value: 1 },
      { label: '会慌一下，但还能组织语言', value: 2 },
      { label: '愿意试试，觉得自己能表达清楚', value: 3 },
    ],
  },
  {
    id: 'q3',
    dim: 'S2',
    text: '对“我想成为什么样的人”这件事，你的状态更接近？',
    options: [
      { label: '还比较模糊，经常换想法', value: 1 },
      { label: '有一些方向，但还在摸索', value: 2 },
      { label: '大致清楚，也知道自己看重什么', value: 3 },
    ],
  },
  {
    id: 'q4',
    dim: 'S2',
    text: '当外界声音很多时，你能分清自己真正想要的选择吗？',
    options: [
      { label: '经常被带着走', value: 1 },
      { label: '有时能分清，有时会犹豫', value: 2 },
      { label: '大多数时候能判断自己的真实想法', value: 3 },
    ],
  },
  {
    id: 'q5',
    dim: 'S3',
    text: '安排新学期目标时，你更像哪一种？',
    options: [
      { label: '先把舒服和稳定放前面', value: 1 },
      { label: '会在轻松和成长之间平衡', value: 2 },
      { label: '会给自己定清晰目标并主动推进', value: 3 },
    ],
  },
  {
    id: 'q6',
    dim: 'S3',
    text: '如果最近状态一般，你最可能靠什么把自己拉回来？',
    options: [
      { label: '先休息，不会强推自己', value: 1 },
      { label: '看情况调整节奏', value: 2 },
      { label: '想到重要目标后会重新打起精神', value: 3 },
    ],
  },
  {
    id: 'q7',
    dim: 'E1',
    text: '重要的人突然很久没回消息时，你通常会怎么解读？',
    options: [
      { label: '会先担心是不是自己哪里做错了', value: 1 },
      { label: '一半理解，一半会胡思乱想', value: 2 },
      { label: '更愿意先相信对方可能只是忙', value: 3 },
    ],
  },
  {
    id: 'q8',
    dim: 'E1',
    text: '在关系里，你对“被忽略”这件事的敏感度更接近？',
    options: [
      { label: '比较高，很容易察觉并在意', value: 1 },
      { label: '偶尔会多想，但还能调整', value: 2 },
      { label: '不容易被小波动影响', value: 3 },
    ],
  },
  {
    id: 'q9',
    dim: 'E2',
    text: '当你认定一段关系值得投入时，通常会？',
    options: [
      { label: '还是会留很多后手，不太敢全情投入', value: 1 },
      { label: '会慢慢增加投入，边走边看', value: 2 },
      { label: '会很认真地给出时间和情绪价值', value: 3 },
    ],
  },
  {
    id: 'q10',
    dim: 'E2',
    text: '对你来说，关系里的在意更像是？',
    options: [
      { label: '心里有，但不太主动表现出来', value: 1 },
      { label: '看对方和状态，有时明显有时克制', value: 2 },
      { label: '一旦在意就会比较真诚地表达', value: 3 },
    ],
  },
  {
    id: 'q11',
    dim: 'E3',
    text: '即使关系很好，你也需要明显的个人空间吗？',
    options: [
      { label: '更喜欢靠近和陪伴', value: 1 },
      { label: '要看对象和当下状态', value: 2 },
      { label: '是的，再亲近也要保留自己的节奏', value: 3 },
    ],
  },
  {
    id: 'q12',
    dim: 'E3',
    text: '如果朋友总想知道你每天在做什么，你会？',
    options: [
      { label: '能接受，觉得这也是亲近感', value: 1 },
      { label: '有时没问题，有时会想躲开', value: 2 },
      { label: '会本能地想保留一部分私人空间', value: 3 },
    ],
  },
  {
    id: 'q13',
    dim: 'A1',
    text: '认识新同学时，你第一反应通常更接近？',
    options: [
      { label: '先观察，别太快交底', value: 1 },
      { label: '先保持礼貌，再慢慢判断', value: 2 },
      { label: '通常会默认对方大概率是友好的', value: 3 },
    ],
  },
  {
    id: 'q14',
    dim: 'A1',
    text: '小组合作有人出错时，你更容易怎么想？',
    options: [
      { label: '会先怀疑对方是不是不上心', value: 1 },
      { label: '看情况，既看失误也看态度', value: 2 },
      { label: '会先考虑是不是有客观原因', value: 3 },
    ],
  },
  {
    id: 'q15',
    dim: 'A2',
    text: '面对学校明确要求和个人安排冲突时，你更像哪种选择？',
    options: [
      { label: '会优先按自己最舒服的方式来', value: 1 },
      { label: '会权衡利弊，再决定怎么做', value: 2 },
      { label: '通常会先把规则范围内的事做好', value: 3 },
    ],
  },
  {
    id: 'q16',
    dim: 'A2',
    text: '你对“临时改计划”这件事的接受度更接近？',
    options: [
      { label: '挺高，变化有时更有意思', value: 1 },
      { label: '看事情轻重，不会完全排斥', value: 2 },
      { label: '偏低，我更喜欢按原计划推进', value: 3 },
    ],
  },
  {
    id: 'q17',
    dim: 'A3',
    text: '做一件事之前，你会在意它对自己有没有长期意义吗？',
    options: [
      { label: '不太会，先把眼前过完更重要', value: 1 },
      { label: '有时会想，但不会一直想', value: 2 },
      { label: '会，我需要知道自己为什么要做', value: 3 },
    ],
  },
  {
    id: 'q18',
    dim: 'A3',
    text: '如果一段时间都在重复相似的学习和生活节奏，你会？',
    options: [
      { label: '容易觉得很多事都差不多，提不起劲', value: 1 },
      { label: '偶尔会空，但还能正常推进', value: 2 },
      { label: '会主动给自己找方向感或新目标', value: 3 },
    ],
  },
  {
    id: 'q19',
    dim: 'Ac1',
    text: '推动你做事的主要力量通常更像是？',
    options: [
      { label: '先别出错、别惹麻烦', value: 1 },
      { label: '既想做好，也会顾虑风险', value: 2 },
      { label: '想看到进步和成果', value: 3 },
    ],
  },
  {
    id: 'q20',
    dim: 'Ac1',
    text: '遇到不确定但有成长价值的机会时，你大多会？',
    options: [
      { label: '先退一步，避免翻车', value: 1 },
      { label: '考虑很久，再决定要不要试', value: 2 },
      { label: '愿意尝试，边做边学', value: 3 },
    ],
  },
  {
    id: 'q21',
    dim: 'Ac2',
    text: '选课、报名或做决定时，你一般属于？',
    options: [
      { label: '容易反复比较，拖到最后', value: 1 },
      { label: '会想一阵，但能在期限前定下来', value: 2 },
      { label: '判断清楚后就比较果断', value: 3 },
    ],
  },
  {
    id: 'q22',
    dim: 'Ac2',
    text: '当大家都在等你拍板时，你更可能？',
    options: [
      { label: '继续收集信息，怕决定得不够好', value: 1 },
      { label: '会再确认一下大家意见', value: 2 },
      { label: '能较快给出明确方向', value: 3 },
    ],
  },
  {
    id: 'q23',
    dim: 'Ac3',
    text: '面对已经列好的任务清单，你通常是？',
    options: [
      { label: '容易拖到最后才集中处理', value: 1 },
      { label: '能做一些，但节奏不总是稳定', value: 2 },
      { label: '会主动推进，不喜欢一直挂着', value: 3 },
    ],
  },
  {
    id: 'q24',
    dim: 'Ac3',
    text: '开始一件并不轻松的事时，你更像哪种人？',
    options: [
      { label: '得等压力上来才真正启动', value: 1 },
      { label: '需要热身，但最后还是会动', value: 2 },
      { label: '会尽快开始，让事情进入轨道', value: 3 },
    ],
  },
  {
    id: 'q25',
    dim: 'So1',
    text: '到了一个新社团或新群体里，你通常会？',
    options: [
      { label: '先待在边上观察，等别人来找我', value: 1 },
      { label: '有人搭话就接，没人也不会强行社交', value: 2 },
      { label: '会主动打招呼，帮自己打开局面', value: 3 },
    ],
  },
  {
    id: 'q26',
    dim: 'So1',
    text: '群聊突然冷场时，你更可能做什么？',
    options: [
      { label: '安静潜水，不太会主动救场', value: 1 },
      { label: '看心情，偶尔补一句', value: 2 },
      { label: '会主动抛话题或接梗把气氛拉起来', value: 3 },
    ],
  },
  {
    id: 'q27',
    dim: 'So2',
    text: '别人很快想和你变得很熟时，你通常会？',
    options: [
      { label: '其实挺欢迎，熟起来会更轻松', value: 1 },
      { label: '看对方，边走边调整距离', value: 2 },
      { label: '会先保留边界，不会一下子放太近', value: 3 },
    ],
  },
  {
    id: 'q28',
    dim: 'So2',
    text: '对你来说，“关系亲近”的理想状态更像是？',
    options: [
      { label: '彼此常常黏在一起也没关系', value: 1 },
      { label: '既能靠近，也要留一点空间', value: 2 },
      { label: '关系再好也应该保留明显边界', value: 3 },
    ],
  },
  {
    id: 'q29',
    dim: 'So3',
    text: '当你和周围人的想法不完全一致时，你更常怎么处理？',
    options: [
      { label: '会比较直接地表达出来', value: 1 },
      { label: '看场合，表达和保留各一半', value: 2 },
      { label: '更倾向先调整表达方式，再决定说多少', value: 3 },
    ],
  },
  {
    id: 'q30',
    dim: 'So3',
    text: '在不同圈子里，你的表达方式变化大吗？',
    options: [
      { label: '不太大，我通常比较一致', value: 1 },
      { label: '中等，会做一点适应', value: 2 },
      { label: '会明显调整，让自己更适配场景', value: 3 },
    ],
  },
]

export const specialQuestions: Question[] = [
  {
    id: 'drink_gate_q1',
    special: true,
    kind: 'night_gate',
    text: '你最喜欢哪种放松时段？',
    options: [
      { label: '清晨，脑子最清爽', value: 1 },
      { label: '下午，状态最平衡', value: 2 },
      { label: '深夜，灵感和情绪都更活跃', value: 3 },
      { label: '固定不了，看当天节奏', value: 4 },
    ],
  },
  {
    id: 'drink_gate_q2',
    special: true,
    kind: 'night_trigger',
    text: '如果第二天没有早课，你的作息更像哪一种？',
    options: [
      { label: '还是会尽量早点休息', value: 1 },
      { label: '会越到晚上越清醒，想把喜欢的事做完', value: 2 },
    ],
  },
]

export interface PersonalityType {
  code: string
  cn: string
  intro: string
  desc: string
}

export const TYPE_LIBRARY: Record<string, PersonalityType> = {
  CTRL: { code: 'AXIS', cn: '掌舵规划者', intro: '做事先定轴，再稳稳推进。', desc: '你很重视方向感和可控感，面对任务时会先梳理重点、顺序和节奏。你在班级合作或个人安排里常常像定盘星，越关键的场景越能看出你的稳定。' },
  'ATM-er': { code: 'ANCH', cn: '可靠承接型', intro: '事情落到你手里，大家会更放心。', desc: '你习惯把责任接住，也愿意在别人需要时多出一点力。学生关系里，你往往不是最张扬的人，但常常是最后把事情落稳的人。' },
  'Dior-s': { code: 'CHILL', cn: '现实松弛派', intro: '清醒、务实，也懂得给自己留余地。', desc: '你不会被外界节奏轻易带跑，更在意真实感受和现实可行性。你对生活的判断往往很接地气，知道什么时候该努力，什么时候该先把状态稳住。' },
  BOSS: { code: 'LEAD', cn: '主导推进型', intro: '遇到关键时刻，你会自然站到前面。', desc: '你对目标和效率有较强感知，常会主动推进事情向前走。无论是活动分工还是学习安排，你更习惯把局面握在手里。' },
  'THAN-K': { code: 'SOLR', cn: '暖光鼓励型', intro: '你很会给人情绪上的亮度。', desc: '你善于看见别人身上的优点，也愿意在关系里提供鼓励和肯定。对同学和朋友来说，你常常像一个低调但稳定的情绪补给站。' },
  'OH-NO': { code: 'GUARD', cn: '风险预判型', intro: '你总能比别人早一步看见问题。', desc: '你不是悲观，而是对风险和细节更敏锐。你习惯提前想好备选方案，所以在团队里经常承担“避免翻车”的关键角色。' },
  GOGO: { code: 'BOOST', cn: '即刻行动型', intro: '想到就动，行动会帮你找到答案。', desc: '你做事不太依赖长时间酝酿，很多时候边做边调更适合你。你的推进力很强，适合把想法迅速带到实践里。' },
  SEXY: { code: 'AURA', cn: '气场吸引型', intro: '你身上有一种让人愿意多看一眼的存在感。', desc: '你的表达、气质或社交方式容易让人留下印象。你未必会刻意成为焦点，但在人群里常能自然形成属于自己的辨识度。' },
  'LOVE-R': { code: 'HEART', cn: '深情共鸣型', intro: '你不是随便上心，但一上心就很认真。', desc: '你对关系中的细节和温度很敏锐，愿意投入真诚和耐心。对你来说，真正重要的连接值得慢慢经营，也值得被认真回应。' },
  MUM: { code: 'WARM', cn: '照顾支持型', intro: '你很会让人感到安心。', desc: '你擅长留意他人的感受，也知道怎样给出稳定的陪伴。无论在宿舍、班级还是朋友关系里，你都容易成为那个“有你在就好”的人。' },
  FAKE: { code: 'SHIFT', cn: '场景切换型', intro: '你很懂场合，也很会调整表达方式。', desc: '你对不同关系和场景的氛围感知很强，知道什么时候该松、什么时候该稳。这样的你不一定虚假，而是具备很高的情境适配力。' },
  OJBK: { code: 'CALM', cn: '松弛缓冲型', intro: '你不爱把情绪推到最满。', desc: '你处理很多事时会带一点缓冲感，不容易被小波动直接拉走。你身上的松弛感能帮关系降温，也能让你在复杂节奏里保持稳定。' },
  MALO: { code: 'PLAY', cn: '脑洞玩心型', intro: '你总能把普通场景变得更有意思。', desc: '你对新鲜点子、轻松玩法和反差表达有天然敏感度。你很适合做社交里的气氛补充者，也经常是让日常变得更好玩的人。' },
  'JOKE-R': { code: 'SPRK', cn: '欢乐点火型', intro: '有你在，气氛很难一直冷着。', desc: '你擅长用幽默、节奏感或表情管理把场子重新点亮。你在人群中的价值常常不是“说最多”，而是“最会让大家轻松下来”。' },
  'WOC!': { code: 'ALRT', cn: '敏锐观察型', intro: '你对变化和细节的反应通常比别人更快。', desc: '你会快速捕捉到气氛、态度和节奏上的小变化，因此判断常常来得很及时。你在关系中有很强的“察觉力”，能提早发现问题或机会。' },
  'THIN-K': { code: 'LOGI', cn: '逻辑分析型', intro: '你喜欢想明白，再决定怎么做。', desc: '你对信息、结构和因果关系很敏感，不太愿意凭感觉盲冲。对你来说，想清楚不是拖延，而是为了让后续动作更有效。' },
  SHIT: { code: 'EDGE', cn: '犀利改进型', intro: '你看问题时，常会直奔最关键的那一刀。', desc: '你不喜欢表面敷衍，更在意事情是否真正被改进。虽然表达有时会偏直接，但你的出发点通常是希望把问题看清、把事情做得更好。' },
  ZZZZ: { code: 'LAST', cn: '临门爆发型', intro: '压力一到位，你的推进力就会迅速觉醒。', desc: '你平时未必最先启动，但在关键节点往往能迅速聚焦并拉高效率。你适合冲刺场景，也常常能在最后阶段完成漂亮反击。' },
  POOR: { code: 'FOCS', cn: '专注深潜型', intro: '你一旦认定重点，就能把注意力压得很深。', desc: '你不会把精力平均撒出去，而是更愿意把资源投到真正重要的事上。这样的你在学习、兴趣或项目里都容易做出稳定深耕。' },
  MONK: { code: 'SOLO', cn: '独处复能型', intro: '安静不是退场，而是你的充电方式。', desc: '你很需要一段不被打扰的时间来整理情绪和恢复状态。你并不排斥关系，只是比很多人更重视内在节奏和精神空间。' },
  IMSB: { code: 'GLOW', cn: '敏感热心型', intro: '你想很多，也真的很在意。', desc: '你对评价、关系和细节的感知比较强，因此常常比别人更早被情绪触动。好的一面是，你对人和事也更真诚、更愿意付出。' },
  SOLO: { code: 'FENC', cn: '边界自护型', intro: '你会先保护自己，再决定靠近谁。', desc: '你不是冷淡，而是懂得先确认安全感再打开心门。对你来说，边界不是距离感，而是一种让关系更健康的保护方式。' },
  FUCK: { code: 'WILD', cn: '自由直行型', intro: '你很难被模板化安排完全束住。', desc: '你对规则和框架有自己的判断，更相信亲身体验和直接感受。你的行动有种不愿被驯化的生命力，也因此常能走出不同的路线。' },
  DEAD: { code: 'MIST', cn: '低耗观察型', intro: '你不总是高调在线，但一直在看。', desc: '你更习惯低能耗地处理外界信息，不会对每件事都立刻给出强反应。很多时候你像安静的观察者，在合适的时候才真正表达立场。' },
  IMFW: { code: 'TEND', cn: '回应依赖型', intro: '被好好回应，会让你整个人都亮起来。', desc: '你对稳定反馈和明确态度比较敏感，关系中的回应质量会显著影响你的状态。被认真对待时，你也会把自己的信任和认真给出去。' },
  HHHH: { code: 'MIXR', cn: '多维探索者', intro: '你的特质不太爱被单一标签装下。', desc: '你的维度分布更平均，说明你会根据场景切换不同的状态和策略。与其说你难归类，不如说你本来就更像一个仍在展开的多面型人格。' },
  DRUNK: { code: 'NITE', cn: '夜行观察者', intro: '深夜常常是你的第二主场。', desc: '当别人准备收线时，你的注意力、情绪感受和灵感反而更活跃。你在夜晚更容易进入自己的节奏，也更适合独立整理想法和表达。' },
}

export const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2'
