import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import WaybillPrintForm from './WaybillPrintForm.jsx';
import ElementsList from 'components/ElementsList.jsx';
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
				name: 'status',
				caption: 'Статус',
				type: 'string',
				cssClassName: 'width-waybill-large',
				filter: {
					type: 'select',
					labelFunction: waybillStatusLabelFunction
				}
			},
			{
				name: 'all_missions_completed_or_failed',
				caption: 'Статус заданий',
				cssClassName: 'width-waybill-small',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: waybillMissionsCompleteStatusLabelFunction
				},
				//display: false,
			},
			{
				name: 'number',
				caption: 'Номер',
				cssClassName: 'width-waybill-small',
				type: 'number',
			},
			{
				name: 'date_create',
				caption: 'Дата выдачи',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'closing_date',
				caption: 'Дата закрытия',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'driver_id',
				caption: 'Водитель',
				cssClassName: 'width-waybill-small',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				cssClassName: 'width-waybill-large',
				type: 'string',
				filter: false
			},
			{
				name: 'car_special_model_name',
				caption: 'Модель ТС/Марка шасси',
				cssClassName: 'width-waybill-small',
				type: 'string',
			},
			{
				name: 'car_model_name',
				caption: 'Марка шасси',
				type: 'string',
				display: false
			},
			{
				name: 'garage_number',
				caption: 'Гаражный номер',
				cssClassName: 'width-waybill-small',
				type: 'string',
			},
			{
				name: 'fact_departure_date',
				caption: 'Выезд факт',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'fact_arrival_date',
				caption: 'Возвращение факт',
				cssClassName: 'width-waybill-large',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
				}
			},
			{
				name: 'responsible_person_id',
				caption: 'Мастер',
				cssClassName: 'width-waybill-large',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: employeeFIOLabelFunction,
				}
			},
			{
				name: 'odometr_start',
				caption: 'Одометр. Выезд',
				cssClassName: 'width-waybill-tiny',
				type: 'number',
				filter: {
	        type: 'input',
	      },
			},
			{
				name: 'odometr_end',
				caption: 'Одометр Возврат',
				cssClassName: 'width-waybill-tiny',
				type: 'number',
				filter: {
	        type: 'input',
	      },
			},
			{
	      name: 'motohours_start',
	      caption: 'Моточасы. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
	    {
	      name: 'motohours_end',
	      caption: 'Моточасы. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'motohours_equip_start',
	      caption: 'Моточасы обор. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
	    {
	      name: 'motohours_equip_end',
	      caption: 'Моточасы обор. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'fuel_start',
	      caption: 'Топливо. Выезд',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
	    },
			{
	      name: 'fuel_end',
	      caption: 'Топливо. Возврат',
				cssClassName: 'width-waybill-tiny',
	      type: 'number',
				filter: {
	        type: 'input',
	      },
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
			car_special_model_name: (meta) => {
				let spModel = meta.data === null ? '- ' : meta.data;
				let model = meta.rowData.car_model_name === null ? ' -' : meta.rowData.car_model_name;
				return <div>{spModel+"/"+model}</div>
			},
			all_missions_completed_or_failed: ({data}) => <div>{waybillMissionsCompleteStatusLabelFunction(data)}</div>
		};

		return <Table title="Журнал путевых листов"
				results={props.data}
				renderers={renderers}
				initialSort={'number'}
				initialSortAscending={false}
				tableMeta={getTableMeta(props)}
				multiSelection={true}
				columnControl={true}
				columnControlStorageName={'waybillsColumnControl'}
				enumeratedCss={'width-waybill-small'}
				{...props}/>
}

class WaybillJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('waybills').deleteWaybill;
    this.mainListName = 'waybillsList';

    this.state = {
      selectedElement: null,
      checkedWaybills: {},
			showPrintForm: false
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

	showPrintForm(printNumber) {
		this.setState({showPrintForm: printNumber})
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
					<ButtonToolbar style={{
						marginLeft: "5px",
						position: "relative",
						bottom: "-11px",
					}}>
						<Dropdown id="dropdown-print" pullRight>
							<Dropdown.Toggle noCaret bsSize="small">
								<Glyphicon glyph="download-alt" />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem onClick={this.showPrintForm.bind(this, 1)}>Журнал путевых листов (ТМФ №8)</MenuItem>
								<MenuItem onClick={this.showPrintForm.bind(this, 2)}>Отчет по выработке ТС</MenuItem>
							</Dropdown.Menu>
						</Dropdown>
					</ButtonToolbar>
				</WaybillsTable>
				<WaybillFormWrap
						onFormHide={this.onFormHide.bind(this)}
						showForm={this.state.showForm}
						element={this.state.selectedElement}
						{...this.props}/>
				<WaybillPrintForm
						show={this.state.showPrintForm}
						hide={() => this.setState({showPrintForm: false})}/>
			</div>
		);
	}
}

export default connectToStores(WaybillJournal, ['waybills', 'objects', 'employees']);
