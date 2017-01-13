import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import { WAYBILL_STATUSES } from 'constants/statuses';
import {
  employeeFIOLabelFunction,
} from 'utils/labelFunctions';

function waybillMissionsCompleteStatusLabelFunction(status) {
  return status === true ? 'Все задания завершены' : 'Есть незавершенные задания';
}

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
      },
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: Object.keys(WAYBILL_STATUSES).map(key => ({ label: WAYBILL_STATUSES[key], value: key })),
        },
      },
      {
        name: 'all_missions_completed_or_failed',
        displayName: 'Статус заданий',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: [
            { label: 'Все задания завершены', value: 'true' },
            { label: 'Есть незавершенные задания', value: 'false' },
          ],
        },
      },
      {
        name: 'date_create',
        displayName: 'Дата создания',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'closing_date',
        displayName: 'Дата закрытия',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'driver_id',
        displayName: 'Водитель',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.driversList.map(e => ({ label: employeeFIOLabelFunction(e.id), value: e.id })),
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        cssClassName: 'width-nowrap',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.carsList.map(e => ({ label: e.gov_number, value: e.gov_number }))
        },
      },
      {
        name: 'car_special_model_name',
        displayName: 'Модель ТС/Марка шасси',
        type: 'string',
      },
      {
        name: 'car_model_name',
        displayName: 'Марка шасси',
        type: 'string',
        display: false,
      },
      {
        name: 'garage_number',
        displayName: 'Гаражный номер',
        type: 'string',
      },
      {
        name: 'plan_departure_date',
        displayName: 'Выезд план',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_departure_date',
        displayName: 'Выезд факт',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_arrival_date',
        displayName: 'Возвращение факт',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'created_by_employee_id',
        displayName: 'Создан',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.employeesList.map(e => ({ label: employeeFIOLabelFunction(e.id), value: e.id })),
        },
      },
      {
        name: 'activated_by_employee_id',
        displayName: 'Выдан',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.employeesList.map(e => ({ label: employeeFIOLabelFunction(e.id), value: e.id })),
        },
      },
      {
        name: 'closed_by_employee_id',
        displayName: 'Закрыт',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.employeesList.map(e => ({ label: employeeFIOLabelFunction(e.id), value: e.id })),
        },
      },
      {
        name: 'odometr_start',
        displayName: 'Одометр. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'odometr_end',
        displayName: 'Одометр Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'motohours_start',
        displayName: 'Моточасы. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'motohours_end',
        displayName: 'Моточасы. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'motohours_equip_start',
        displayName: 'Моточасы обор. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'motohours_equip_end',
        displayName: 'Моточасы обор. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'fuel_start',
        displayName: 'Топливо. Выезд',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'fuel_end',
        displayName: 'Топливо. Возврат',
        cssClassName: 'width20',
        type: 'number',
        filter: {
          type: 'input',
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: props.structures.map(({ id, name }) => ({ value: id, label: name })),
        },
        display: props.structures.length,
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    status: ({ data }) => <div>{WAYBILL_STATUSES[data] || WAYBILL_STATUSES.default}</div>,
    responsible_person_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    driver_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    created_by_employee_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    activated_by_employee_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    closed_by_employee_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    date_create: ({ data }) => <DateFormatter date={data} time />,
    closing_date: ({ data }) => <DateFormatter date={data} />,
    plan_departure_date: ({ data }) => <DateFormatter date={data} time />,
    fact_departure_date: ({ data }) => <DateFormatter date={data} time />,
    fact_arrival_date: ({ data }) => <DateFormatter date={data} time />,
    car_special_model_name: (meta) => {
      const spModel = meta.data === null ? '- ' : meta.data;
      const model = meta.rowData.car_model_name === null ? ' -' : meta.rowData.car_model_name;
      return <div className="white-space-pre-wrap">{`${spModel}/${model}`}</div>;
    },
    all_missions_completed_or_failed: ({ data }) => <div>{waybillMissionsCompleteStatusLabelFunction(data)}</div>,
    structure_id: ({ data }) => <div>{props.structures.find(s => s.id === data) ? props.structures.find(s => s.id === data).name : ''}</div>,
  };

  return (
    <Table
      title="Журнал путевых листов"
      results={props.data}
      renderers={renderers}
      initialSort={'number'}
      enumerated={false}
      initialSortAscending={false}
      tableMeta={getTableMeta(props)}
      columnControl
      serverPagination
      externalFilter={props.changeFilter}
      externalChangeSort={props.changeSort}
      className="waybills-table"
      highlight={[{ status: 'active' }]}
      columnControlStorageName={'waybillsColumnControl'}
      {...props}
    />
  );
};
