import Mock from './Mock.js';

export default class SSPMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        name: 'Автобаза',
        shortname: 'Абз',
        address: 'Адрес д.1',
        productivity: 12,
        is_mobile: 1
      }
    ];
  }

}
