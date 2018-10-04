import Mock from '../Mock';

export default class CarPoolMock extends Mock {
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
