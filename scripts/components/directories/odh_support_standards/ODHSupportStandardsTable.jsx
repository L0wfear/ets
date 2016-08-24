import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

let tableMeta = {
  cols: [
    {
      name: 'standard',
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
    }
  ]
};

let ODHSupportStandardsTable = (props) => {
	const renderers = {};

	return <Table title='Нормативы по содержанию ОДХ'
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}/>
}

export default ODHSupportStandardsTable;
