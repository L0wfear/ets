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
				},
			},
			{
				name: 'id',
				caption: 'Действия',
				type: 'string',
				filter: {
					type: 'select',
				},
			},
		]
	};

	return tableMeta;

};


let CompanyStructureTable = (props) => {

		const renderers = {
			id: ({data}) => {
				let id = data;
				return (
					<div>
						<Button className="action-button" onClick={props.onActionEdit.bind(null, id)}>Редактировать</Button>
						<Button className="action-button" onClick={props.onActionDelete.bind(null, id)}>Удалить</Button>
					</div>
				);
			}
    };

		return <Table title="Структура предприятия"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									isHierarchical={true}
									{...props}/>
}

class CompanyStructure extends ElementsList {

	constructor(props, context) {
		super(props);

    this.mainListName = 'companyStructureLinearList';
	}

	async init() {
		const { flux } = this.context;
		await flux.getActions('company-structure').getCompanyStructure();
		let companyStructureLinearList = await flux.getActions('company-structure').getPlainCompanyStructure();
		this.setState({companyStructureLinearList});
	}

	async onFormHide(isSubmitted) {
		this.setState({showForm: false, selectedElement: null});

		if (isSubmitted === true) {
			this.init();
		}
	}

	selectElement(id, e) {
		e.stopPropagation();
		let selectedElement = _.find(this.state.companyStructureLinearList, el => el.id ? el.id === id : el[this.selectField] === id);
		this.setState({showForm: true, selectedElement});
	}

	async deleteElement(id, e) {
		e.stopPropagation();
		if (confirm('Вы уверены, что хотите удалить выбранный элемент?')) {
			try {
				await this.context.flux.getActions('company-structure').deleteCompanyElement(id);
			} catch (e) {
				console.log(e);
				return;
			}
			this.init();
 		}
	}

	async componentDidUpdate(props) {
		// if (!_.isEqual(props.companyStructureList, this.props.companyStructureList)) {
		// 	let companyStructureLinearList = await this.context.flux.getActions('company-structure').getPlainCompanyStructure();
		// 	this.setState({companyStructureLinearList});
		// }
	}

	render() {

		const { companyStructureList = [] } = this.props;

		return (
			<div className="ets-page-wrap company-structure">
				<CompanyStructureTable data={companyStructureList}
															 //onRowSelected={this.selectElement.bind(this)}
															 onActionEdit={this.selectElement.bind(this)}
															 onActionDelete={this.deleteElement.bind(this)}
															 selected={this.state.selectedElement}
															 selectField={'id'}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Добавить подразделение</Button>
				</CompanyStructureTable>
				<CompanyStructureFormWrap onFormHide={this.onFormHide.bind(this)}
																	element={this.state.selectedElement}
																	showForm={this.state.showForm}
																	{...this.props}/>
			</div>
		);
	}
}

export default connectToStores(CompanyStructure, ['objects']);
