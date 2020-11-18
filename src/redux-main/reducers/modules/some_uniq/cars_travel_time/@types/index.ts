export type ObjectInfo = {
  name: string; // 'Наименование объекта',
  type: string; // 'Тип объекта',
  distance: number; // 'Дистанция, км',
  time_by_objects: string; // 'Время нахождения на объекте, ч.мин',
  shape: any; // для карты
  id: number; // id dt
};

export type CarsTravelTime = {
  objects_info: Array<ObjectInfo>;
  frontIsSelected: boolean; // выделить объект на карте
  travel_time_out_waybill: number; // Время движения вне ПЛ (ч:мин)
  distance_out_waybill: number; // Пройденное расстояние вне ПЛ, км
};
