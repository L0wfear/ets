import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import _ from 'lodash';
import { dateLabelFunction,
				 datePickerFunction,
				 employeeFIOLabelFunction,
				 getCarByIdLabelFunction,
				 waybillStatusLabelFunction,
			 	 waybillMissionsCompleteStatusLabelFunction } from 'utils/labelFunctions';


let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'status',
				caption: 'Статус',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: waybillStatusLabelFunction
				}
			},
			{
				name: 'all_missions_completed_or_failed',
				caption: 'Статус заданий',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: waybillMissionsCompleteStatusLabelFunction
				},
				//display: false,
			},
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				type: 'string',
				display: false,
				filter: {
					type: 'select',
					labelFunction: (id) => getCarByIdLabelFunction(id).gov_number,
				}
			},
			{
				name: 'number',
				caption: 'Номер',
				type: 'number',
			},
			{
				name: 'date_create',
				caption: 'Дата выдачи',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'driver_id',
				caption: 'Водитель',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				type: 'string',
				filter: false
			},
			{
				name: 'fact_departure_date',
				caption: 'Выезд факт',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'fact_arrival_date',
				caption: 'Возвращение факт',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'responsible_person_id',
				caption: 'Мастер',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
		]
	};

	return tableMeta;

};


let WaybillsTable = (props) => {

		const renderers = {
			status: ({data}) => <div>{waybillStatusLabelFunction(data)}</div>,
			responsible_person_id: ({data}) => <div>{employeeFIOLabelFunction(data)}</div>,
			driver_id: ({data}) => <div>{employeeFIOLabelFunction(data)}</div>,
			car_id: ({data}) => <div>{getCarByIdLabelFunction(data).gov_number}</div>,
			date_create: ({data}) => <DateFormatter date={data} />,
			fact_departure_date: ({data}) => <DateFormatter date={data} time={true} />,
			fact_arrival_date: ({data}) => <DateFormatter date={data} time={true} />,
			all_missions_completed_or_failed: ({data}) => <div>{waybillMissionsCompleteStatusLabelFunction(data)}</div>
		};

		return <Table title="Журнал путевых листов"
									results={props.data}
									renderers={renderers}
									initialSort={'number'}
									initialSortAscending={false}
									tableMeta={getTableMeta(props)}
                  multiSelection={true}
									{...props}/>
}

class WaybillJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('waybills').delete;
    this.mainListName = 'waybillsList';

    this.state = {
      selectedElement: null,
      checkedWaybills: {}
    };
	}

	componentDidMount() {
		super.componentDidMount();

		const { flux } = this.context;
		flux.getActions('waybills').getWaybills();
		flux.getActions('employees').getEmployees();
		flux.getActions('objects').getCars();
	}

  stateChangeCallback() {
    if (typeof this.props.onListStateChange === 'function') {
      this.props.onListStateChange(this.state);
    }
  }

  checkWaybill(id, state) {
    const waybills = _.cloneDeep(this.state.checkedWaybills);
    if (state) {
      waybills[parseInt(id, 10)] = _.find(this.props.waybillsList, w => w.id === parseInt(id, 10));
    } else {
      delete waybills[id];
    }
    this.setState({checkedWaybills: waybills}, this.stateChangeCallback.bind(this));
  }

  checkAll(rows, state) {
    let checkedWaybills = _.cloneDeep(this.state.checkedWaybills);
    checkedWaybills = state ? rows : {};

    this.setState({checkedWaybills}, this.stateChangeCallback.bind(this));
  }

  removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') return;

    if (Object.keys(this.state.checkedWaybills).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;

      _.forEach(this.state.checkedWaybills, (waybill) => {
        this.removeElementAction(waybill.id);
      });
			this.setState({
				checkedWaybills: {},
				selectedElement: null,
			});
    } else {
      this.removeElement();
    }
  }

	render() {

		const { waybillsList = [] } = this.props;

		let disabledCloseButton = this.state.selectedElement === null || this.state.selectedElement.status !== 'active';

		return (
			<div className="ets-page-wrap">
				<WaybillsTable data={waybillsList} onAllRowsChecked={this.checkAll.bind(this)} onRowChecked={this.checkWaybill.bind(this)} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} checked={this.state.checkedWaybills} selectField={'id'} filterValues={this.props.location.query} {...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать ПЛ</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть</Button>
					<Button bsSize="small" disabled={disabledCloseButton} onClick={this.showForm.bind(this)}><Glyphicon glyph="ok" /> Закрыть ПЛ</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null && Object.keys(this.state.checkedWaybills).length === 0} onClick={this.removeCheckedElements.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</WaybillsTable>
				<WaybillFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 element={this.state.selectedElement}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(WaybillJournal, ['waybills', 'objects', 'employees']);
