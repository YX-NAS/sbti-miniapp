import {
  dimensionMeta,
  dimensionOrder,
  DRUNK_TRIGGER_QUESTION_ID,
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  NORMAL_TYPES,
  DIM_EXPLANATIONS
} from './data';
import type { Question } from './data';

export type Level = 'L' | 'M' | 'H';

export interface RankedType {
  code: string;
  pattern: string;
  distance: number;
  exact: number;
  similarity: number;
  cn: string;
  intro: string;
  desc: string;
}

export interface TestResult {
  rawScores: Record<string, number>;
  levels: Record<string, Level>;
  ranked: RankedType[];
  bestNormal: RankedType;
  finalType: {
    code: string;
    cn: string;
    intro: string;
    desc: string;
  };
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: RankedType | null;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sumToLevel(score: number): Level {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

function levelNum(level: Level): number {
  return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('');
}

export function buildShuffledQuestions(): Question[] {
  const shuffledRegular = shuffle(questions);
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
  return [
    ...shuffledRegular.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffledRegular.slice(insertIndex)
  ];
}

export function getVisibleQuestions(
  shuffledQuestions: Question[],
  answers: Record<string, number>
): Question[] {
  const visible = [...shuffledQuestions];
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
  if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1]);
  }
  return visible;
}

export function computeResult(
  shuffledQuestions: Question[],
  answers: Record<string, number>
): TestResult {
  const rawScores: Record<string, number> = {};
  const levels: Record<string, Level> = {};
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });

  // 只用普通题目计分（specialQuestions 不计入维度）
  questions.forEach(q => {
    if (q.dim && answers[q.id] !== undefined) {
      rawScores[q.dim] += Number(answers[q.id]);
    }
  });

  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score);
  });

  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));

  const ranked: RankedType[] = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(v => levelNum(v as Level));
    let distance = 0;
    let exact = 0;
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i]);
      distance += diff;
      if (diff === 0) exact += 1;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
    return {
      ...type,
      ...TYPE_LIBRARY[type.code],
      distance,
      exact,
      similarity
    };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.similarity - a.similarity;
  });

  const bestNormal = ranked[0];
  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2;

  let finalType: TestResult['finalType'];
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;
  let secondaryType: RankedType | null = null;

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH;
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  } else {
    finalType = bestNormal;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType
  };
}

export function getDimExplanation(dim: string, level: Level): string {
  return DIM_EXPLANATIONS[dim]?.[level] || '';
}
