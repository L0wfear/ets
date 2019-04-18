import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsCar, CarWrap } from './@types/CarForm';
import { validate } from 'components/ui/form/new/validate';
import { get } from 'lodash';
import { CarPassporntData, CarGibddPasspost, CarGtnPasspost } from 'redux-main/reducers/modules/autobase/car/@types';

const nonError = {};

export const carPassportDataGibddSchema: SchemaType<CarGibddPasspost, PropsCar> = {
  properties: {
    seria_number: {
      title: 'Серия и номер паспорта',
      type: 'string',
      minLength: 10,
      maxLength: 10,
      trimSpace: true,
    },
    address: {
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    manufactured_at: {
      title: 'Год выпуска',
      type: 'valueOfArray',
    },
    engine_number: {
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    vin: {
      title: 'VIN (Идентификационный номер)',
      type: 'string',
      maxLength: 17,
    },
    category_id: {
      title: 'Категория транспортного средства',
      type: 'valueOfArray',
    },
    func_type_id: {
      title: 'Тип транспортного средства',
      type: 'valueOfArray',
    },
    body_number: {
      title: 'Кузов (номер)',
      type: 'string',
      maxLength: 128,
    },
    body_color: {
      title: 'Цвет кузова',
      type: 'string',
      maxLength: 128,
    },
    engine_model: {
      title: 'Модель двигателя',
      type: 'string',
      maxLength: 128,
    },
    engine_power: {
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    engine_volumne: {
      title: 'Рабочий объем двигателя',
      type: 'number',
      float: 2,
    },
    engine_type_id: {
      title: 'Тип двигателя',
      type: 'valueOfArray',
    },
    chassis: {
      title: 'Шасси (рама)',
      type: 'string',
      maxLength: 128,
    },
    empty_weight: {
      title: 'Масса без нагрузки, кг',
      type: 'number',
      float: 2,
    },
    max_weight: {
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
    },
    environmental_class: {
      title: 'Экологический класс',
      type: 'string',
    },
    origin_country_id: {
      title: 'Страна-изготовитель',
      type: 'valueOfArray',
    },
    exporter_country_id: {
      title: 'Страна вывоза автомобиля',
      type: 'valueOfArray',
    },
    customs_declaration: {
      title: 'Серия и номер таможенной декларации',
      type: 'string',
      maxLength: 128,
    },
    customs_restrictions: {
      title: 'Таможенные ограничения',
      type: 'string',
      maxLength: 128,
    },
    given_at: {
      title: 'Дата выдачи ПТС',
      type: 'date',
    },
    company_address: {
      title: 'Адрес организации, выдавшей ПТС',
      type: 'string',
      maxLength: 256,
    },
  },
};
export const carPassportDataGtnSchema: SchemaType<CarGtnPasspost, PropsCar> = {
  properties: {
    address: {
      title: 'Адрес',
      type: 'string',
      maxLength: 256,
    },
    manufactured_at: {
      title: 'Год выпуска',
      type: 'valueOfArray',
    },
    engine_number: {
      title: 'Двигатель (номер)',
      type: 'string',
      maxLength: 128,
    },
    number: {
      title: 'Серия и номер паспорта',
      type: 'string',
      maxLength: 128,
    },
    manufacturer: {
      title: 'Предприятие и изготовитель',
      type: 'string',
      maxLength: 256,
    },
    given_by: {
      title: 'Выдан',
      type: 'string',
      maxLength: 256,
    },
    conformity_certificate: {
      title: 'Сертификат соответствия',
      type: 'string',
      maxLength: 256,
    },
    tech_inspection_certificate: {
      title: 'Акт гостехосмотра',
      type: 'string',
      maxLength: 256,
    },
    engine_power: {
      title: 'Мощность двигателя',
      type: 'number',
      float: 2,
    },
    body_color: {
      title: 'Цвет',
      type: 'string',
      maxLength: 128,
    },
    empty_weight: {
      title: 'Конструкционная масса, кг',
      type: 'number',
      float: 2,
    },
    body_number: {
      title: 'Заводской номер машины (рамы)',
      type: 'string',
      maxLength: 128,
    },
    gearbox: {
      title: 'Коробка передач',
      type: 'string',
      maxLength: 128,
    },
    axle_number: {
      title: 'Номер основного ведущего моста',
      type: 'string',
      maxLength: 128,
    },
    propulsion_type_id: {
      title: 'Тип движителя',
      type: 'valueOfArray',
    },
    max_speed: {
      title: 'Максимальная конструктивная скорость, км/ч',
      type: 'number',
      float: 2,
    },
    dimensions: {
      title: 'Габаритные размеры, мм',
      type: 'string',
      maxLength: 128,
    },
  },
};

export const carRegistrationDataSchema: SchemaType<CarWrap['registration_data'], PropsCar> = {
  properties: {
    given_by: {
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 256,
    },
    given_at: {
      title: 'Дата регистрации',
      type: 'date',
    },
    note: {
      title: 'Особые отметки',
      type: 'string',
      maxLength: 4000,
    },
  },
};

export const carFormSchema: SchemaType<CarWrap, PropsCar> = {
  properties: {
    fuel_correction_rate: {
      title: 'Поправочный коэффициент',
      type: 'number',
      float: 2,
    },
    note: {
      title: 'Примечание',
      type: 'string',
      maxLength: 4000,
    },
    parking_address: {
      title: 'Адрес стоянки',
      type: 'string',
      maxLength: 2000,
    },
    company_structure_id: {
      title: 'Подразделение',
      type: 'valueOfArray',
    },
    registration_data: {
      type: 'schema',
      schema: carRegistrationDataSchema,
    },
    exploitation_date_start: {
      type: 'date',
      title: 'Дата ввода ТС в эксплуатацию',
    },
  },
  dependencies: {
    passport_data: [
      (value, formState, props) => {
        const type: CarPassporntData['type'] = get(value, 'type', null);

        if (type === 'GIBDD') {
          return validate(carPassportDataGibddSchema, value, props, formState);
        }
        if (type === 'GTN') {
          return validate(carPassportDataGtnSchema, value, props, formState);
        }

        return nonError;
      },
    ],
  },
};
