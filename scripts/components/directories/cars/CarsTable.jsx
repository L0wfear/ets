import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getCondition = (data) => {
	return parseInt(data, 10) > 0 ? 'Исправно' : 'Неисправно';
};

let tableMeta = {
	cols: [
		{
			name: 'gov_number',
			caption: 'Рег. номер ТС',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'special_model_name',
			caption: 'Модель ТС',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'model_name',
			caption: 'Марка шасси ТС',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'type',
			caption: 'Тип',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'condition',
			caption: 'Состояние',
			type: 'text',
			filter: {
				type: 'select',
        labelFunction: getCondition
			}
		},
		{
			name: 'garage_number',
			caption: 'Гаражный номер',
			type: 'text',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'fuel_correction_rate',
			caption: 'Поправочный коэффициент',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'company_structure_name',
			caption: 'Подразделение предприятия',
			type: 'text',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'gps_code',
			caption: 'Код БНСО',
			type: 'text',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'equipment',
			caption: 'Оборудование ДКМ',
			type: 'text',
			filter: {
				type: 'select',
			},
		}
	]
}

let CarsTable = (props) => {

	const renderers = {
		condition: ({data}) => <div>{getCondition(data)}</div>,
		fuel_correction_rate: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
		garage_number: ({data}) => <div>{data && data !== 'null' ? data : ''}</div>,
		model_name: ({data}) => <div className="white-space-pre-wrap">{data}</div>
	};

	return <Table title='Реестр транспортных средств'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props}/>

}

export default CarsTable;
