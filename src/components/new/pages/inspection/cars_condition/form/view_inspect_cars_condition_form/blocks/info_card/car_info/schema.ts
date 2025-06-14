import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { BlockCarInfoProps } from './@types/BlockCarInfo';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';
import { getRequiredFieldNumberMoreThenZero, getRequiredFieldNumberMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';

const isNewRow = (formState) => {
  return Boolean(get(formState, 'isNewRow', null));
};
const isCustomUserCard = (formState) => {
  return Boolean(get(formState, 'car_id', null));
};

export const carsConditionCarFormDataSchema: SchemaType<CarsConditionCars['data'], BlockCarInfoProps> = {
  properties: {
    tech_inspection_passed: {
      type: 'valueOfArray',
      title: 'Технический осмотр пройден',
      required: true,
    },
    glonass_stationary: {
      type: 'valueOfArray',
      title: 'ГЛОНАСС стационарный',
      required: true,
    },
    glonass_registered: {
      type: 'valueOfArray',
      title: 'ГЛОНАСС зарегистрирован',
      required: true,
    },
    tech_condition: {
      type: 'valueOfArray',
      title: 'Техническое состояние',
      required: true,
    },
    logo: {
      type: 'valueOfArray',
      title: 'Логотип',
      required: true,
    },
    comments: {
      type: 'string',
      title: 'Замечания',
    },
  },
};

export const carsConditionCarFormSchema: SchemaType<CarsConditionCars, BlockCarInfoProps> = {
  properties: {
    gov_number: {
      type: 'string',
      title: 'Гос. номер',
      maxLength: 9,
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
      dependencies: [
        (_, formState) => {
          if ((isNewRow(formState) || !get(formState, 'id', null) || !isCustomUserCard(formState) ) && !get(formState, 'gov_number', null)) {
            return 'Поле "Гос. номер" должно быть заполнено';
          }
        },
      ],
    },
    marka: {
      type: 'valueOfArray',
      title: 'Марка',
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
      dependencies: [
        (_, formState) => {
          if ((isNewRow(formState) || !get(formState, 'id', null) || !isCustomUserCard(formState)) && !get(formState, 'marka', null)) {
            return 'Поле "Марка" должно быть заполнено';
          }
        },
      ],
    },
    model: {
      type: 'valueOfArray',
      title: 'Модель',
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
      dependencies: [
        (_, formState) => {
          if ((isNewRow(formState) || !get(formState, 'id', null) || !isCustomUserCard(formState)) && !get(formState, 'model', null)) {
            return 'Поле "Модель" должно быть заполнено';
          }
        },
      ],
    },
    type: {
      type: 'valueOfArray',
      title: 'Тип ТС',
      required: true,
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
      dependencies: [
        (value, formState) => {
          if (!get(formState, 'type') && (isNewRow(formState) || !isCustomUserCard(formState)) && !value) {
            return 'Поле "Тип ТС" должно быть заполнено';
          }
        },
      ],
    },
    environmental_class: {
      type: 'valueOfArray',
      title: 'Экологический стандарт ТС',
      required: true,
    },
    engine_type: {
      type: 'valueOfArray',
      title: 'Тип двигателя',
      required: true,
    },
    kind: {
      type: 'valueOfArray',
      title: 'Вид техники',
      required: true,
    },
    kind_purchase: {
      type: 'valueOfArray',
      title: 'Вид приобретения',
      required: true,
    },
    origin_country: {
      type: 'valueOfArray',
      title: 'Страна изготовитель',
      required: true,
    },
    max_weight: {
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
      minNotEqual: 0,
      required: true,
    },
    vin: {
      type: 'string',
      title: 'VIN',
      maxLength: 17,
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState)) {
            return true;
          }
        },
      ],
    },
    gby_district: {
      type: 'string',
      title: 'Владелец техники',
      required: true,
    },
    gby_operation_district: {
      type: 'string',
      title: 'Подрядчик',
      required: true,
    },
    vin_incorrect: {
      type: 'boolean',
      title: 'Некорректный VIN:',
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && !isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
    },
    vin_by_hand: {
      type: 'string',
      title: 'VIN (ручной ввод)',
      maxLength: 17,
      dependenciesDisable: [
        (_, formState) => {
          if (!get(formState, 'vin_incorrect', null) && (!isNewRow(formState) && isCustomUserCard(formState)) ) {
            return true;
          }
          return false;
        },
      ],
    },
    factory_number: {
      type: 'string',
      title: 'Заводской номер (из системы)',
      maxLength: 128,
      dependenciesDisable: [
        () => {
          return true;
          // if (!isNewRow(formState) && !isCustomUserCard(formState)) {
          //   return true;
          // }
        },
      ],
    },
    factory_number_incorrect: {
      type: 'boolean',
      title: 'Некорректный заводской номер:',
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && !isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
    },
    factory_number_by_hand: {
      type: 'string',
      title: 'Заводской номер (ручной ввод)',
      maxLength: 128,
      dependenciesDisable: [
        (_, formState) => {
          if (!get(formState, 'factory_number_incorrect', null) && (!isNewRow(formState) && isCustomUserCard(formState))) {
            return true;
          }
        },
      ],
    },
    on_base: {
      type: 'boolean',
      title: 'ТС находится на базе',
      dependenciesDisable: [
        (_, formState) => {
          if (get(formState, 'status_at_check', null) !== 'on_line') {
            return true;
          }
        },
      ],
    },
    manufactured_at: {
      type: 'number',
      title: 'Год выпуска',
      maxLength: 4,
      integer: true,
      minNotEqual: -1,
      required: true,
      dependencies: [
        (value, {dataForValidation}) => {
          const current_year = new Date(dataForValidation?.current_date_timestamp).getFullYear();
          if (
            value
            && current_year
            && +value > +current_year
          ) {
            return 'Год выпуска не может быть больше текущего';
          }
        }
      ]
    },
    registration_date: {
      type: 'date',
      title: 'Дата регистрации',
      dependencies: [
        (value, { manufactured_at }) => {
          const regYear = new Date(value).getFullYear();
          if (+regYear < +manufactured_at) {
            return 'Год регистрации не может быть меньше года выпуска';
          }
        }
      ]
    },
    exploitation_date_start: {
      type: 'date',
      title: 'Дата начала эксплуатации',
      required: true,
      dependencies: [
        (value, { manufactured_at, registration_date }) => {
          const exploitStartYear = new Date(value).getFullYear();
          if (
            (manufactured_at && +exploitStartYear < +manufactured_at)
            || (registration_date && diffDates(createValidDate(value), createValidDate(registration_date)) < 0)
          ) {
            return 'Дата начала эксплуатации не может быть меньше года выпуска или даты регистрации';
          }
        }
      ]
    },
    odometr_fact: {
      type: 'number',
      title: 'Пробег на дату проведения последнего ТО',
      required: false,
      dependencies: [
        (value) => {
          if (value < 0) {
            return 'Поле "Пробег на дату проведения последнего ТО" должно быть неотрицательным числом';
          }
          if (value && isNaN(value)) {
            return getRequiredFieldNumberMessage('Пробег на дату проведения последнего ТО');
          }
        }
      ],
    },
    motohours_fact: {
      type: 'number',
      title: 'Наработка м/ч на дату проведения последнего ТО',
      required: false,
      dependencies: [
        (value) => {
          if (value < 0) {
            return getRequiredFieldNumberMoreThenZero('Наработка м/ч на дату проведения последнего ТО');
          }
        }
      ],
    },
    osago: {
      type: 'string',
      title: 'Номер ОСАГО',
      dependencies: [
        (value, formState) => {
          const osagoNotRequired = !get(formState, 'data.osago_not_required', null) && !get(formState, 'osago_not_required', null);
          const noValidOsago = get(formState, 'data.no_valid_osago', null) || get(formState, 'no_valid_osago', null);
          if ((osagoNotRequired && !noValidOsago) && !value) {
            return 'Поле "Номер ОСАГО" должно быть заполнено';
          }
          if (noValidOsago) {
            return 'Вы отметили, что у ТС отсутствует действующий полис ОСАГО. Необходимо сверить данные полиса ОСАГО';
          }
        },
      ],
      dependenciesDisable: [
        (_, formState) => {
          if (get(formState, 'osago_not_required', null)) {
            return true;
          }
        },
      ],
    },
    osago_finished_at: {
      type: 'date',
      title: 'Действует до',
      dependencies: [
        (value, formState) => {
          const osagoNotRequired = !get(formState, 'data.osago_not_required', null) && !get(formState, 'osago_not_required', null);
          const noValidOsago = get(formState, 'data.no_valid_osago', null) || get(formState, 'no_valid_osago', null);
          if ((osagoNotRequired && !noValidOsago) && !value) {
            return 'Поле "Действует до" должно быть заполнено';
          }
        },
      ],
      dependenciesDisable: [
        (_, formState) => {
          if (get(formState, 'osago_not_required', null)) {
            return true;
          }
        },
      ],
    },
    diagnostic_card: {
      type: 'string',
      title: 'Номер диагностической карты',
      maxLength: 20,
      dependencies: [
        (value, formState) => {
          const techInspectionNotRequired = !get(formState, 'data.tech_inspection_not_required', null) && !get(formState, 'tech_inspection_not_required', null);
          if (techInspectionNotRequired && !value) {
            return 'Поле "Номер диагностической карты" должно быть заполнено';
          }
        },
      ],
      dependenciesDisable: [
        (_, formState) => {
          if (get(formState, 'tech_inspection_not_required', null)) {
            return true;
          }
        },
      ],
    },
    diagnostic_card_finished_at: {
      type: 'date',
      title: 'Действует до',
      dependencies: [
        (value, formState) => {
          const techInspectionNotRequired = !get(formState, 'data.tech_inspection_not_required', null) && !get(formState, 'tech_inspection_not_required', null);
          if (techInspectionNotRequired && !value) {
            return 'Поле "Действует до" должно быть заполнено';
          }
        },
      ],
      dependenciesDisable: [
        (_, formState) => {
          if (get(formState, 'tech_inspection_not_required', null)) {
            return true;
          }
        },
      ],
    },
    last_tech_inspection_date: {
      type: 'date',
      title: 'Дата прохождения последнего ТО шасси',
      dependencies: [
        (value, {dataForValidation, manufactured_at}) => {
          const date = createValidDate(value);
          const year = new Date(value).getFullYear();
          const current_date = createValidDate(new Date(dataForValidation?.current_date_timestamp));
          if (value && current_date && diffDates(date, current_date) > 0) {
            return 'Дата последнего ТО не может быть больше текущей';
          }
          if (value && +year < +manufactured_at) {
            return 'Дата прохождения последнего ТО не может быть раньше года выпуска ТС';
          }
        }
      ]
    },
    last_inspection_equipment: {
      type: 'date',
      title: 'Дата прохождения последнего ТО спецоборудования',
      dependencies: [
        (value, {dataForValidation, manufactured_at}) => {
          const date = createValidDate(value);
          const year = new Date(value).getFullYear();
          const current_date = createValidDate(new Date(dataForValidation?.current_date_timestamp));
          if (value && current_date && diffDates(date, current_date) > 0) {
            return 'Дата последнего ТО не может быть больше текущей';
          }
          if (value && +year < +manufactured_at) {
            return 'Дата прохождения последнего ТО не может быть раньше года выпуска ТС';
          }
        }
      ]
    },
    last_repair_date: {
      type: 'date',
      title: 'Дата проведения последнего ремонта',
      dependencies: [
        (value, {dataForValidation, manufactured_at}) => {
          const date = createValidDate(value);
          const year = new Date(value).getFullYear();
          const current_date = createValidDate(new Date(dataForValidation?.current_date_timestamp));
          if (value && current_date && diffDates(date, current_date) > 0) {
            return 'Дата последнего ремонта не может быть больше текущей';
          }
          if (value && +year < +manufactured_at) {
            return 'Дата прохождения последнего ремонта не может быть раньше года выпуска ТС';
          }
        }
      ]
    },
    mileage: {
      type: 'number',
      title: 'Пробег на дату проведения проверки',
      dependencies: [
        (value) => {
          if (value < 0) {
            return 'Поле "Пробег на дату проведения проверки" должно быть неотрицательным числом';
          }
          if (value && isNaN(value)) {
            return getRequiredFieldNumberMessage('Пробег на дату проведения проверки');
          }
        }
      ],
    },
    motohours: {
      type: 'number',
      title: 'Наработка м/ч на дату проверки',
      dependencies: [
        (value) => {
          if (value < 0) {
            return 'Поле "Наработка м/ч на дату проверки" должно быть неотрицательным числом';
          }
          if (value && isNaN(value)) {
            return getRequiredFieldNumberMessage('Наработка м/ч на дату проверки');
          }
        }
      ],
    },
    fact_status: {
      type: 'valueOfArray',
      title: 'Фактический статус ТС',
      required: true,
    },
    repair_from_date: {
      type: 'date',
      title: 'В ремонте с даты',
      dependencies: [
        (value, {dataForValidation, manufactured_at}) => {
          const date = createValidDate(value);
          const year = new Date(value).getFullYear();
          const current_date = createValidDate(new Date(dataForValidation?.current_date_timestamp));
          if (value && current_date && diffDates(date, current_date) > 0) {
            return 'Дата начала ремонта не может быть больше текущей';
          }
          if (value && +year < +manufactured_at) {
            return 'Дата начала ремонта не может быть раньше года выпуска';
          }
        }
      ]
    },
    status_at_check: {
      type: 'valueOfArray',
      title: 'Нахождение ТС на момент проверки',
      required: true,
    },
    state_exploitation: {
      type: 'valueOfArray',
      title: 'Состояние эксплуатации',
      required: true,
    },
    season: {
      type: 'valueOfArray',
      title: 'Сезон',
      dependenciesDisable: [
        (_, formState) => {
          if (!isNewRow(formState) && isCustomUserCard(formState)) {
            return true;
          }
        },
      ],
      dependencies: [
        (value, formState) => {
          // if (!get(formState, 'type') && (isNewRow(formState) || !isCustomUserCard(formState)) && !value) {
          if ((isNewRow(formState) || !isCustomUserCard(formState)) && !value) {
            return 'Поле "Сезон" должно быть заполнено';
          }
        },
      ],
    },
    data: {
      type: 'schema',
      schema: carsConditionCarFormDataSchema,
    },
  },
};
