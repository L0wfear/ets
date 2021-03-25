import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormDataSchema, carsConditionCarFormSchema } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/schema';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { actionUpdateCarsConditionsCar, actionCreateCarsConditionsCar } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

export const registryKey = 'InspectCarsConditionsCarsExtendedRegistry';

const {data, ...carsConditionCarFormSchemaDataLess } = carsConditionCarFormSchema.properties; // с бека приходит без даты

const renderFieldsSchema = { // Что бы не надо было менять в нескольких местах, используем схему из карточки ТС
  properties: {
    ...carsConditionCarFormDataSchema.properties,
    ...carsConditionCarFormSchemaDataLess,
  },
};

export const getConfig = (inspection_id: number): TypeConfigData<CarsConditionCars & CarsConditionCars['data']> => ({
  Service: {
    getRegistryData: {
      entity: 'inspection/cars',
      payload: {
        inspection_id,
        view: 'extended',
      },
      format: 'cars_condition_extended',
    },
    getBlobData: {
      entity: 'inspection/cars/export',
      payload: {
        format: 'xls',
      }
    }
  },
  registryKey,
  header: {
    title: 'Форма заполнения',
    buttons: [
      // buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.show_сars_condition_table_defects,
      // buttonsTypes.ButtonAddNewRowTable,
      buttonsTypes.export_filtred_data,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'gov_number',
        type: 'multiselect',
        title: 'Гос.номер',
      },
      {
        valueKey: 'okrug_name',
        type: 'multiselect',
        title: 'Округ',
      },
      {
        valueKey: 'gby_district',
        type: 'multiselect',
        title: 'Владелец техники',
      },
      {
        valueKey: 'gby_operation_district',
        type: 'multiselect',
        title: 'Подрядчик',
      },
      {
        valueKey: 'marka',
        type: 'multiselect',
        title: 'Марка',
      },
      {
        valueKey: 'model',
        type: 'multiselect',
        title: 'Модель',
      },
      {
        valueKey: 'type',
        type: 'multiselect',
        title: 'Тип ТС',
      },
      {
        valueKey: 'season',
        type: 'multiselect',
        title: 'Сезон',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'vin',
        type: 'multiselect',
        title: 'VIN (из системы)',
      },
      {
        valueKey: 'vin_by_hand',
        type: 'multiselect',
        title: 'VIN (ручной ввод)',
      },
      {
        valueKey: 'factory_number',
        type: 'multiselect',
        title: 'Заводской номер (из системы)',
      },
      {
        valueKey: 'factory_number_by_hand',
        type: 'multiselect',
        title: 'Заводской номер (ручной ввод)',
      },
      {
        valueKey: 'manufactured_at',
        type: 'advanced-date',
        title: 'Год выпуска',
      },
      {
        valueKey: 'environmental_class',
        type: 'multiselect',
        title: 'Экологический стандарт ТС',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'engine_type',
        type: 'multiselect',
        title: 'Тип двигателя',
      },
      {
        valueKey: 'max_weight',
        type: 'multiselect',
        title: 'Разрешенная масса (кг)',
      },
      {
        valueKey: 'origin_country',
        type: 'multiselect',
        title: 'Страна-производитель',
      },
      {
        valueKey: 'classifier',
        type: 'multiselect',
        title: 'Классификатор',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'kind',
        type: 'multiselect',
        title: 'Вид техники',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'kind_purchase',
        type: 'multiselect',
        title: 'Вид приобретения',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'osago',
        type: 'multiselect',
        title: 'Номер ОСАГО',
      },
      {
        valueKey: 'osago_finished_at',
        type: 'advanced-date',
        title: 'ОСАГО. Действует до',
      },
      {
        valueKey: 'osago_not_required',
        type: 'multiselect',
        title: 'ОСАГО не требуется',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'diagnostic_card',
        type: 'multiselect',
        title: 'Номер диагностической карты',
      },
      {
        valueKey: 'diagnostic_card_finished_at',
        type: 'advanced-date',
        title: 'Диагностическая карта. Действует до',
      },
      {
        valueKey: 'tech_inspection_not_required',
        type: 'multiselect',
        title: 'Прохождение ТО/ГТО не требуется',
      },
      {
        valueKey: 'registration_date',
        type: 'advanced-date',
        title: 'Дата регистрации',
      },
      {
        valueKey: 'exploitation_date_start',
        type: 'advanced-date',
        title: 'Дата начала эксплуатации',
      },
      {
        valueKey: 'tech_inspection_passed',
        type: 'multiselect',
        title: 'Технический осмотр пройден',
      },
      {
        valueKey: 'glonass_stationary',
        type: 'multiselect',
        title: 'ГЛОНАСС стационарный',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'glonass_registered',
        type: 'multiselect',
        title: 'ГЛОНАСС зарегистрирован',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'logo',
        type: 'multiselect',
        title: 'Логотип',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'state_exploitation',
        type: 'multiselect',
        title: 'Состояние эксплуатации',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'tech_condition',
        type: 'multiselect',
        title: 'Техническое состояние',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'fact_status',
        type: 'multiselect',
        title: 'Фактический статус ТС',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'waybill_number',
        type: 'multiselect',
        title: 'Выдан ПЛ номер',
      },
      {
        valueKey: 'mission_numbers',
        type: 'multiselect',
        title: 'Активное задание',
      },
      {
        valueKey: 'status_at_check',
        type: 'multiselect',
        title: 'Нахождение ТС на момент проверки',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'mileage',
        type: 'advanced-string-like',
        title: 'Пробег на дату проведения проверки',
      },
      {
        valueKey: 'motohours',
        type: 'advanced-string-like',
        title: 'Наработка м/ч на дату проведения проверки',
      },
      {
        valueKey: 'last_tech_inspection_date',
        type: 'advanced-date',
        title: 'Дата прохождения последнего ТО шасси',
      },
      {
        valueKey: 'last_inspection_equipment',
        type: 'advanced-date',
        title: 'Дата прохождения последнего ТО спецоборудования',
      },
      {
        valueKey: 'odometr_fact',
        type: 'advanced-string-like',
        title: 'Пробег на дату проведения последнего ТО',
      },
      {
        valueKey: 'motohours_fact',
        type: 'advanced-string-like',
        title: 'Наработка м/ч на дату проведения последнего ТО',
      },
      {
        valueKey: 'untimely_maintenance',
        type: 'multiselect',
        title: 'Несвоевременное проведение ТО',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'last_tm_repair_company',
        type: 'multiselect',
        title: 'Кем проведено последнее ТО (организация)',
      },
      {
        valueKey: 'own_tech_maintenance',
        type: 'multiselect',
        title: 'ТО проведено собственными силами',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'last_repair_date',
        type: 'advanced-date',
        title: 'Дата проведения последнего ремонта',
      },
      {
        valueKey: 'repair_from_date',
        type: 'advanced-date',
        title: 'В ремонте с даты',
      },
      {
        valueKey: 'repair_application',
        type: 'multiselect',
        title: 'Заявка на ремонт',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'repair_reason',
        type: 'multiselect',
        title: 'Причина ремонта',
        registry_type: 'inspection_select',
      },
      {
        valueKey: 'not_maintenance_and_repair',
        type: 'multiselect',
        title: 'Тех. обслуживание, ремонт не произведены',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'not_ready_to_work',
        type: 'multiselect',
        title: 'Готовность техники к работе',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'act_readiness_not_issued',
        type: 'multiselect',
        title: 'Акт готовности техники',
        options: [
          { value: true, label: 'Не оформлен' },
          { value: false, label: 'Оформлен' },
        ],
      },
      {
        valueKey: 'defects_text',
        type: 'multiselect',
        title: 'Дефекты при внешнем осмотре',
        options: [
          { value: 'defects_body', label: 'Дефекты кузова' },
          { value: 'defects_chassis', label: 'Дефекты шасси' },
          { value: 'defects_attachments', label: 'Дефекты навесных агрегатов' },
          { value: 'incomplete_equipment', label: 'Неполная комплектность' },
          { value: 'liquids_leak', label: 'Обнаружена течь' },
        ],
      },
      {
        valueKey: 'defects_text',
        type: 'multiselect',
        title: 'Дефекты ТС при пробном запуске ',
        options: [
          { value: 'does_not_start', label: 'ТС не запускается' },
          { value: 'broken_chassis', label: 'Нарушена работоспособность шасси' },
          { value: 'broken_attachments', label: 'Неисправность навесных агрегатов' },
          { value: 'broken_lighting', label: 'Проблема с освещением' },
          { value: 'broken_lighting_alarm', label: 'Проблема со световой сигнализацией' },
          { value: 'broken_audible_alarm', label: 'Проблема со звуковой сигнализацией' },
          { value: 'broken_windscreen_wipers', label: 'Не работают стеклоочистители' },
          { value: 'broken_windscreen_washers', label: 'Не работают стеклоомыватели' },
        ],
      },
      {
        valueKey: 'defects_text',
        type: 'multiselect',
        title: 'Проблемы с документацией',
        options: [
          { value: 'no_registration', label: 'Нет свидетельства о регистрации ТС' },
          { value: 'owner_not_match', label: 'Данные владельца/учреждения не совпадают с реальными данными' },
          { value: 'no_vin', label: 'Отсутствие таблички с VIN/заводским номером' },
          { value: 'registration_not_match_vin', label: 'Данные свидетельства о регистрации ТС не совпадают с VIN/заводским номером' },
          { value: 'no_valid_diagnostic_card', label: 'Отсутствие действующего талона ГТО/диагностической карты' },
          { value: 'no_valid_osago', label: 'Отсутствие полиса ОСАГО' },
        ],
      },
    ],
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
      rowRequestActions: {
        actionUpdate: {
          action: actionUpdateCarsConditionsCar,
        },
        actionCreate: {
          action: actionCreateCarsConditionsCar,
          payload: {
            inspection_id,
          },
        },
      },
      is_render_field: true,
      renderFieldsSchema,
      groupColumn: {
        district: {
          label: 'Жилищник',
          isActive: false,
        },
        ts_data: {
          label: 'Доп. информация о ТС',
          isActive: false,
        },
        add_info: {
          label: 'Общая информация о ТС',
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
          title: 'Гос.номер',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'district',
            firstElem: true, // В группку не входит
          },
          isHorizontalSticky: true,
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
          title: 'Владелец техники',
          width: 200,
          groupOpt: {
            key: 'district',
          },
        },
        {
          key: 'gby_operation_district',
          title: 'Подрядчик',
          width: 200,
          groupOpt: {
            key: 'district',
          },
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'marka',
          title: 'Марка',
          width: 200,
          format: 'inspectionSelect',
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'model',
          title: 'Модель',
          width: 200,
          format: 'inspectionSelect',
          groupOpt: {
            key: 'ts_data',
            firstElem: true, // В группку не входит
          },
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'type',
          title: 'Тип ТС',
          width: 250,
          format: 'inspectionSelect',
          groupOpt: {
            key: 'ts_data',
          },
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'season',
          title: 'Сезон',
          width: 200,
          format: 'inspectionSelect',
          groupOpt: {
            key: 'ts_data',
          },
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'vin',
          title: 'VIN (из системы)',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
          renderParams: {
            type: 'string',
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
          title: 'VIN (ручной ввод)',
          width: 200,
          renderParams: {
            type: 'string',
          },
          groupOpt: {
            key: 'ts_data',
          },
        },
        {
          key: 'factory_number',
          title: 'Заводской номер (из системы)',
          width: 200,
          groupOpt: {
            key: 'ts_data',
          },
          renderParams: {
            type: 'string',
          },
        },
        {
          key: 'factory_number_incorrect',
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
          key: 'factory_number_by_hand',
          title: 'Заводской номер (ручной ввод)',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          key: 'kind_purchase',
          title: 'Вид приобретения',
          width: 200,
          format: 'inspectionSelect',
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
          title: 'действует до',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
        },
        {
          key: 'diagnostic_card',
          title: 'Номер диагностической карты',
          width: 200,
          renderParams: {
            type: 'string',
            label: false,
          },
        },
        {
          key: 'tech_inspection_not_required',
          title: 'Прохождение ТО/ГТО не требуется',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'diagnostic_card_finished_at',
          title: 'действует до',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
          groupOpt: {
            key: 'add_info',
            firstElem: true, // В группку не входит
          },
        },
        {
          key: 'registration_date',
          title: 'Дата регистрации',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'exploitation_date_start',
          title: 'Дата начала эксплуатации',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
          groupOpt: {
            key: 'add_info',
          },
        },
        {
          key: 'tech_inspection_passed',
          title: 'Технический осмотр пройден',
          width: 200,
          format: 'inspectionSelect',
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
          key: 'glonass_stationary',
          title: 'ГЛОНАСС стационарный',
          width: 200,
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          format: 'inspectionSelect',
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
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
        },
        {
          key: 'status_at_check',
          title: 'Нахождение ТС на момент проверки',
          width: 200,
          format: 'inspectionSelect',
          renderParams: {
            type: 'select',
            label: false,
            options: [],
          },
        },
        {
          key: 'on_base',
          title: 'ТС находится на базе',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          format: 'boolean',
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
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
        },
        {
          key: 'last_inspection_equipment',
          title: 'Дата прохождения последнего ТО спецоборудования',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
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
        },
        {
          key: 'own_tech_maintenance',
          title: 'ТО проведено собственными силами',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          groupOpt: {
            key: 'repair_info',
            firstElem: true, // В группку не входит
          },
          format: 'boolean',
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
          key: 'last_repair_date',
          title: 'Дата проведения последнего ремонта',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'repair_from_date',
          title: 'В ремонте с даты',
          width: 200,
          format: 'date',
          renderParams: {
            type: 'date',
            time: false,
            makeGoodFormat: true,
          },
          groupOpt: {
            key: 'repair_info',
          },
        },
        {
          key: 'repair_reason',
          title: 'Причина ремонта',
          width: 200,
          format: 'inspectionSelect',
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
          key: 'repair_time',
          title: 'Длительность ремонта',
          width: 200,
          format: 'inspectionSelect',
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
          key: 'not_maintenance_and_repair',
          title: 'Тех. обслуживание, ремонт не произведены',
          width: 200,
          renderParams: {
            type: 'boolean',
          },
          groupOpt: {
            key: 'repair_info',
          },
          format: 'boolean',
        },
        {
          key: 'repair_application',
          title: 'Заявка на ремонт',
          width: 200,
          format: 'inspectionSelect',
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
          key: 'defects_text',
          title: 'Дефекты',
          width: 200,
          renderParams: {
            type: 'text',
            readOnly: true,
          }
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
