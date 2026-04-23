export type TopicTestType = 'char' | 'love' | 'fun' | 'study'
export type TopicResultKey = 'A' | 'B' | 'C' | 'D'

export type TopicQuestion = {
  id: string
  type: TopicTestType
  question: string
  options: Array<{
    label: TopicResultKey
    text: string
  }>
}

export type TopicResultMeta = {
  title: string
  desc: string
  emoji: string
  shareTitle: string
}

export const TOPIC_TEST_CONFIG: Record<
  TopicTestType,
  {
    title: string
    subtitle: string
    emoji: string
    color: string
    count: number
  }
> = {
  char: {
    title: '学生性格测试',
    subtitle: '宿舍、同学、群聊里的真实你',
    emoji: '🧠',
    color: '#FF6B9D',
    count: 4,
  },
  love: {
    title: '情感模式测试',
    subtitle: '暗恋、暧昧和心动反应',
    emoji: '💕',
    color: '#FF8C7A',
    count: 4,
  },
  fun: {
    title: '趣味社交测试',
    subtitle: '适合转发的轻松社交话题',
    emoji: '🎮',
    color: '#6BCB77',
    count: 4,
  },
  study: {
    title: '学习状态测试',
    subtitle: '课堂、复习和考前情绪状态',
    emoji: '📚',
    color: '#4D96FF',
    count: 4,
  },
}

export const TOPIC_RESULT_META: Record<TopicTestType, Record<TopicResultKey, TopicResultMeta>> = {
  char: {
    A: {
      title: '社交主心骨型',
      desc: '你在同学和朋友之间很有带动气场，大家遇到尴尬局面时往往会看你怎么开场。你适合做活动发起者，也很容易成为宿舍里的气氛担当。',
      emoji: '🌟',
      shareTitle: '宿舍气场很强',
    },
    B: {
      title: '边界感清醒型',
      desc: '你不是冷淡，而是很清楚什么关系适合靠近、什么场景需要保留分寸。你在人际关系里有自己的节奏，越熟的人越能感受到你的稳定和靠谱。',
      emoji: '🧊',
      shareTitle: '边界感超稳',
    },
    C: {
      title: '温柔靠谱型',
      desc: '你习惯照顾别人的感受，做事细腻，和你相处会有很强的安全感。你可能不是最吵的那一个，但常常是最让人放心的那一个。',
      emoji: '🌈',
      shareTitle: '温柔但很有主见',
    },
    D: {
      title: '脑洞策划型',
      desc: '你对新鲜玩法和有趣点子很敏感，擅长把普通场景变得更有意思。你往往不是最先发言的人，但一开口就容易成为全场亮点。',
      emoji: '🚀',
      shareTitle: '脑洞输出稳定',
    },
  },
  love: {
    A: {
      title: '暗恋氛围组',
      desc: '你对心动细节非常敏感，一个眼神、一句晚安、一次同频都能在你心里放大成电影画面。你很适合暧昧拉扯，但也容易先自己上头。',
      emoji: '💘',
      shareTitle: '心动反应超明显',
    },
    B: {
      title: '慢热观察派',
      desc: '你不会轻易投入感情，更愿意先确认对方的人品和稳定度。你看起来慢，但一旦认定对方，反而是关系里最有耐心、最稳的一方。',
      emoji: '🌙',
      shareTitle: '慢热但很真诚',
    },
    C: {
      title: '安全感直球型',
      desc: '你不喜欢猜来猜去，喜欢把在意和需求说清楚。你在感情里有很强的认真感，只要遇到同样真诚的人，关系会推进得很顺。',
      emoji: '💌',
      shareTitle: '喜欢稳定回应',
    },
    D: {
      title: '高标准清醒型',
      desc: '你对关系质量有自己的判断，不会因为一时上头就轻易妥协。你在感情里既要心动，也要价值观合拍，所以筛选标准比别人更清晰。',
      emoji: '✨',
      shareTitle: '心动也要过脑子',
    },
  },
  fun: {
    A: {
      title: '梗王气氛组',
      desc: '你天然带一点搞笑体质，群里一冷场就容易靠你续命。你适合做聚会里的活跃担当，也很适合把测试结果分享给朋友一起玩。',
      emoji: '🤣',
      shareTitle: '自带气氛感',
    },
    B: {
      title: '反差冷幽默型',
      desc: '你不一定话多，但经常一开口就精准命中笑点。你的幽默感不是吵闹型，而是后劲很强、越品越上头的那种。',
      emoji: '😼',
      shareTitle: '安静但很好笑',
    },
    C: {
      title: '细节观察员型',
      desc: '你很会捕捉别人忽略的小细节，所以经常能说出让人觉得“你怎么发现的”那种话。你适合在社交里充当懂气氛、懂人心的一类人。',
      emoji: '🔍',
      shareTitle: '细节感拉满',
    },
    D: {
      title: '脑洞发射器型',
      desc: '你对奇怪想法和新鲜话题有极高接受度，能把日常聊天带进完全意想不到的方向。和你聊天通常不会无聊，因为你总能抛出新梗。',
      emoji: '🛸',
      shareTitle: '脑洞停不下来',
    },
  },
  study: {
    A: {
      title: '冲刺爆发型',
      desc: '你平时不一定最卷，但一到关键节点就会迅速进入状态。你属于考前战斗力很强的类型，越接近 deadline 越容易激发潜能。',
      emoji: '🔥',
      shareTitle: '考前爆发力超强',
    },
    B: {
      title: '稳扎稳打型',
      desc: '你更相信节奏和积累，不太喜欢临时抱佛脚。你在学习里追求稳定进步，只要计划跑顺，成绩通常不会太差。',
      emoji: '📘',
      shareTitle: '学习节奏很稳',
    },
    C: {
      title: '陪伴互助型',
      desc: '你在有人一起学习时状态更好，擅长把学习这件事变成一种相互鼓励的过程。你很适合组学习搭子，也能给身边人稳定情绪。',
      emoji: '🤝',
      shareTitle: '适合找学习搭子',
    },
    D: {
      title: '直觉效率型',
      desc: '你对“哪些内容最值得学”有很强判断力，擅长快速抓重点。你不一定花最多时间，但往往能把有限精力用在刀刃上。',
      emoji: '🎯',
      shareTitle: '抓重点很准',
    },
  },
}

export const TOPIC_QUESTIONS: TopicQuestion[] = [
  {
    id: 'char_001',
    type: 'char',
    question: '新学期刚分到一个新班级，你通常会怎么进入状态？',
    options: [
      { label: 'A', text: '主动找人聊天，先把气氛热起来' },
      { label: 'B', text: '先观察一圈，再决定和谁靠近' },
      { label: 'C', text: '留意谁看起来紧张，顺手照顾一下别人' },
      { label: 'D', text: '先研究班里有哪些有意思的人和事' },
    ],
  },
  {
    id: 'char_002',
    type: 'char',
    question: '宿舍临时决定晚上一起点夜宵，你更像哪一种？',
    options: [
      { label: 'A', text: '第一个站出来问大家想吃什么' },
      { label: 'B', text: '先看有没有人会踩雷，再决定跟不跟' },
      { label: 'C', text: '会提醒大家别忘了给没说话的人也点上' },
      { label: 'D', text: '开始提出“要不玩点新花样”的建议' },
    ],
  },
  {
    id: 'char_003',
    type: 'char',
    question: '群聊里突然安静下来时，你最可能的反应是？',
    options: [
      { label: 'A', text: '丢一个表情包把气氛续上' },
      { label: 'B', text: '安静潜水，等别人先开口' },
      { label: 'C', text: '发一句不冒犯任何人的温和回应' },
      { label: 'D', text: '抛一个脑洞话题让大家接' },
    ],
  },
  {
    id: 'char_004',
    type: 'char',
    question: '朋友来找你吐槽时，你通常会怎么做？',
    options: [
      { label: 'A', text: '边听边帮对方整理情绪和节奏' },
      { label: 'B', text: '先判断这件事值不值得你深度投入' },
      { label: 'C', text: '会耐心听完，再给稳定的安慰' },
      { label: 'D', text: '帮对方想一个更妙的解决办法' },
    ],
  },
  {
    id: 'love_001',
    type: 'love',
    question: '对方回你消息速度忽快忽慢时，你更像哪种反应？',
    options: [
      { label: 'A', text: '会忍不住脑补很多剧情' },
      { label: 'B', text: '先观察几天，不急着下结论' },
      { label: 'C', text: '想直接问清楚对方怎么想' },
      { label: 'D', text: '如果持续消耗你，就会开始降温' },
    ],
  },
  {
    id: 'love_002',
    type: 'love',
    question: '如果你暗恋一个人，最可能的表现是？',
    options: [
      { label: 'A', text: '偷偷关注对方所有动态' },
      { label: 'B', text: '装得很淡定，先看对方靠不靠谱' },
      { label: 'C', text: '会想办法制造自然接触的机会' },
      { label: 'D', text: '再喜欢也会先看价值观是否匹配' },
    ],
  },
  {
    id: 'love_003',
    type: 'love',
    question: '你最不能接受哪种恋爱状态？',
    options: [
      { label: 'A', text: '明明有感觉却一直不表态' },
      { label: 'B', text: '还没熟就想快速推进关系' },
      { label: 'C', text: '忽冷忽热、不给安全感' },
      { label: 'D', text: '只有情绪拉扯，没有长期规划' },
    ],
  },
  {
    id: 'love_004',
    type: 'love',
    question: '朋友说“那个人可能对你有意思”时，你第一反应是？',
    options: [
      { label: 'A', text: '表面镇定，内心已经开演一部剧' },
      { label: 'B', text: '先想想有没有客观证据' },
      { label: 'C', text: '如果我也有感觉，会想推进一下' },
      { label: 'D', text: '先冷静，别被一句话带跑' },
    ],
  },
  {
    id: 'fun_001',
    type: 'fun',
    question: '聚会里如果大家突然开始玩真心话，你通常是？',
    options: [
      { label: 'A', text: '负责把气氛推到最好笑' },
      { label: 'B', text: '偶尔补刀，精准输出金句' },
      { label: 'C', text: '默默观察每个人的反应细节' },
      { label: 'D', text: '提出更离谱但更好玩的新玩法' },
    ],
  },
  {
    id: 'fun_002',
    type: 'fun',
    question: '朋友发来一张很抽象的表情包，你一般会？',
    options: [
      { label: 'A', text: '立刻接梗，继续把楼盖高' },
      { label: 'B', text: '回一句轻飘飘但很有杀伤力的话' },
      { label: 'C', text: '顺手分析这张图为什么好笑' },
      { label: 'D', text: '马上找更怪的图反击回去' },
    ],
  },
  {
    id: 'fun_003',
    type: 'fun',
    question: '如果你突然在班里火了一条梗，原因大概率是？',
    options: [
      { label: 'A', text: '你本人就很会制造快乐' },
      { label: 'B', text: '你表情淡定但发言很有反差' },
      { label: 'C', text: '你总能发现别人注意不到的点' },
      { label: 'D', text: '你的脑洞方向没人能预测' },
    ],
  },
  {
    id: 'fun_004',
    type: 'fun',
    question: '班级群里要做一个轻松小游戏，你更适合担任？',
    options: [
      { label: 'A', text: '气氛发动机' },
      { label: 'B', text: '冷面搞笑担当' },
      { label: 'C', text: '规则观察员和细节控' },
      { label: 'D', text: '新玩法策划师' },
    ],
  },
  {
    id: 'study_001',
    type: 'study',
    question: '考试周来临时，你最真实的状态通常是？',
    options: [
      { label: 'A', text: '先焦虑一下，然后突然爆发' },
      { label: 'B', text: '照着节奏慢慢推进，不太慌' },
      { label: 'C', text: '更想约人一起学，互相监督' },
      { label: 'D', text: '先判断重点，再决定时间怎么分' },
    ],
  },
  {
    id: 'study_002',
    type: 'study',
    question: '面对一堆作业和复习任务，你最像哪一类？',
    options: [
      { label: 'A', text: 'deadline 越近越来劲' },
      { label: 'B', text: '喜欢列清单，一项项完成' },
      { label: 'C', text: '有人陪会更容易坚持下去' },
      { label: 'D', text: '会先挑收益最高的做' },
    ],
  },
  {
    id: 'study_003',
    type: 'study',
    question: '老师临时宣布要小测，你的第一反应更接近？',
    options: [
      { label: 'A', text: '完了，但我还能救一下' },
      { label: 'B', text: '问题不大，我平时有在跟进' },
      { label: 'C', text: '先问问朋友都复习到哪了' },
      { label: 'D', text: '先猜老师最可能考哪些点' },
    ],
  },
  {
    id: 'study_004',
    type: 'study',
    question: '如果今天必须高效学习 2 小时，你会怎么安排？',
    options: [
      { label: 'A', text: '先给自己一点压力，迅速进入冲刺模式' },
      { label: 'B', text: '切成几个固定小节，按部就班完成' },
      { label: 'C', text: '拉一个搭子一起打卡' },
      { label: 'D', text: '直接挑最重要的内容硬核推进' },
    ],
  },
]
