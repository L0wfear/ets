export type Refill = {
  okrug_id: number;
  okrug_name: string;
  company_id: number;
  company_name: string;
  transaction_at: string | Date;
  number: string;
  fuel_type_id: number;
  fuel_type: string;
  given: number;
  gov_number: string;
  rrn_code: number;
  waybill_id: number;
  waybill_number: number;
  wb_fuel_card_number: number;
  wb_fuel_type: string;
  station_name: string;
  station_address: string;
  structure_id: number;
  structure_name: string;
};

// // Округ
// "okrug_id": 5,
// "okrug_name": "ЮВАО",
// // Организакция
// "company_id": 102266640,
// "company_name": "Жилищник Люблино",
// // Дата и время транзакции
// "transaction_at": "2020-09-12T09:20:00",
// // Номер топливной карты ГПН
// "number": "7005830010156016",
// // Тип топлива ГПН
// "fuel_type_id": 3,
// "fuel_type": "ДТ",
// // Выдано, л
// "given": 50.0,
// // Рег. номер ТС
// "gov_number": "НВ818777",
// // Путевой лист
// "waybill_id": 32331
// "waybill_number": 16301,
// // Номер топливной карты, указанной в ПЛ (перечисление через запятую)
// "wb_fuel_card_number": null,
// // Тип топлива, указанный в ПЛ (ТС, Спецоборудования)
// "wb_fuel_type": "АИ95, ДТ"
// // Наименование АЗС
// "station_name": "151",
// // Адрес АЗС
// "station_address": "Москва, Москва, ул. Озерная, д.33",
// // Подразделение
// "structure_id": null,
// "structure_name": null,
