import { FiledToCheck } from 'components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const filedToCheckDefectDataOuter: FiledToCheck<CarsConditionCars['data']> = [
  {
    key: 'defects_body',
    title: 'Дефекты кузова',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'defects_chassis',
    title: 'Дефекты шасси',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'defects_attachments',
    title: 'Дефекты навесных агрегатов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'incomplete_equipment',
    title: 'Неполная комлектность техники',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'liquids_leak',
    title: 'Обнаружена течь масла/тех. жидкостей',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
];

export const filedToCheckDefectDataFirstStart: FiledToCheck<CarsConditionCars['data']> = [
  {
    key: 'does_not_start',
    title: 'ТС не запускается',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_chassis',
    title: 'Нарушена работоспособность шасси',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_attachments',
    title: 'Неисправность навесных агрегатов',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_lighting',
    title: 'Нарушена работоспособность освещения',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_lighting_alarm',
    title: 'Световая сигнализация в нерабочем состоянии',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_audible_alarm',
    title: 'Звуковая сигнализация в нерабочем состоянии',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_windscreen_wipers',
    title: 'Не работают стеклоочистители',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'broken_windscreen_washers',
    title: 'Не работают омыватели ветрового стекла',
    type: 'boolean',
    sub: 20,
    hidden: 'does_not_start',
    className: 'checkbox-input flex-reverse',
  },
];

export const filedToCheckDefectDataDocs: FiledToCheck<CarsConditionCars['data']> = [
  {
    key: 'no_registration',
    title: 'Отсутствие свидетельства о регистрации ТС',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'owner_not_match',
    title: 'Данные владельца (на кого зарегистрирована техника) и учреждения не совпадают с реальными данными',
    type: 'boolean',
    sub: 20,
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'no_vin',
    title: 'Отсутствие таблички с VIN / заводским номером',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'registration_not_match_vin',
    title: 'Данные свидетельства о регистрации ТС не совпадают с данными на табличке с VIN / заводским номером',
    type: 'boolean',
    sub: 20,
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'no_valid_diagnostic_card',
    title: 'Отсутствие действующего талона ГТО / копии диагностической карты',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'no_valid_osago',
    title: 'Отсутствие действующего полиса ОСАГО',
    type: 'boolean',
    sub: 20,
    hidden: 'osago_not_required',
    className: 'checkbox-input flex-reverse',
  },
];

export const filedToCheckDefectDataOtherFirst: FiledToCheck<CarsConditionCars['data']> = [
  {
    key: 'untimely_maintenance',
    title: 'Несвоевременное проведение ТО',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
];

export const filedToCheckDefectDataOtherSecond: FiledToCheck<CarsConditionCars['data']> = [
  {
    key: 'not_ready_to_work',
    title: 'Техника не готова к работе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'act_readiness_not_issued',
    title: 'Акт готовности техники не оформлен',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  // {
  //   key: 'comments',
  //   title: 'Замечания',
  //   type: 'text',
  //   className: 'checkbox-input flex-reverse',
  // },
];
