import Mock from './Mock.js';

export default class MissionDataMock extends Mock {

  constructor() {
    super();

    this.data = [
      {
        car_gov_number: '8308АЕ77',
        driver_fio: 'Гошовський Василь Павлович',
        left: 44228,
        mission_date_end: '2016-06-23T19:00:00',
        mission_date_start: '2016-06-23T07:00:00',
        mission_id: 9135,
        mission_name: 'Подметание дворовых территорий и внутриквартальных проездов',
        route_check_unit: 'кв. м.',
        route_id: 9694,
        route_with_high_speed: '0.0 км ',
        route_with_work_speed: '0.0 км ',
        technical_operation_max_speed: 10,
        technical_operation_name: 'Подметание дворовых территорий и внутриквартальных проездов',
        traveled_yet: 0,
        waybill_fact_arrival_date: '2016-06-23T19:00:00',
        waybill_fact_departure_date: '2016-06-23T07:00:00',
        with_high_speed_time: 'за 0ч. 0м. 0с.',
        with_work_speed_time: 'за 0ч. 0м. 0с.',
      },
    ];
  }

  /**
    * Избегаем фильтрации по mission_id
    * @override getData
    */
  getData() {
    return {
      data: this.data,
    };
  }

}
