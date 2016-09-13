import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'order_number',
				displayName: 'Номер',
				type: 'number',
        cssClassName: 'width120'
			},
      {
				name: 'create_date',
				displayName: 'Дата создания',
				type: 'date',
				filter: {
					type: 'select'
				}
			},
      {
				name: 'order_date',
				displayName: 'Начало действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_date_to',
				displayName: 'Окончание действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_type_name',
				displayName: 'Тип',
				type: 'string',
				filter: {
					type: 'select'
				},
        cssClassName: 'width60'
			},
      {
				name: 'order_status_name',
				displayName: 'Статус',
				type: 'string',
				filter: {
					type: 'select'
				},
			},
      {
				name: 'pgm_deny',
				displayName: 'ПГМ',
				type: 'number',
				filter: {
					type: 'select',
				},
        cssClassName: 'width120'
			},
		]
	};

	return tableMeta;

};


export default (props) => {

	const renderers = {
		order_date: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
		order_date_to: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
  	create_date: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
		pgm_deny: ({data}) => <div>{data === 1 ? 'Не применять' : 'Применять'}</div>,
	};

	return <Table title="Реестр факсограмм"
								results={props.data}
								renderers={renderers}
								tableMeta={getTableMeta(props)}
                serverPagination={true}
								initialSort={'create_date'}
								initialSortAscending={false}
								{...props}/>
}
