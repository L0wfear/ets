import Mock from '../Mock.js';

export default class OdhCoverageReportMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        company_name: 'string',
        percentage_one: 12,
        percentage_two: '77.2',
        percentage_three: 76,
        total_percentage: 22.2,
      },
    ];
  }

}
