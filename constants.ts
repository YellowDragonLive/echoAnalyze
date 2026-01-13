import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'workplace_meeting',
    name: '职场生存',
    description: '内部会议、绩效面谈、跨部门协作或推诿。',
    icon: '💼',
    promptContext: '中国职场环境。重点识别“踢皮球”、“画大饼”、表面客气实则甩锅、阴阳怪气、以及基于层级观念的潜台词。注意区分“建议”是否代表强制命令。',
  },
  {
    id: 'dating',
    name: '恋爱博弈',
    description: '初次约会、暧昧拉扯、冷战或分手边缘。',
    icon: '💘',
    promptContext: '当代恋爱语境。重点识别“好人卡”、假装矜持、欲擒故纵、情绪勒索（PUA前兆）或真正的拒绝信号。分析是否诚意不足或只是在养鱼。',
  },
  {
    id: 'family',
    name: '家庭聚会',
    description: '亲戚催婚、代际沟通、春节饭局。',
    icon: '🏠',
    promptContext: '中国式家庭语境。重点识别以“为你好”包装的控制欲、亲戚间的隐形攀比、催婚催生背后的面子问题，以及长辈并未直接表达的情感需求。',
  },
  {
    id: 'business_negotiation',
    name: '商务谈判',
    description: '销售攻单、合同博弈、甲方乙方。',
    icon: '🤝',
    promptContext: '高风险商业谈判。识别虚张声势、价格锚定、红白脸战术、假意让步以及“改天再聊”背后的真实意图。',
  },
  {
    id: 'social_friendship',
    name: '社交饭局',
    description: '同学聚会、朋友圈互动、人情往来。',
    icon: '🥂',
    promptContext: '社交面子文化。重点识别凡尔赛式炫耀、捧杀、塑料友情、隐性排挤或通过玩笑说出的真心话。',
  },
];

export const MOCK_RESULT_TEXT = `正在处理...`;