export type CarsTravelTime = {
  name: string; // 'Наименование объекта',
  type: string; // 'Тип объекта',
  distance: number; // 'Дистанция, км',
  time_by_objects: string; // 'Время нахождения на объекте, ч.мин',
  shape: any; // для карты
  id: number; // id dt
  frontIsSelected: boolean; // выделить объект на карте
};
