import Mock from './Mock.js';

export default class OrganizationsMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        standard: 'Когда будет готово на бэке, попросить отключить моки',
        unit: 'О да'
      }
    ];
  }

}
