import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsCar, CarWrap } from './@types/CarForm';

export const carRegistrationDataSchema: SchemaType<CarWrap['registration_data'], PropsCar> = {
  properties: {
    certificate_number: {
      title: 'Серия и номер свидетельства о регистрации',
      type: 'string',
      dependencies: [
        (value, { passport_data_type }, _, carInfo) => {
          const errorText = 'Недопустимое значение серии и номера свидетельства о регистрации. Данные не будут сохранены';
          if(value) {
            if (passport_data_type === 'GIBDD' && carInfo.is_gibdd_passport) { 
              const stsRegExp = /^[АВЕКМНОРСТУХ\d]{10}$/;
              return stsRegExp.exec(value) ? '' : errorText;
            }
            if(/[^\dАВЕКМНОРСТУХ]/.exec(value)) {
              return errorText;
            }
            if(passport_data_type === 'GTN' && carInfo.is_gtn_passport) {
              const srmRegExp = /^[АВЕКМНОРСТУХ\d]{8}$/;
              return srmRegExp.exec(value) ? '' : errorText;
            }
          }
          return '';
        },
      ],
    },
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

export const carDriversDataSchema: SchemaType<CarWrap['drivers_data'], PropsCar, CarWrap> = {
  properties: {
    primary_drivers: {
      title: 'Основной водитель/машинист',
      type: 'valueOfArray',
      dependencies: [
        (value, _, __, { employee_data, asuods_id }) => {
          const filteredCarsList = employee_data.data.filter((el) => el.prefer_car && el.prefer_car !== asuods_id);
          let employeeOnCar = null;
          for (let i = 0; i <= value.length - 1; i++) {
            employeeOnCar = filteredCarsList.find((el) => el.id === value[i]);
            if (employeeOnCar) {
              break;
            }
          }
          const errorText = !employeeOnCar
            ? ''
            : `Сотрудник ${employeeOnCar.full_name} указан как основной водитель/машинист у ТС ${employeeOnCar.prefer_car_text}. Рекомендуем убрать привязку к ТС ${employeeOnCar.prefer_car_text} или указать водителя/машиниста в качестве вторичного водителя.`;

          return errorText;
        },
      ],
    }
  },
};

const carPassportDataSchema: SchemaType<any, PropsCar> = {
  properties: {
    // ___GIBDD___
    seria_number: {
      validateIf: {
        type: 'fixed_length',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Серия и номер паспорта',
      type: 'string',
      fixedLengthCollection: [10, 15],
    },
    vin: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'VIN (Идентификационный номер)',
      type: 'string',
      maxLength: 17,
    },
    category_id: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Категория транспортного средства',
      type: 'valueOfArray',
    },
    func_type_name: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Тип транспортного средства',
      type: 'string',
      maxLength: 200,
    },
    engine_model: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Модель двигателя',
      type: 'string',
      maxLength: 128,
    },
    engine_volumne: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Рабочий объем двигателя',
      type: 'number',
      float: 2,
    },
    engine_type_id: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Тип двигателя',
      type: 'valueOfArray',
    },
    chassis: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Шасси (рама)',
      type: 'string',
      maxLength: 128,
    },
    max_weight: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
    },
    environmental_class: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Экологический класс',
      type: 'string',
    },
    origin_country_id: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Страна-изготовитель',
      type: 'valueOfArray',
    },
    exporter_country_id: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Страна вывоза автомобиля',
      type: 'valueOfArray',
    },
    customs_declaration: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Серия и номер таможенной декларации',
      type: 'string',
      maxLength: 128,
    },
    customs_restrictions: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Таможенные ограничения',
      type: 'string',
      maxLength: 128,
    },
    given_at: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Дата выдачи ПТС',
      type: 'date',
    },
    company_address: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GIBDD',
      },
      title: 'Адрес организации, выдавшей ПТС',
      type: 'string',
      maxLength: 256,
    },
    // ___COMMION___
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
      title: 'Масса, кг',
      type: 'number',
      float: 2,
    },
    body_number: {
      title: 'Заводской номер машины (рамы)',
      type: 'string',
      maxLength: 128,
    },
    // ___GTB___
    number: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Серия и номер паспорта',
      type: 'string',
      maxLength: 128,
    },
    manufacturer: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Предприятие и изготовитель',
      type: 'string',
      maxLength: 256,
    },
    given_by: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Выдан',
      type: 'string',
      maxLength: 256,
    },
    conformity_certificate: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Сертификат соответствия',
      type: 'string',
      maxLength: 256,
    },
    tech_inspection_certificate: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Акт гостехосмотра',
      type: 'string',
      maxLength: 256,
    },
    gearbox: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Коробка передач',
      type: 'string',
      maxLength: 128,
    },
    axle_number: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Номер основного ведущего моста',
      type: 'string',
      maxLength: 128,
    },
    propulsion_type_id: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Тип движителя',
      type: 'valueOfArray',
    },
    max_speed: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Максимальная конструктивная скорость, км/ч',
      type: 'number',
      float: 2,
    },
    dimensions: {
      validateIf: {
        type: 'equal_to_value',
        path: 'passport_data.type',
        value: 'GTN',
      },
      title: 'Габаритные размеры, мм',
      type: 'string',
      maxLength: 128,
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
      title: 'Комментарий',
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
    drivers_data: {
      type: 'schema',
      schema: carDriversDataSchema,
    },
    exploitation_date_start: {
      type: 'date',
      title: 'Дата ввода ТС в эксплуатацию',
    },
    passport_data: {
      type: 'schema',
      schema: carPassportDataSchema,
    },
    operating_mode: {
      title: 'Режим работы',
      type: 'string',
      maxLength: 100,
    }
  },
};
