import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsCar, CarWrap } from './@types/CarForm';
import { validate } from 'components/ui/form/new/validate';
import { get } from 'lodash';
import { CarPassporntData, CarGibddPasspost, CarGtnPasspost } from 'redux-main/reducers/modules/autobase/car/@types';

const nonError = {};

export const carPassportDataGibddSchema: SchemaType<CarGibddPasspost, PropsCar> = {
  properties: [
    {
      key: 'seria_number',
      title: 'Серия и номер паспорта',
      type: 'string',
      minLength: 10,
      maxLength: 10,
      trimSpace: true,
    },
    {
      key: 'address',
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'manufactured_at',
      title: 'Год выпуска',
      type: 'valueOfArray',
    },
    {
      key: 'engine_number',
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'vin',
      title: 'VIN (Идентификационный номер)',
      type: 'string',
      maxLength: 17,
    },
    {
      key: 'category_id',
      title: 'Категория транспортного средства',
      type: 'valueOfArray',
    },
    {
      key: 'func_type_id',
      title: 'Тип транспортного средства',
      type: 'valueOfArray',
    },
    {
      key: 'body_number',
      title: 'Кузов (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'body_color',
      title: 'Цвет кузова',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'engine_model',
      title: 'Модель двигателя',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'engine_power',
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'engine_volumne',
      title: 'Рабочий объем двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'engine_type_id',
      title: 'Тип двигателя',
      type: 'valueOfArray',
    },
    {
      key: 'chassis',
      title: 'Шасси (рама)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'empty_weight',
      title: 'Масса без нагрузки, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'max_weight',
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'environmental_class',
      title: 'Экологический класс',
      type: 'string',
    },
    {
      key: 'origin_country_id',
      title: 'Страна-изготовитель',
      type: 'valueOfArray',
    },
    {
      key: 'exporter_country_id',
      title: 'Страна вывоза автомобиля',
      type: 'valueOfArray',
    },
    {
      key: 'customs_declaration',
      title: 'Серия и номер таможенной декларации',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'customs_restrictions',
      title: 'Таможенные ограничения',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'given_at',
      title: 'Дата выдачи ПТС',
      type: 'date',
    },
    {
      key: 'company_address',
      title: 'Адрес организации, выдавшей ПТС',
      type: 'string',
      maxLength: 256,
    },
  ],
};
export const carPassportDataGtnSchema: SchemaType<CarGtnPasspost, PropsCar> = {
  properties: [
    {
      key: 'address',
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'manufactured_at',
      title: 'Год выпуска',
      type: 'valueOfArray',
    },
    {
      key: 'engine_number',
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'number',
      title: 'Серия и номер паспорта',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'manufacturer',
      title: 'Предприятие и изготовитель',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'given_by',
      title: 'Выдан',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'conformity_certificate',
      title: 'Сертификат соответствия',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'tech_inspection_certificate',
      title: 'Акт гостехосмотра',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'engine_power',
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    {
      key: 'body_color',
      title: 'Цвет',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'empty_weight',
      title: 'Конструкционная масса, кг',
      type: 'number',
      float: 2,
    },
    {
      key: 'body_number',
      title: 'Заводской номер машины (рамы)',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'gearbox',
      title: 'Коробка передач',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'axle_number',
      title: 'Номер основного ведущего моста',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'propulsion_type_id',
      title: 'Тип движителя',
      type: 'valueOfArray',
    },
    {
      key: 'max_speed',
      title: 'Максимальная конструктивная скорость, км/ч',
      type: 'number',
      float: 2,
    },
    {
      key: 'dimensions',
      title: 'Габаритные размеры, мм',
      type: 'string',
      maxLength: 128,
    },
  ],
};

export const carRegistrationDataSchema: SchemaType<CarWrap['registration_data'], PropsCar> = {
  properties: [
    {
      key: 'given_by',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'given_at',
      title: 'Дата регистрации',
      type: 'date',
    },
    {
      key: 'note',
      title: 'Особые отметки',
      type: 'string',
      maxLength: 4000,
    },
  ],
};

export const carFormSchema: SchemaType<CarWrap, PropsCar> = {
  properties: [
    {
      key: 'fuel_correction_rate',
      title: 'Поправочный коэффициент',
      type: 'number',
      float: 2,
    },
    {
      key: 'note',
      title: 'Примечание',
      type: 'string',
      maxLength: 4000,
    },
    {
      key: 'parking_address',
      title: 'Адрес стоянки',
      type: 'string',
      maxLength: 2000,
    },
    {
      key: 'company_structure_id',
      title: 'Подразделение',
      type: 'valueOfArray',
    },
  ],
  dependencies: {
    registration_data: [
      (value, formState, props) => validate(carRegistrationDataSchema, value, props),
    ],
    passport_data: [
      (value, formState, props) => {
        const type: CarPassporntData['type'] = get(value, 'type', null);

        if (type === 'GIBDD') {
          return validate(carPassportDataGibddSchema, value, props);
        }
        if (type === 'GTN') {
          return validate(carPassportDataGtnSchema, value, props);
        }

        return nonError;
      },
    ],
  },
};
