import Mock from '../Mock.js';

export default class FuelingWaterMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        name: 'Гидрант',
        address: 'Русаковская д. 14',
      },
    ];
  }

}
