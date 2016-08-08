import React, { Component } from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';
import { datePickerFunction } from 'utils/labelFunctions';

const MISSION_STATUS_LABELS = {
  'assigned': 'Назначено',
  'not_assigned': 'Не назначено',
  'complete': 'Выполнено',
  'fail': 'Не выполнено'
};

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'car_gov_number',
				caption: 'Транспортное средство',
				type: 'number',
				display: false,
				filter: {
					type: 'select',
				},
			},
      {
        name: 'status',
        caption: 'Статус',
        type: 'string',
        filter: {
  				type: 'select',
          labelFunction: (s) => MISSION_STATUS_LABELS[s],
  			},
        cssClassName: 'width120'
      },
      {
        name: 'number',
        caption: 'Номер',
        type: 'number',
        filter: {
  				type: 'select'
  			},
        cssClassName: 'width60',
      },
      {
        name: 'waybill_number',
        caption: 'Путевой лист',
        type: 'number',
        filter: {
  				type: 'select'
  			},
        cssClassName: 'width60',
      },
      {
				name: 'mission_source_name',
				caption: 'Источник',
				type: 'number',
				filter: {
					type: 'select',
				},
        cssClassName: 'width150',
			},
      {
				name: 'date_start',
				caption: 'Начало',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				},
			},
      {
				name: 'date_end',
				caption: 'Завершение',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				},
			},
      {
				name: 'car_gov_number',
				caption: 'Транспортное средство',
				type: 'number',
				filter: false,
        cssClassName: 'width120',
			},
      {
				name: 'route_name',
				caption: 'Маршрут',
				type: 'number',
				filter: {
					type: 'select',
				},
        cssClassName: 'width120',
			},
      {
				name: 'passes_count',
				caption: 'Количество проходов',
				type: 'number',
				filter: {
					type: 'select'
				},
        cssClassName: 'width120',
			},
      {
				name: 'technical_operation_name',
				caption: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'select',
				}
			},
      {
				name: 'comment',
				caption: 'Комментарий',
				type: 'string',
				filter: false
			},
			{
	      name: 'id',
	      caption: 'Показать на карте',
				filter: false,
				cssClassName: 'map-view'
	    },
		]
	};

	return tableMeta;

};


let MissionsTable = (props) => {

		const renderers = {
      status: ({data}) => <div>{MISSION_STATUS_LABELS[data]}</div>,
      date_start: ({data}) => <DateFormatter date={data} time={true} />,
      date_end: ({data}) => <DateFormatter date={data} time={true} />,
			id: (meta) => {
				if (meta.rowData.status === 'not_assigned') return <div>Нет данных</div>;
					return <div>
						<span onClick={() => props.mapView(meta.data)}>
							<Glyphicon glyph="info-sign" />
						</span>
					</div>
			},
		};

		return <Table title="Журнал заданий"
				results={props.data}
				renderers={renderers}
				tableMeta={getTableMeta(props)}
				initialSort={'number'}
				initialSortAscending={false}
				multiSelection={true}
				{...props}/>
}

export default MissionsTable;
