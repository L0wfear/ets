import Mock from './Mock.js';

export default class ODHSupportStandardsMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        standard: 'Когда будет готово на бэке, попросить отключить моки',
        id: 0,
        unit: 'О да'
      }
    ];
  }

}
