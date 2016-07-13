import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
// import OrganizationsFormWrap from './ssp/OrganizationsFormWrap.jsx';
import ElementsList from 'components/ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'asuods_id',
			caption: 'ID организации',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'name',
			caption: 'Наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'short_name',
			caption: 'Краткое наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'ogrn',
			caption: 'ОГРН',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'inn',
			caption: 'ИНН',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'postal_address',
			caption: 'Почтовый адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'email',
			caption: 'Электронный адрес',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'phone',
			caption: 'Телефон',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'fax',
			caption: 'Факс',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
	]
};

let OrganizationsTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Организации'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

class OrganizationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'name';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
	}

	render() {

		const { organizations = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <OrganizationsTable data={organizations} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</OrganizationsTable>
			</div>
		);
	}
}

OrganizationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(OrganizationsDirectory, ['objects']);
