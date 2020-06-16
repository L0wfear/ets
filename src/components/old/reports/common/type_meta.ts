// Пока инфа такая <<< Отчеты meta reportMeta
// Фильтры по типам тут -- src/components/old/ui/table/filter/FilterRow.tsx
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
  force_value?: string | number;    // Зничение по-умолчанию, если в отчете пустое поле, обычно используется для прочерков если null

  make_str_gov_number_format?: true;    // Нужно для отчёта "car_usage_report", чтобы фронт правильно отображал поля и отправлял данные в правильном формате для получения ПФ
};