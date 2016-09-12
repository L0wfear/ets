import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import moment from 'moment';
import { getFuelOperationById } from 'utils/labelFunctions';

let tableMeta = {
	cols: [
		{
			name: 'order_date',
			displayName: 'Дата приказа',
			type: 'date',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'operation_id',
			displayName: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (operation_id) => getFuelOperationById(operation_id).name,
      }
		},
		{
			name: 'summer_rate',
			displayName: 'Норма для летнего периода',
			type: 'number',
		},
    {
			name: 'winter_rate',
			displayName: 'Норма для зимнего периода',
			type: 'number',
		},
		{
			name: 'car_special_model_name',
			displayName: 'Модель ТС',
			type: 'string',
			filter: {
        type: 'select'
      }
		},
		{
			name: 'car_model_name',
			displayName: 'Марка шасси',
			type: 'number',
      filter: {
        type: 'select'
      }
		},
		{
			name: 'operation_equipment',
			displayName: 'Для спецоборудования',
			type: 'boolen',
      filter: {
        type: 'select',
        labelFunction: (d) => d ? 'Да' : 'Нет'
      }
		}
	]
};

let FuelRatesTable = (props) => {

    const renderers = {
      operation_id: ({data}) => <div>{getFuelOperationById(data).name}</div>,
      order_date: ({data}) => <div>{moment(data).format(global.APP_DATE_FORMAT)}</div>,
      operation_equipment: ({data}) => <div style={{textAlign: "center"}}><input type="checkbox" checked={!!data} readOnly /></div>
    };

		return <Table title='Нормы расхода топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

export default FuelRatesTable;
