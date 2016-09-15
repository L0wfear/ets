import React from 'react';
import { Button, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import {
  employeeFIOLabelFunction,
  waybillStatusLabelFunction,
  waybillMissionsCompleteStatusLabelFunction,
} from 'utils/labelFunctions';

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          labelFunction: waybillStatusLabelFunction,
        },
      },
      {
        name: 'all_missions_completed_or_failed',
        displayName: 'Статус заданий',
        type: 'string',
        filter: {
          type: 'multiselect',
          labelFunction: waybillMissionsCompleteStatusLabelFunction,
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
      },
      {
        name: 'date',
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
          labelFunction: employeeFIOLabelFunction,
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        cssClassName: 'width-nowrap',
        type: 'string',
        filter: {
          type: 'multiselect',
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
        name: 'responsible_person_id',
        displayName: 'Мастер',
        type: 'string',
        filter: {
          type: 'multiselect',
          labelFunction: employeeFIOLabelFunction,
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
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    status: ({ data }) => <div>{waybillStatusLabelFunction(data)}</div>,
    responsible_person_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    driver_id: ({ data }) => <div>{employeeFIOLabelFunction(data)}</div>,
    date_create: ({ data }) => <DateFormatter date={data} />,
    closing_date: ({ data }) => <DateFormatter date={data} />,
    fact_departure_date: ({ data }) => <DateFormatter date={data} time />,
    fact_arrival_date: ({ data }) => <DateFormatter date={data} time />,
    car_special_model_name: (meta) => {
      const spModel = meta.data === null ? '- ' : meta.data;
      const model = meta.rowData.car_model_name === null ? ' -' : meta.rowData.car_model_name;
      return <div className="white-space-pre-wrap">{spModel + '/' + model}</div>;
    },
    all_missions_completed_or_failed: ({ data }) => <div>{waybillMissionsCompleteStatusLabelFunction(data)}</div>,
  };

  return (
    <Table
      title="Журнал путевых листов"
      results={props.data}
      renderers={renderers}
      initialSort={'number'}
      initialSortAscending={false}
      tableMeta={getTableMeta(props)}
      columnControl
      className="waybills-table"
      highlight={[{ status: 'active' }]}
      columnControlStorageName={'waybillsColumnControl'}
      {...props}
    />
  );
};
