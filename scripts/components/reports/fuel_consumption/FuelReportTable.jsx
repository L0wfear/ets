import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'car_model_name',
			caption: 'Модель ТС',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: {
        type: 'select',
      },
		},
		{
			name: 'car_gov_number',
			caption: 'Рег. номер ТС',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: {
        type: 'select',
      },
		},
		{
			name: 'car_garage_number',
			caption: 'Гаражный номер ТС',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: {
        type: 'select',
      },
		},
		{
			name: 'odometr_start',
			caption: 'Одометр. Выезд',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
		},
		{
			name: 'odometr_end',
			caption: 'Одометр. Возврат',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
		},
		{
			name: 'odometr_diff',
			caption: 'Одометр. Пробег',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
		},
    {
      name: 'motohours_start',
      caption: 'Счетчик моточасов. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_end',
      caption: 'Счетчик моточасов. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_diff',
      caption: 'Счетчик моточасов. Пробег',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_start',
      caption: 'Счет. обор. моточасов. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_end',
      caption: 'Счет. обор. моточасов. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_diff',
      caption: 'Счет. обор. моточасов. Пробег',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_type_name',
      caption: 'Тип топлива',
      type: 'text',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'select',
      },
    },
    {
      name: 'fuel_start',
      caption: 'Топливо. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_given',
      caption: 'Топливо. Выдано',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_end',
      caption: 'Топливо. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_fact',
      caption: 'Топливо. Расход',
      type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: {
        type: 'input',
      },
    },
    // {
    //   name: 'fuel_rate',
    //   caption: 'Топливо. Норма',
    //   type: 'number',
		// 	cssClassName: "width-fuel-report-small",
		// 	filter: {
    //     type: 'input',
    //   },
    // },
    // {
    //   name: 'fuel_diff',
    //   caption: 'Топливо. Разница',
    //   type: 'number',
		// 	filter: {
    //     type: 'input',
    //   },
		// 	cssClassName: "width-fuel-report-small",
    // },
	]
}

let FuelReportTable = (props) => {

	const renderers = {

	};

	return <Table title='Отчет по топливу'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								enumerated={false}
								{...props} />

}

export default FuelReportTable;
