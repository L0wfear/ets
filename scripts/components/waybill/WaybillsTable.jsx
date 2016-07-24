import React from 'react';
import { Button, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import { dateLabelFunction,
				 datePickerFunction,
				 employeeFIOLabelFunction,
				 getCarByIdLabelFunction,
				 waybillStatusLabelFunction,
			 	 waybillMissionsCompleteStatusLabelFunction } from 'utils/labelFunctions';

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				type: 'string',
				display: false,
				filter: {
					type: 'select',
					labelFunction: (id) => getCarByIdLabelFunction(id).gov_number,
				}
			},
			{
				name: 'status',
				caption: 'Статус',
				type: 'string',
				cssClassName: 'width-waybill-large',
				filter: {
					type: 'select',
					labelFunction: waybillStatusLabelFunction
				}
			},
			{
				name: 'all_missions_completed_or_failed',
				caption: 'Статус заданий',
				cssClassName: 'width-waybill-small',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: waybillMissionsCompleteStatusLabelFunction
				},
				//display: false,
			},
			{
				name: 'number',
				caption: 'Номер',
				cssClassName: 'width-waybill-small',
				type: 'number',
			},
			{
				name: 'date_create',
				caption: 'Дата выдачи',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'closing_date',
				caption: 'Дата закрытия',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'driver_id',
				caption: 'Водитель',
				cssClassName: 'width-waybill-small',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				cssClassName: 'width-waybill-large',
				type: 'string',
				filter: false
			},
			{
				name: 'car_special_model_name',
				caption: 'Модель ТС/Марка шасси',
				cssClassName: 'width-waybill-small',
				type: 'string',
			},
			{
				name: 'car_model_name',
				caption: 'Марка шасси',
				type: 'string',
				display: false
			},
			{
				name: 'garage_number',
				caption: 'Гаражный номер',
				cssClassName: 'width-waybill-small',
				type: 'string',
			},
			{
				name: 'fact_departure_date',
				caption: 'Выезд факт',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'fact_arrival_date',
				caption: 'Возвращение факт',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'responsible_person_id',
				caption: 'Мастер',
				cssClassName: 'width-waybill-large',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
			{
				name: 'odometr_start',
				caption: 'Одометр. Выезд',
				cssClassName: 'width-waybill-tiny',
				type: 'number',
				filter: {
	        type: 'input',
	      },
			},
			{
				name: 'odometr_end',
				caption: 'Одометр Возврат',
				cssClassName: 'width-waybill-tiny',
				type: 'number',
				filter: {
	        type: 'input',
	      },
			},
			{
	      name: 'motohours_start',
	      caption: 'Моточасы. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
	    {
	      name: 'motohours_end',
	      caption: 'Моточасы. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'motohours_equip_start',
	      caption: 'Моточасы обор. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
	    {
	      name: 'motohours_equip_end',
	      caption: 'Моточасы обор. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'fuel_start',
	      caption: 'Топливо. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'fuel_end',
	      caption: 'Топливо. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
		]
	};

	return tableMeta;

};

export let WaybillsTable = (props) => {

		const renderers = {
			status: ({data}) => <div>{waybillStatusLabelFunction(data)}</div>,
			responsible_person_id: ({data}) => <div>{employeeFIOLabelFunction(data)}</div>,
			driver_id: ({data}) => <div>{employeeFIOLabelFunction(data)}</div>,
			car_id: ({data}) => <div>{getCarByIdLabelFunction(data).gov_number}</div>,
			date_create: ({data}) => <DateFormatter date={data} />,
			fact_departure_date: ({data}) => <DateFormatter date={data} time={true} />,
			fact_arrival_date: ({data}) => <DateFormatter date={data} time={true} />,
			car_special_model_name: (meta) => {
				let spModel = meta.data === null ? '- ' : meta.data;
				let model = meta.rowData.car_model_name === null ? ' -' : meta.rowData.car_model_name;
				return <div className="white-space-pre-wrap">{spModel+"/"+model}</div>
			},
			all_missions_completed_or_failed: ({data}) => <div>{waybillMissionsCompleteStatusLabelFunction(data)}</div>
		};

		return <Table title="Журнал путевых листов"
			results={props.data}
			renderers={renderers}
			initialSort={'number'}
			initialSortAscending={false}
			tableMeta={getTableMeta(props)}
			columnControl={true}
			className="waybills-table"
			columnControlStorageName={'waybillsColumnControl'}
			{...props}/>
}
