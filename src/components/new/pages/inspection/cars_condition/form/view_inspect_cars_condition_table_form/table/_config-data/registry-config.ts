// import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';

export const registryKey = 'InspectCarsConditionsCarsExtendedRegistry';

export const getConfig = (inspection_id: number, ): TypeConfigData<CarsConditionCars & CarsConditionCars['data']> => ({
  Service: {
    getRegistryData: {
      entity: 'inspection/cars',
      payload: {
        inspection_id,
        view: "extended",
      },
    },
  },
  registryKey,
  header: {
    title: 'Форма заполнения',
    buttons: [
    ],
  },
  filter: {
    fields: [],
  },
  list: {
    permissions: inspectCarsConditionPermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'id', // @todo
    },
    meta: {
      row_double_click: false,
      is_render_field: true,
      fields: [
        {
          key: 'gov_number',
          title: 'Гос.№',
          width: 100,
          renderParams: {
            type: 'string',
            label: false,
            key: 'gov_number',
          },
        },
        {
          key: 'enumerated',
          title: '№',
        },
        // {
        //   key: 'gov_number',
        //   title: 'Округ', // Нету
        //   width: 100,
        // },
        {
          key: 'gby_district',
          title: 'Техника относится к ГБУ Жилищник района (согласно балансовой/забансовой справке)',
          width: 100,
        },
        {
          key: 'gby_operation_district',
          title: 'Техника эксплуатируется жилищником района',
          width: 100,
        },
        {
          key: 'marka',
          title: 'Марка',
          width: 100,
        },
        {
          key: 'model',
          title: 'Модель',
          width: 100,
        },
        {
          key: 'type',
          title: 'Тип ТС',
          width: 200,
        },
        {
          key: 'season',
          title: 'Сезон',
          width: 200,
        },
        {
          key: 'vin',
          title: 'VIN',
          width: 200,
        },
        {
          key: 'vin_incorrect',
          title: 'Некорректный VIN',
          width: 200,
          renderParams: {
            type: 'boolean',
            label: 'да',
            key: 'vin_incorrect',
          },
        },
        {
          key: 'vin_by_hand',
          title: 'Корректный VIN',
          width: 200,
        },
        {
          key: 'body_number',
          title: 'Заводской номер',
          width: 200,
        },
        {
          key: 'body_number_incorrect',
          title: 'Некорректный заводской номер',
          width: 200,
        },
        {
          key: 'body_number_by_hand',
          title: 'Корректный заводской номер',
          width: 200,
        },
        {
          key: 'manufactured_at',
          title: 'Год выпуска',
          width: 200,
        },
        {
          key: 'environmental_class',
          title: 'Экологический стандарт ТС',
          width: 200,
        },
        {
          key: 'engine_type',
          title: 'Тип двигателя',
          width: 200,
        },
        {
          key: 'max_weight',
          title: 'Разрешенная масса (кг)',
          width: 200,
        },
        {
          key: 'origin_country',
          title: 'Страна изготовитель',
          width: 200,
        },
        {
          key: 'classifier',
          title: 'Классификатор',
          width: 200,
        },
        {
          key: 'kind',
          title: 'Вид техники',
          width: 200,
        },
        {
          key: 'osago',
          title: 'Номер ОСАГО',
          width: 200,
        },
        {
          key: 'osago_not_required',
          title: 'ОСАГО не требуется',
          width: 200,
        },
        {
          key: 'osago_finished_at',
          title: 'Срок действия ОСАГО',
          width: 200,
        },
        {
          key: 'diagnostic_card',
          title: '№ диагностической карты / талона ГТО',
          width: 200,
        },
        {
          key: 'diagnostic_card_finished_at',
          title: 'Дата окончания действия ГТО',
          width: 200,
        },
        {
          key: 'given_at',
          title: 'Дата регистрации',
          width: 200,
        },
        {
          key: 'exploitation_date_start',
          title: 'Дата начала эксплуатации',
          width: 200,
        },
        {
          key: 'tech_inspection_passed',
          title: 'Технический осмотр пройден',
          width: 200,
        },
        {
          key: 'glonass_stationary',
          title: 'ГЛОНАСС стационарный',
          width: 200,
        },
        {
          key: 'glonass_registered',
          title: 'ГЛОНАСС зарегистрирован',
          width: 200,
        },
        {
          key: 'logo',
          title: 'Логотип',
          width: 200,
        },
        {
          key: 'state_exploitation',
          title: 'Состояние эксплуатации',
          width: 200,
        },
        {
          key: 'tech_condition',
          title: 'Техническое состояние',
          width: 200,
        },
        {
          key: 'fact_status',
          title: 'Фактический статус ТС',
          width: 200,
        },
        {
          key: 'status_at_check',
          title: 'Нахождение ТС на момент проверки',
          width: 200,
        },
        {
          key: 'waybill_number',
          title: 'Выдан ПЛ номер',
          width: 200,
        },
        {
          key: 'mission_numbers',
          title: 'Активное задание',
          width: 200,
        },
        {
          key: 'not_passed_verification_glonass',
          title: 'Не пройдена проверка фактической работы техники с использованием ГЛОНАСС',
          width: 200,
        },
        {
          key: 'reason_repair',
          title: 'Причина ремонта',
          width: 200,
        },
        {
          key: 'mileage',
          title: 'Пробег на дату проведения проверки',
          width: 200,
        },
        {
          key: 'motohours',
          title: 'Наработка м/ч на дату проведения проверки',
          width: 200,
        },
        {
          key: 'last_tech_inspection_date',
          title: 'Дата прохождения последнего ТО шасси',
          width: 200,
        },
        {
          key: 'last_inspection_equipment',
          title: 'Дата прохождения последнего ТО спецоборудования',
          width: 200,
        },
        {
          key: 'odometr_fact',
          title: 'Пробег на дату проведения последнего ТО',
          width: 200,
        },
        {
          key: 'motohours_fact',
          title: 'Наработка м/ч на дату проведения последнего ТО',
          width: 200,
        },
        {
          key: 'untimely_maintenance',
          title: 'Несвоевременное проведение ТО',
          width: 200,
        },
        {
          key: 'last_tm_repair_company',
          title: 'Кем проведено последнее ТО (организация)',
          width: 200,
        },
        // {
        //   key: 'comments', // нет такого атрибута
        //   title: 'Замечания по ТО',
        //   width: 200,
        // },
        {
          key: 'kind_purchase',
          title: 'Вид приобретения',
          width: 200,
        },
        {
          key: 'last_repair_company',
          title: 'Кем проведен последний ремонт (организация)',
          width: 200,
        },
        {
          key: 'last_repair',
          title: 'Дата проведения последнего ремонта',
          width: 200,
        },
        {
          key: 'repair_from_date',
          title: 'В ремонте с даты',
          width: 200,
        },
        {
          key: 'repair_reason',
          title: 'Причина ремонта',
          width: 200,
        },
        {
          key: 'repair_application',
          title: 'Заявка на ремонт',
          width: 200,
        },
        {
          key: 'comments',
          title: 'Замечания',
          width: 200,
        },
        {
          key: 'not_ready_to_work',
          title: 'Техника не готова к работе',
          width: 200,
        },
        {
          key: 'act_readiness_not_issued',
          title: 'Акт готовности техники не оформлен',
          width: 200,
        },
      ],
    },
    processed: {
      sort: {
        field: 'was_resaved',
      },
    },
  },
});
