import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

let tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      caption: 'Технологическая операция',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'source',
      caption: 'Источник',
      type: 'text',
      filter: {
				type: 'select',
				labelFunction: (source) => +source ? 'Справочник показателей норм на содержание ОДХ' : 'Реестр ОДХ'
			}
    },
    {
      name: 'areal_feature_name',
      caption: 'Площадная характеристика',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'ratio',
      caption: 'Коэффициент',
      type: 'text'
    }
  ]
};

let EfficiencyTable = (props) => {
	const renderers = {
    source: ({data}) => +data ? <div>Справочник показателей норм на содержание ОДХ</div> : <div>Реестр ОДХ</div>
  };

	return <Table title='Реестр показателей для расчета эффективности'
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}/>
}

export default EfficiencyTable;
