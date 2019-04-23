import React from 'react';
import Table from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';
import { WAYBILL_STATUSES } from 'constants/statuses';
import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { get } from 'lodash';
import { missionsStatusBySlag } from 'components/waybill/constant/table';

const ALL_MISSIONS_STATUS_OPTIONS = Object.entries(missionsStatusBySlag).map(
  ([value, label]) => ({ value, label }),
);

const cache = {
  example: {
    array: [],
    options: [],
  },
};

const getOptions = (name, array, map) => {
  const oldArray = get(cache, [name, 'array'], []);
  if (array !== oldArray) {
    cache[name] = {
      array,
      options: array.map(map),
    };
    return cache[name].options;
  }

  return cache[name].options;
};

export const getTableMeta = ({
  employeesIndex = {},
  driversList = [],
  carsFilterList = [],
  employeesList = [],
  structures = [],
  workModeOptions = [],
} = {}) => {
  const tableMeta = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'status',
        displayName: 'Статус ПЛ',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: Object.keys(WAYBILL_STATUSES).map((key) => ({
            label: WAYBILL_STATUSES[key],
            value: key,
          })),
        },
      },
      {
        name: 'all_missions_status',
        displayName: 'Статус заданий',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: ALL_MISSIONS_STATUS_OPTIONS,
        },
      },
      {
        name: 'date_create',
        displayName: 'Дата создания',
        type: 'date',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'closing_date',
        displayName: 'Дата закрытия',
        type: 'date',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'driver_id',
        displayName: 'Водитель',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: driversList.map((e) => ({
            label: employeeFIOLabelFunction(employeesIndex, e.id),
            value: e.id,
          })),
        },
      },
      {
        name: 'car_id',
        displayName: 'Рег. номер ТС',
        cssClassName: 'width-nowrap',
        type: 'string',
        sort: {
          serverFieldName: 'gov_number',
        },
        filter: {
          type: 'multiselect',
          options: carsFilterList.map((car) => ({
            label: car.gov_number,
            value: car.asuods_id,
          })),
        },
      },
      {
        name: 'car_special_model_name',
        displayName: 'Модель ТС',
        type: 'string',
        filter: {
          type: 'advanced-string-like',
        },
      },
      {
        name: 'car_model_name',
        displayName: 'Марка шасси',
        type: 'string',
        filter: {
          type: 'advanced-string-like',
        },
      },
      {
        name: 'garage_number',
        displayName: 'Гаражный номер',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: carsFilterList.reduce((newArr, { garage_number }) => {
            if (garage_number) {
              newArr.push({ value: garage_number, label: garage_number });
            }

            return newArr;
          }, []),
        },
      },
      {
        name: 'work_mode_name',
        displayName: 'Режим работы',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: workModeOptions.map(({ name, label }) => ({
            value: name,
            label,
          })),
        },
      },
      {
        name: 'plan_departure_date',
        displayName: 'Выезд план',
        type: 'datetime',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'fact_departure_date',
        displayName: 'Выезд факт',
        type: 'datetime',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'fact_arrival_date',
        displayName: 'Возвращение факт',
        type: 'date',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'created_by_employee_id',
        displayName: 'Создан',
        type: 'string',
        sort: {
          serverFieldName: 'created_by_employee_name',
        },
        filter: {
          type: 'multiselect',
          options: getOptions('employeesList', employeesList, (e) => ({
            label: employeeFIOLabelFunction(employeesIndex, e.id),
            value: e.id,
          })),
        },
      },
      {
        name: 'activated_by_employee_id',
        displayName: 'Выдан',
        type: 'string',
        sort: {
          serverFieldName: 'activated_by_employee_name',
        },
        filter: {
          type: 'multiselect',
          options: getOptions('employeesList', employeesList, (e) => ({
            label: employeeFIOLabelFunction(employeesIndex, e.id),
            value: e.id,
          })),
        },
      },
      {
        name: 'closed_by_employee_id',
        displayName: 'Закрыт',
        type: 'string',
        sort: {
          serverFieldName: 'closed_by_employee_name',
        },
        filter: {
          type: 'multiselect',
          options: getOptions('employeesList', employeesList, (e) => ({
            label: employeeFIOLabelFunction(employeesIndex, e.id),
            value: e.id,
          })),
        },
      },
      {
        name: 'odometr_start',
        displayName: 'Одометр. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'odometr_end',
        displayName: 'Одометр Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'motohours_start',
        displayName: 'Моточасы. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'motohours_end',
        displayName: 'Моточасы. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'motohours_equip_start',
        displayName: 'Моточасы обор. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'motohours_equip_end',
        displayName: 'Моточасы обор. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'fuel_start',
        displayName: 'Топливо. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'fuel_given',
        displayName: 'Топливо. Выдано, л',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'fuel_end',
        displayName: 'Топливо. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: structures.map(({ id, name }) => ({
            value: id,
            label: name,
          })),
        },
        display: structures.length,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        cssClassName: 'min-width200',
        filter: false,
      },
      {
        name: 'failed_medical_stat_types',
        displayName: 'Непройденные мед. осмотры',
        type: 'select',
        cssClassName: 'min-width200',
        filter: {
          type: 'advanced-select-like',
          options: [
            { value: '%before%', label: 'предрейсовый' },
            { value: '%after%', label: 'послерейсовый' },
            { value: '%line%', label: 'внеплановый' },
          ],
        },
      },
    ],
  };

  return tableMeta;
};

const renderers = {
  status: ({ data }) => (
    <div>{WAYBILL_STATUSES[data] || WAYBILL_STATUSES.default}</div>
  ),
  driver_id: ({ rowData }) => <div>{rowData.driver_fio}</div>,
  created_by_employee_id: ({ rowData }) => (
    <div>{rowData.created_by_employee_name}</div>
  ),
  activated_by_employee_id: ({ rowData }) => (
    <div>{rowData.activated_by_employee_name}</div>
  ),
  closed_by_employee_id: ({ rowData }) => (
    <div>{rowData.closed_by_employee_name}</div>
  ),
  date_create: ({ data }) => <DateFormatter date={data} time />,
  closing_date: ({ data }) => <DateFormatter date={data} time />,
  plan_departure_date: ({ data }) => <DateFormatter date={data} time />,
  fact_departure_date: ({ data }) => <DateFormatter date={data} time />,
  fact_arrival_date: ({ data }) => <DateFormatter date={data} time />,
  all_missions_status: ({ data }) => (
    <div>{get(missionsStatusBySlag, data, '')}</div>
  ),
  structure_id: ({ rowData }) => (
    <div>{get(rowData, 'structure_name', '')}</div>
  ),
  comment: ({ data }) => (
    <div>
      {data
        ? data
          .split('\n')
          .map((oneLineComment, i) => <div key={i}>{oneLineComment}</div>)
        : data}
    </div>
  ),
  car_id: ({ rowData }) => <div>{get(rowData, 'gov_number', '-')}</div>,
};

export default (props) => {
  return (
    <Table
      title="Журнал путевых листов"
      results={props.data}
      renderers={renderers}
      initialSort="number"
      enumerated
      initialSortAscending={false}
      tableMeta={getTableMeta(props)}
      columnControl
      serverPagination
      externalFilter={props.changeFilter}
      externalChangeSort={props.changeSort}
      className="waybills-table"
      highlight={[{ status: 'active' }]}
      columnControlStorageName="waybillsColumnControl"
      {...props}
    />
  );
};
