// Пока инфа такая
export type Meta = {
  name: string;  // Название колонки
  sortable?: false;   // false - нельзя сортировать по полю.                      Default - true
  filter?: false;     // false - нельзя фильтровать по полю (не будет фильтра).   Default - true
  type: (             // Тип фильтра
    'multiselect'         // Default
    | 'advanced-number'   // Числовой фильтр
    | 'advanced-date'     // Фильтр по датам
    | 'advanced-datetime'     // Фильтр по датам
  );
  display?: false;    // false - поле не отображается в таблице, но есть фильтр!. Default - true

  make_str_gov_number_format?: true;    // Нужно для отчёта "car_usage_report", чтобы фронт правильно отображал поля и отправлял данные в правильном формате для получения ПФ
};