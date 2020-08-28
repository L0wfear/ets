const waybillPermissions = {
  list: 'waybill.list',
  create: 'waybill.create',
  read: 'waybill.read',
  update: 'waybill.update',
  delete: 'waybill.delete',
  // кастомные права
  update_closed: 'waybill.update_closed', // Путевой лист - Изменить закрытый
  plate: 'waybill.plate', // Путевой лист - Выдать
  departure_and_arrival_values: 'waybill.departure_and_arrival_values', // Путевой лист - Показатели выезда и возврата
  refill: 'waybill.refill', // Путевой лист - Заправки
  delete_unless_closed: 'waybill.delete_unless_closed', // Путевой лист - Удалить (черновик и активный)
  change_departure: 'waybill.change_departure', // Путевой лист – Изменить показатели выезда
};

export default waybillPermissions;
