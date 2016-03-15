// Сервис duty_mission (Наряд-задание)
// https://gost-jira.atlassian.net/wiki/pages/viewpage.action?pageId=18841753

// /GET http://ods.mos.ru/ssd/ets/services/duty_mission/
export const response =
{
  errors: [],
  result: [
    {
      status: 'not_assigned', // enum ['not_assigned', 'assigned', 'complete', 'fail']
      number: 1, // авто инкремент
      id: 1, // id
      mission_source_id: 4, // id из реестра mission_source
      technical_operation_id: 1, // id тех. операции
      technical_operation_name: 'Вывоз мусора', // название тех.операции
      plan_date_start: '2016-02-01T19:35:00',
      plan_date_end: '2016-02-01T19:35:00',
      fact_date_start: '2016-02-01T19:35:00',
      fact_date_end: '2016-02-01T19:35:00',
      route_id: 1, // id маршрута
      route_name: 'Маршрут', // название маршрута
      foreman_id: 1, // id бригадира из таблицы employee
      foreman_fio: 'Иванов А.П.', // ФИО Бригадира в сокращенном виде
      brigade_employee_id_list: [11, 12, 13], // Айдишники работников бригады
      car_mission_id: 1, // Задание для ТС, работающего с бригадой,
      mission_name: 'Задание 12',
      comment: 'Комментарий' // комментарий
    }
  ]
}

// /POST http://ods.mos.ru/ssd/ets/services/duty_mission/
let body =
{
  status: 'not_assigned', // enum ['not_assigned', 'assigned', 'complete', 'fail']
  mission_source_id: 1, // id из реестра mission_source
  technical_operation_id: 1, // id тех. операции
  plan_start: '2016-02-01T19:35:00',
  plan_end: '2016-02-01T19:35:00',
  fact_start: '2016-02-01T19:35:00',
  fact_end: '2016-02-01T19:35:00',
  route_id: 1, // id маршрута
  foreman_id: 1, // id бригадира из таблицы employee
  brigade_employee_id_list: [11, 12, 13], // Айдишники работников бригады
  car_mission_id: 1, // Задание для ТС, работающего с бригадой
  comment: 'Комментарий' // комментарий
}

// /PUT http://ods.mos.ru/ssd/ets/services/duty_mission/
body =
{
  id: 1,
  status: 'not_assigned', // enum ['not_assigned', 'assigned', 'complete', 'fail']
  mission_source_id: 1, // id из реестра mission_source
  technical_operation_id: 1, // id тех. операции
  plan_start: '2016-02-01T19:35:00',
  plan_end: '2016-02-01T19:35:00',
  fact_start: '2016-02-01T19:35:00',
  fact_end: '2016-02-01T19:35:00',
  route_id: 1, // id маршрута
  foreman_id: 1, // id бригадира из таблицы employee
  brigade_employee_id_list: [11, 12, 13], // Айдишники работников бригады
  car_mission_id: 1, // Задание для ТС, работающего с бригадой
  comment: 'Комментарий' // комментарий
}

// /DELETE http://ods.mos.ru/ssd/ets/services/duty_mission/
body =
{
  id: 1
}
