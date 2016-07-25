import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {

  let CAR_TYPES = props.typesList.map(({id, full_name}) => ({value: id, label: full_name}));
  let OBJECT = [
    {
      value: 1,
      label: "ОДХ"
    },
    {
      value: 2,
      label: "ДТ"
    },
    {
      value: 3,
      label: "ПН"
    }
  ];

  let tableMeta = {
  	cols: [
  		{
  			name: 'work_kind_name',
  			caption: 'Вид работ',
  			type: 'number',
        filter: {
          type: 'select',
        },
  		},
  		{
  			name: 'name',
  			caption: 'Наименование',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'season_name',
  			caption: 'Сезон',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
        cssClassName: 'width80'
  		},
  		{
  			name: 'max_speed',
  			caption: 'Максимальная скорость',
  			type: 'number',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'check_type_name',
  			caption: 'Тип проверки',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'objects',
  			caption: 'Объект',
  			type: 'string',
  			filter: {
  				type: 'multiselect',
          options: OBJECT,
          strict: true
  			},
        cssClassName: 'width60'
  		},
  		{
  			name: 'needs_brigade',
  			caption: 'С участием РКУ',
  			type: 'boolean',
  			filter: {
  				type: 'select',
          labelFunction: (data) => data ? 'Да' : 'Нет'
  			},
  		},
      {
  			name: 'use_in_reports',
  			caption: 'Учет в отчетах',
  			type: 'boolean',
  			filter: {
  				type: 'select',
          labelFunction: (data) => data ? 'Да' : 'Нет'
  			},
  		},
  		{
  			name: 'car_func_types',
  			caption: 'Типы ТС',
  			type: 'string',
  			filter: {
					type: 'multiselect',
					options: CAR_TYPES,
  			},
  		},
  	]
  };

  return tableMeta;
}

let TechnicalOperationsTable = (props) => {

    const renderers = {
      car_func_types: ({data}) => {
        let dataAsString = data.map(d => d.name).join(', ');
        return <div>{dataAsString}</div>;
      },
      objects: ({data}) => {
        let dataAsString = data.map(d => d.name).join(', ');
        return <div>{dataAsString}</div>;
      },
      needs_brigade: ({data}) => <input type="checkbox" disabled checked={!!data}/>,
      use_in_reports: ({data}) => <input type="checkbox" disabled checked={!!data}/>,
    };

		return <Table title="Реестр технологических операций"
                  results={props.data}
									tableMeta={getTableMeta(props)}
                  renderers={renderers}
                  initialSort={'id'}
									{...props}/>
}

export default TechnicalOperationsTable;
