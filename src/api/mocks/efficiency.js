import Mock from './Mock.js';

export default class EfficiencyMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        id: '0',
        technical_operation_name: 'Ручная уборка тратуаров',
        technical_operation_id: '100',
        source: '0',
        areal_feature_name: 'Общая площадь (кв.м.)',
        areal_feature_id: '0',
        ratio: '0.8',
      },
      {
        id: '1',
        technical_operation_name: 'Автоматическая уборка тратуаров',
        technical_operation_id: '120',
        source: '1',
        areal_feature_name: 'Количество урн на остановках в кв.м.',
        areal_feature_id: '10',
        ratio: '0.4',
      },
    ];
  }

}
