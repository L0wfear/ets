import Mock from './Mock.js';

export default class MissionDataMock extends Mock {

  constructor() {
    super();

    this.data = [
      {
        car_gov_number:"Р518КУ777",
        driver_fio:"Забиян Александр Викторович",
        driver_phone:"89057845337",
        estimated_finish_time:"2016-07-12T04:42:41",
        estimated_time_left:"8.0:37.0",
        left:172657.9521882451,
        mission_date_end:"2016-07-12T07:59:00",
        mission_date_start:"2016-07-11T18:00:00",
        mission_id:17189,
        mission_name:"Мойка проезжей части",
        route_check_unit:"кв. м.",
        route_id:18975,
        route_with_high_speed:"0.46 км ",
        route_with_work_speed:"0.18 км ",
        technical_operation_max_speed:20,
        technical_operation_name:"Мойка проезжей части",
        traveled_yet:1014.0478117548773,
        waybill_fact_arrival_date:"2016-07-12T07:59:00",
        waybill_fact_departure_date:"2016-07-11T18:00:00",
        with_high_speed_time:"за 0ч. 0м. 55с.",
        with_work_speed_time:"за 0ч. 1м. 9с."
      }
    ];
  }

  getData() {
		return {
			data: this.data
		};
	}

}
