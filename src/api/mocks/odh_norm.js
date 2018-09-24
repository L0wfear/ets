import Mock from './Mock';

export default class ODHNormMock extends Mock {
  constructor() {
    super();
    this.data = [
      {
        name: 'Когда будет готово на бэке, попросить отключить моки',
        id: 0,
        unit: 'О да',
      },
    ];
  }
}
