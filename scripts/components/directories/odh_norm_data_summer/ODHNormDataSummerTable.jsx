import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

let tableMeta = {
  cols: [
    {
			name: 'technical_operation_name',
      caption: 'Технологическая операция',
			type: 'string',
      filter: {
				type: 'select'
			},
		},
		{
			name: 'standard_name',
			caption: 'Норматив содержания ОДХ',
			type: 'string',
      filter: {
				type: 'select'
			},
		},
		{
			name: 'unit',
			caption: 'Единица измерения',
			type: 'string',
			filter: false,
		},
		{
			name: 'categorized_1',
			caption: '1',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_2',
			caption: '2',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_3',
			caption: '3',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_4',
			caption: '4',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_5',
			caption: '5',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_6a',
			caption: '6а',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_6b',
			caption: '6б',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_6c',
			caption: '6в',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_7a',
			caption: '7а',
			type: 'number',
			filter: false,
		},
		{
			name: 'categorized_7b',
			caption: '7б',
			type: 'number',
			filter: false,
		},
		{
			name: 'uncategorized_highway',
			caption: 'Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")',
			type: 'number',
			filter: false,
		},
		{
			name: 'uncategorized_odhs_center',
			caption: 'ОДХ внутри Садового кольца',
			type: 'number',
			filter: false,
		},
		{
			name: 'uncategorized_odhs_other',
			caption: 'ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы',
			type: 'number',
			filter: false,
		}
  ]
};

let ODHNormDataSummerTable = (props) => {
	const renderers = {};

	return <Table title='Показатели норм по содержанию ОДХ (лето)'
      results={props.data}
      tableMeta={tableMeta}
      className="small-table"
      renderers={renderers}
      {...props}/>
}

export default ODHNormDataSummerTable;
