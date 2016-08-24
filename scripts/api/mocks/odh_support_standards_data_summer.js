import Mock from './Mock.js';

export default class ODHSupportStandardsDataSummerMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        technical_operation_name: "Мойка машиной",
        technical_operation_id: 10,
        standard_name: "Площадь мойки 1 машиной",
        standard_id: 0,
        unit: "кв. м.",
        categorized_1: "25000",
        categorized_2: "8000",
        categorized_3: "8000",
        categorized_4: "8000",
        categorized_5: "8000",
        categorized_6a: "25000",
        categorized_6b: "25000",
        categorized_6c: "25000",
        categorized_7a: "8000",
        categorized_7b: "5000",
        uncategorized_highway: "25000",
        uncategorized_odhs_center: "8000",
        uncategorized_odhs_other: "5000"
      }
    ];
  }

}
