import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import Griddle from 'griddle-react';
import Paginator from '../ui/Paginator.jsx';
import CompanyStructureFormWrap from './CompanyStructureFormWrap.jsx';


let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'name',
				caption: 'Название',
				type: 'string',
			},
			{
				name: 'type_display',
				caption: 'Тип',
				type: 'string',
				filter: {
					type: 'select',
				}
      },
			{
				name: 'note',
				caption: 'Примечание',
				type: 'string',
				filter: {
					type: 'select',
				}
			},
		]
	};

	return tableMeta;

};


let WaybillsTable = (props) => {

		const renderers = {

    };

		return <Table title="Структура предприятия"
									results={props.data}
									renderers={renderers}
									initialSort={'number'}
									initialSortAscending={false}
									tableMeta={getTableMeta(props)}
									{...props}/>
}

class WaybillJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.mainListName = 'waybillsList';
	}

	init() {
		const { flux } = this.context;
		flux.getActions('company-structure').getCompanyStructure();
	}

  initializeMetadata(tableMeta = { cols: [] }, renderers = {}) {

  	const metadata = _.reduce(tableMeta.cols, (cur, col, i) => {

      if (col.display === false) {
        return cur;
      }

  		const metaObject = {
  			columnName: col.name,
  			displayName: col.caption,
  		};

  		if (typeof renderers[col.name] === 'function') {
  			metaObject.customComponent = renderers[col.name];
  		}

      if (typeof col.cssClassName !== 'undefined') {
  			metaObject.cssClassName = col.cssClassName || '';
  		}

  		cur.push(metaObject);
  		return cur;
  	}, []);

  	return metadata;
  }

	render() {

		const { companyStructureList = [] } = this.props;
    let metadata = this.initializeMetadata(getTableMeta(), {});

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Структура предприятия
					<div className="waybills-buttons">
						<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Добавить подразделение</Button>
					</div>
				</div>
        <div className="company-structure">
					<Griddle results={companyStructureList}
	                 columns={["name", "type_display", "note"]}
	                 useCustomPagerComponent={true}
									 customPagerComponent={Paginator}
	                 columnMetadata={metadata}
									 noDataMessage={'Нет данных'}/>
        </div>
				<CompanyStructureFormWrap onFormHide={this.onFormHide.bind(this)}
																	element={this.state.selectedElement}
																	showForm={this.state.showForm}
																	{...this.props}/>
			</div>
		);
	}
}

export default connectToStores(WaybillJournal, ['objects']);
