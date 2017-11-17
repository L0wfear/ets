import { IValidationSchema } from 'components/ui/form/@types/validation.h';

const carFormPassportGibdd: IValidationSchema = {
  properties: [
    {
      key: 'passport_gibdd_address',
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gibdd_manufactured_at',
      title: 'Год выпуска',
      type: 'number',
    },
    {
      key: 'passport_gibdd_engine_number',
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_vin',
      title: 'VIN (Идентификационный номер)',
      type: 'string',
      maxLength: 17,
    },
    {
      key: 'passport_gibdd_category_id',
      title: 'Категория транспортного средства',
      type: 'number',
      maxLength: 17,
    },
    {
      key: 'passport_gibdd_func_type_id',
      title: 'Тип транспортного средства',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gibdd_body_number',
      title: 'Кузов (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_body_color',
      title: 'Цвет кузова',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_engine_model',
      title: 'Модель двигателя',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_engine_power',
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gibdd_engine_volumne',
      title: 'Рабочий объем двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gibdd_engine_type_id',
      title: 'Тип двигателя',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gibdd_chassis',
      title: 'Шасси (рама)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_empty_weight',
      title: 'Масса без нагрузки, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gibdd_max_weight',
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gibdd_environmental_class',
      title: 'Экологический класс',
      type: 'string',
    },
    {
      key: 'passport_gibdd_origin_country_id',
      title: 'Страна-изготовитель',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gibdd_exporter_country_id',
      title: 'Страна вывоза автомобиля',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gibdd_customs_declaration',
      title: 'Серия и номер таможенной декларации',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_customs_restrictions',
      title: 'Таможенные ограничения',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gibdd_given_at',
      title: 'Дата выдачи ПТС',
      type: 'date',
      maxLength: 256,
    },
    {
      key: 'passport_gibdd_company_address',
      title: 'Адрес организации, выдавшей ПТС',
      type: 'string',
      maxLength: 256,
    },
  ],
};

const carFormPassportGtn: IValidationSchema = {
  properties: [
    {
      key: 'passport_gtn_address',
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gtn_manufactured_at',
      title: 'Год выпуска',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gtn_engine_number',
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_number',
      title: 'Серия и номер паспорта',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_manufacturer',
      title: 'Предприятие и изготовитель',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gtn_given_by',
      title: 'Выдан',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gtn_conformity_certificate',
      title: 'Сертификат соответствия',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gtn_tech_inspection_certificate',
      title: 'Акт гостехосмотра',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'passport_gtn_engine_power',
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gtn_body_color',
      title: 'Цвет',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_empty_weight',
      title: 'Конструкционная масса, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gtn_body_number',
      title: 'Заводской номер машины (рамы)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_gearbox',
      title: 'Коробка передач',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_axle_number',
      title: 'Номер основного ведущего моста',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'passport_gtn_propulsion_type_id',
      title: 'Тип движителя',
      type: 'number',
      integer: true,
    },
    {
      key: 'passport_gtn_max_speed',
      title: 'Максимальная конструктивная скорость, км/ч',
      type: 'number',
      float: 2,
    },
    {
      key: 'passport_gtn_dimensions',
      title: 'Габаритные размеры, мм',
      type: 'string',
      maxLength: 128,
    },
  ],
};

const carFormSchema: IValidationSchema = {
  properties: [
    // Main form
    {
      key: 'fuel_correction_rate',
      float: 2,
    },
    {
      key: 'note',
      type: 'text',
      maxLength: 4000,
    },
    {
      key: 'parking_address',
      type: 'string',
      maxLength: 2000,
    },
    // Register form
    {
      key: 'register_given_by',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'register_note',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 4000,
    },
    {
      key: 'register_note',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 4000,
    },
    {
      key: 'company_structure_id',
      title: 'Подразделение',
      type: 'number',
      integer: true,
    },
    ...carFormPassportGibdd.properties,
    ...carFormPassportGtn.properties,
  ],
};

export default carFormSchema;
