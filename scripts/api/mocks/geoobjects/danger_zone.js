import Mock from '../Mock.js';

export default class DangerZoneMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        id: 0,
        name: 'Очень опасное место',
        address: 'Адрес д. 1',
        roadway_area: 12,
        sidewalk_area: 12,
        sidelines_area: 12
      }
    ];
  }

}
