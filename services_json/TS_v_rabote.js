// /GET https://ods.mos.ru/ssd/ets/services/dashboard/car_in_work_overall/
response:
{
  errors: [],
  result: {
    title: 'ТС в работе',
    items: [
      {
        title: 'ТС на линии: 21', //
        subItems: [
          {
            title: 'Механизированное подметание - 3 из 5',
          },
          {
            title: 'Еще тех операция - 1 из 7',
          }
        ]
      },
      {
        title: 'ТС не передающие сигнал: 3',
        subItems: [
          {
            data: {
              gov_number: '4404НО77',
              driver_fio: 'Горин Александр Викторович',
              driver_phone_number: '+7 916 111 22 33',
            }
          },
          {
            // ...
          }
        ]
      },
      {
        title: 'Общее количество ТС: 55',
      },
    ]
  }
}
