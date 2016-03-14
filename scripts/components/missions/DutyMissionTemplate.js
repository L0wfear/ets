// Сервис duty_mission_template (Шаблоны наряд-заданий)
// https://gost-jira.atlassian.net/wiki/pages/viewpage.action?pageId=18841753

// /GET http://ods.mos.ru/ssd/ets/services/duty_mission_template/
response:
{
  errors: [],
  result: [
    {
      number: 1, // авто инкремент
      id: 1, // id
      technical_operation_id: 1, // id тех. операции
      technical_operation_name: 'Вывоз мусора', // название тех.операции
      route_id: 1, // id маршрута
      route_name: 'Маршрут', // название маршрута
    },
    {
      // ...
    }
  ]
}

// /POST http://ods.mos.ru/ssd/ets/services/duty_mission_template/
body:
{
  technical_operation_id: 1, // id тех. операции
  route_id: 1, // id маршрута
}

// /PUT http://ods.mos.ru/ssd/ets/services/duty_mission_template/
body:
{
  id: 1,
  technical_operation_id: 1, // id тех. операции
  route_id: 1, // id маршрута
}

// /DELETE http://ods.mos.ru/ssd/ets/services/duty_mission_template/
body:
{
  id: 1
}
