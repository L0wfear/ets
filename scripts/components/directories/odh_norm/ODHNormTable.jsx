import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

let tableMeta = {
  cols: [
    {
      name: 'name',
      caption: 'Норматив по содержанию ОДХ',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'unit',
      caption: 'Единица измерения',
      type: 'text',
      filter: false
    },
    {
      name: 'expendable',
      caption: 'Расходный материал',
      filter: {
				type: 'select',
				labelFunction: (expendable) => expendable ? 'Да' : 'Нет'
			},
    }
  ]
};

let ODHNormTable = (props) => {
	const renderers = {
    expendable: ({data}) => <div style={{textAlign: "center"}}><input type="checkbox" checked={!!data} readOnly /></div>
  };

	return <Table title='Нормативы по содержанию ОДХ'
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}/>
}

export default ODHNormTable;
