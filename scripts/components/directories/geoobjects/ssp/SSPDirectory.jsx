import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import connectToStores from 'flummox/connect';
import ElementsList from 'components/ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'shortname',
			caption: 'Краткое наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'address',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'productivity',
			caption: 'Производительность (куб. м в сутки)',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'is_mobile',
			caption: 'Мобильность',
			filter: {
				type: 'select',
				labelFunction: (is_mobile) => is_mobile ? 'Да' : 'Нет'
			}
		}
	]
};

let SSPTable = (props) => {

    const renderers = {
			is_mobile: ({data}) => <div style={{textAlign: "center"}}><input type="checkbox" checked={!!data} readOnly /></div>,
		};

		return <Table
				title='Стационарные снегоплавильные пункты'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

class SSPDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'sspsList';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getSSPs();
	}

	render() {

		const { sspsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <SSPTable data={sspsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</SSPTable>
			</div>
		);
	}
}

export default connectToStores(SSPDirectory, ['geoObjects']);
