export const landingSampleSections = [
  {
    layerClass: 'layer readable-background center',
    gridClass: 'sample-grid',
    imageSide: 'left',
    image: {
      src: 'img/samples/sample1.png',
      className: 'animated-card-1',
      decoding: 'async',
      fetchpriority: 'high',
    },
    title: '选择一个牌框',
    description: 'Card Conjurer 提供了探险、发明、展示框等多种牌框。',
    linkText: '查看更多',
  },
  {
    layerClass: 'layer center',
    gridClass: 'sample-grid right',
    imageSide: 'right',
    image: {
      src: 'img/samples/sample2.png',
      className: 'animated-card-1 animation-delay-2',
      loading: 'lazy',
      decoding: 'async',
    },
    title: '自定义到你心满意足',
    description: 'Card Conjurer 提供了多种自定义选项，让你可以设计出你梦想中的卡片。',
    linkText: '试试看',
  },
  {
    layerClass: 'layer readable-background center',
    gridClass: 'sample-grid',
    imageSide: 'left',
    image: {
      src: 'img/samples/sample3.png',
      className: 'animated-card-1 animation-delay-4',
      loading: 'lazy',
      decoding: 'async',
    },
    title: '为你喜欢的卡牌增添光彩',
    description: '轻松导入现有卡片的必要信息，然后重新设计它们。',
    linkText: '试试看',
  },
];
