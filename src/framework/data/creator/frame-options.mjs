export const frameGroupOptions = [
  { label: '标准牌框', disabled: true },
  { value: 'Standard-3', label: '常规' },
  { value: 'Token-2', label: '衍生物' },
  { value: 'Saga-1', label: '传记' },
  { value: 'Planeswalker', label: '鹏洛客' },
  { value: 'Modal-1', label: '双面' },
  { value: 'DFC', label: '转化' },
  { label: '特殊牌框', disabled: true },
  { value: 'Showcase-5', label: 'Showcase牌框' },
  { value: 'UniversesBeyond', label: '无疆新宇宙' },
  { value: 'Promo-2', label: 'Promos (Tall Art)' },
  { value: 'Textless-4', label: '无文本/全卡图' },
  { label: '其他牌框', disabled: true },
  { value: 'Custom', label: '自定义' },
  { value: 'Misc-2', label: '旧/其他' },
  { value: 'Accurate', label: '准确牌框' },
  { value: 'Margin', label: '1/8英寸边距' },
  { label: '其他游戏', disabled: true },
  { value: 'FleshAndBlood', label: 'Flesh and Blood' },
];

export const frameAddButtons = [
  { id: 'addToFull', label: '添加牌框到卡片', onclick: 'addFrame()' },
  {
    id: 'addToRightHalf',
    label: '添加牌框到卡片（右半部分）',
    onclick: 'addFrame([{src:"/img/frames/maskRightHalf.png", name:"Right Half"}])',
  },
];

export const frameExtraAddButtons = [
  {
    id: 'addToLeftHalf',
    label: '添加牌框到卡片（左半部分）',
    onclick: 'addFrame([{src:"/img/frames/maskLeftHalf.png", name:"Left Half"}])',
  },
  {
    id: 'addToMiddleThird',
    label: '添加牌框到卡片（中间三分之一）',
    onclick: 'addFrame([{src:"/img/frames/maskMiddleThird.png", name:"Middle Third"}])',
  },
  {
    id: 'addToTopHalf',
    label: '添加牌框到卡片（上半）',
    onclick: 'addFrame([{src:"/img/frames/maskTopHalf.png", name:"Top Half"}])',
  },
  {
    id: 'addToBottomHalf',
    label: '添加牌框到卡片（下半）',
    onclick: 'addFrame([{src:"/img/frames/maskBottomHalf.png", name:"Bottom Half"}])',
  },
];
