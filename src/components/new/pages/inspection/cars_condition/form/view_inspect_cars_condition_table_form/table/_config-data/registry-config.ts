// import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormDataSchema, carsConditionCarFormSchema } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/schema';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';

export const registryKey = 'InspectCarsConditionsCarsExtendedRegistry';

const {data, ...carsConditionCarFormSchemaDataLess } = carsConditionCarFormSchema.properties; // с бека приходит без даты

const renderFieldsSchema = { // Что бы не надо было менять в нескольких местах, используем схему из карточки ТС
  properties: {
    ...carsConditionCarFormDataSchema.properties,
    ...carsConditionCarFormSchemaDataLess,
  },
};

export const getConfig = (inspection_id: number ): TypeConfigData<CarsConditionCars & CarsConditionCars['data']> => ({
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
      renderFieldsSchema,
      groupColumn: {
        district: {
          label: 'Жилищник',
          isActive: false,
        },
        ts_data: {
          label: 'Данные о ТС',
          isActive: false,
        },
        add_info: {
          label: 'Доп. информация',
          isActive: false,
        },
        repair_info: {
          label: 'Ремонт',
          isActive: false,
        },
      },
      fields: [
        {
          key: 'gov_number',
          title: 'Гос.№',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'district',
            firstElem: true, // В группку не входит
          },
        },
        {
          key: 'enumerated',
          title: '№',
          groupOpt: {
            key: 'district',
          },
        },
        {
          key: 'okrug_name',
          title: 'Округ',
          width: 100,
          groupOpt: {
            key: 'district',
          },
        },
        {
          key: 'gby_district',
          title: 'Техника относится к ГБУ Жилищник района (согласно балансовой/забансовой справке)',
          width: 100,
          groupOpt: {
            key: 'district',
          },
        },
        {
          key: 'gby_operation_district',
          title: 'Техника эксплуатируется жилищником района',
          width: 100,
          groupOpt: {
            key: 'district',
          },
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
          groupOpt: {
            key: 'ts_data',
            firstElem: true, // В группку не входит
          },
        },
        {
          key: 'type',
          title: 'Тип ТС',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'season',
          title: 'Сезон',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'vin',
          title: 'VIN',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'vin_incorrect',
          title: 'Некорректный VIN',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'vin_by_hand',
          title: 'Корректный VIN',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'body_number',
          title: 'Заводской номер',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'body_number_incorrect',
          title: 'Некорректный заводской номер',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'body_number_by_hand',
          title: 'Корректный заводской номер',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'manufactured_at',
          title: 'Год выпуска',
          width: 200,
          renderParams: {
            type: 'number',
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'environmental_class',
          title: 'Экологический стандарт ТС',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'engine_type',
          title: 'Тип двигателя',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'max_weight',
          title: 'Разрешенная масса (кг)',
          width: 200,
          renderParams: {
            type: 'number',
            label: false,
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'origin_country',
          title: 'Страна изготовитель',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'classifier',
          title: 'Классификатор',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'kind',
          title: 'Вид техники',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'osago',
          title: 'Номер ОСАГО',
          width: 200,
          renderParams: {
            type: 'string',
            label: false,
          },
        },
        {
          key: 'osago_not_required',
          title: 'ОСАГО не требуется',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'osago_finished_at',
          title: 'Срок действия ОСАГО',
          width: 200,
          renderParams: {
            type: 'date',
          },
        },
        {
          key: 'diagnostic_card',
          title: '№ диагностической карты / талона ГТО',
          width: 200,
          renderParams: {
            type: 'string',
            label: false,
          },
        },
        {
          key: 'diagnostic_card_finished_at',
          title: 'Дата окончания действия ГТО',
          width: 200,
          renderParams: {
            type: 'date',
          },
          groupOpt: {
            key: 'add_info',
            firstElem: true, // В группку не входит
          },
        },
        {
          key: 'given_at',
          title: 'Дата регистрации',
          width: 200,
          renderParams: {
            type: 'date',
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'exploitation_date_start',
          title: 'Дата начала эксплуатации',
          width: 200,
          renderParams: {
            type: 'date',
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'tech_inspection_passed',
          title: 'Технический осмотр пройден',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          groupOpt: {
            key: 'add_info',
          },
          format: 'boolean',
        },
        {
          key: 'glonass_stationary',
          title: 'ГЛОНАСС стационарный',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'glonass_registered',
          title: 'ГЛОНАСС зарегистрирован',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'logo',
          title: 'Логотип',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'state_exploitation',
          title: 'Состояние эксплуатации',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'tech_condition',
          title: 'Техническое состояние',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'fact_status',
          title: 'Фактический статус ТС',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'status_at_check',
          title: 'Нахождение ТС на момент проверки',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'waybill_number',
          title: 'Выдан ПЛ номер',
          width: 200,
          renderParams: {
            type: 'number',
          },
        },
        {
          key: 'mission_numbers',
          title: 'Активное задание',
          width: 200,
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'not_passed_verification_glonass',
          title: 'Не пройдена проверка фактической работы техники с использованием ГЛОНАСС',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'reason_repair',
          title: 'Причина ремонта',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'mileage',
          title: 'Пробег на дату проведения проверки',
          width: 200,
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'motohours',
          title: 'Наработка м/ч на дату проведения проверки',
          width: 200,
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'last_tech_inspection_date',
          title: 'Дата прохождения последнего ТО шасси',
          width: 200,
          renderParams: {
            type: 'date',
          },
        },
        {
          key: 'last_inspection_equipment',
          title: 'Дата прохождения последнего ТО спецоборудования',
          width: 200,
          renderParams: {
            type: 'date',
          },
        },
        {
          key: 'odometr_fact',
          title: 'Пробег на дату проведения последнего ТО',
          width: 200,
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'motohours_fact',
          title: 'Наработка м/ч на дату проведения последнего ТО',
          width: 200,
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'untimely_maintenance',
          title: 'Несвоевременное проведение ТО',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'last_tm_repair_company',
          title: 'Кем проведено последнее ТО (организация)',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'repair_info',
            firstElem: true, // В группку не входит
          },
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
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'last_repair_company',
          title: 'Кем проведен последний ремонт (организация)',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'last_repair',
          title: 'Дата проведения последнего ремонта',
          width: 200,
          renderParams: {
            type: 'date',
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'repair_from_date',
          title: 'В ремонте с даты',
          width: 200,
          renderParams: {
            type: 'date',
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'repair_reason',
          title: 'Причина ремонта',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'repair_application',
          title: 'Заявка на ремонт',
          width: 200,
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'comments',
          title: 'Замечания',
          width: 200,
          renderParams: {
            type: 'text',
          },
        },
        {
          key: 'not_ready_to_work',
          title: 'Техника не готова к работе',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'act_readiness_not_issued',
          title: 'Акт готовности техники не оформлен',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
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
