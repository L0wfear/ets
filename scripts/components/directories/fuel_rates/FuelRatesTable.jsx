import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import moment from 'moment';
import { getFuelOperationById } from 'utils/labelFunctions';

let tableMeta = {
	cols: [
		{
			name: 'order_date',
			caption: 'Дата приказа',
			type: 'date',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'operation_id',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (operation_id) => getFuelOperationById(operation_id).name,
      }
		},
		{
			name: 'summer_rate',
			caption: 'Норма для летнего периода',
			type: 'number',
		},
    {
			name: 'winter_rate',
			caption: 'Норма для зимнего периода',
			type: 'number',
		},
		{
			name: 'car_special_model_name',
			caption: 'Модель ТС',
			type: 'string',
			filter: {
        type: 'select'
      }
		},
		{
			name: 'car_model_name',
			caption: 'Марка шасси',
			type: 'number',
      filter: {
        type: 'select'
      }
		},
	]
};

let FuelRatesTable = (props) => {

    const renderers = {
      operation_id: ({data}) => <div>{getFuelOperationById(data).name}</div>,
      order_date: ({data}) => <div>{moment(data).format(global.APP_DATE_FORMAT)}</div>
    };

		return <Table title='Нормы расхода топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

export default FuelRatesTable;
