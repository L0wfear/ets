import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, ButtonToolbar, Glyphicon, Row, Col } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import moment from 'moment';
import cx from 'classnames';
import { createValidDateTime, getToday0am, getToday2359 } from 'utils/dates';
import FaxogrammMissionsFormWrap from './FaxogrammMissionsFormWrap.jsx';
import { saveData } from 'utils/functions';

// TODO привести к общему виду

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'order_number',
				displayName: 'Номер',
				type: 'number',
        cssClassName: 'width120'
			},
      {
				name: 'create_date',
				displayName: 'Дата создания',
				type: 'date',
				filter: {
					type: 'select'
				}
			},
      {
				name: 'order_date',
				displayName: 'Начало действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_date_to',
				displayName: 'Окончание действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_type_name',
				displayName: 'Тип',
				type: 'string',
				filter: {
					type: 'select'
				},
        cssClassName: 'width60'
			},
      {
				name: 'order_status_name',
				displayName: 'Статус',
				type: 'string',
				filter: {
					type: 'select'
				},
			},
      {
				name: 'pgm_deny',
				displayName: 'ПГМ',
				type: 'string',
				filter: {
					type: 'select',
				},
        cssClassName: 'width120'
			},
		]
	};

	return tableMeta;

};


let FaxogrammsTable = (props) => {

		const renderers = {
			order_date: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
  		order_date_to: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
    	create_date: ({data}) => <DateFormatter date={data} time={true} empty={'Не указано'} />,
			pgm_deny: ({data}) => <div>{data === 1 ? 'Не применять' : 'Применять'}</div>,
		};

		return <Table title="Реестр факсограмм"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
                  serverPagination={true}
									initialSort={'create_date'}
									initialSortAscending={false}
									{...props}/>
}

let FaxogrammOperationInfoTable = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'tk_operation_name',
				displayName: 'Операция',
				type: 'string',
			},
			{
				name: 'num_exec',
				displayName: 'Количество выполнений',
				type: 'string',
			},
		]
	};

	return <Table title="Реестр факсограмм"
								results={props.data}
								tableMeta={tableMeta}
								{...props}/>
}

let FaxogrammInfoTable = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'order_info',
				displayName: 'Дополнительная информация',
				type: 'string',
			},
		]
	};

	return <Table title="Реестр факсограмм"
								results={props.data}
								tableMeta={tableMeta}
								{...props}/>
}

let FaxogrammsDatepicker = (props) => {
	return (
		<Row>
			<Col md={3}>
			</Col>
			<Col md={6} className="faxogramms-date-range">
				<Div className="inline-block faxogramms-date">
					<Datepicker date={ props.create_date_from } onChange={props.handleChange.bind(null, 'create_date_from')}/>
				</Div>
				<Div className="date-divider">—</Div>
				<Div className="inline-block">
					<Datepicker date={ props.create_date_to } onChange={props.handleChange.bind(null, 'create_date_to')}/>
				</Div>
			</Col>
		</Row>
	)
}


class FaxogrammDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

    this.mainListName = 'faxogrammsList';

    this.state = {
      page: 0,
			selectedElement: null,
			create_date_from: getToday0am(),
			create_date_to: getToday2359(),
    };
	}

	componentDidMount() {
		super.componentDidMount();

		this.getFaxogramms();
	}

	getFaxogramms() {
    this.context.flux.getActions('objects').getFaxogramms(this.state.page, this.state.create_date_from, this.state.create_date_to);
	}

	saveFaxogramm() {
		const { flux } = this.context;
		const faxogramm = this.state.selectedElement;
		flux.getActions('objects').saveFaxogramm(faxogramm.id)
			.then(({blob, fileName}) => saveData(blob, fileName));
	}

  onPageChange(page) {
    this.setState({page}, () => this.getFaxogramms());
  }

	handleChange(field, value) {
		this.setState({[field]: value}, () => this.getFaxogramms());
	}

	render() {

		const { faxogrammsList = [], faxogrammsMaxPage } = this.props;
		let faxogramm = this.state.selectedElement || {};
		let faxogrammInfoData = [{id: 0, order_info: faxogramm.order_info}];

		return (
			<div className="ets-page-wrap">
				<FaxogrammsDatepicker handleChange={this.handleChange.bind(this)} {...this.state}/>
        <FaxogrammsTable data={faxogrammsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
					<Button onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}>Создать задания</Button>
					<Button onClick={this.saveFaxogramm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="download-alt" /></Button>
				</FaxogrammsTable>
				<FaxogrammMissionsFormWrap onFormHide={this.onFormHide.bind(this)}
																	 showForm={this.state.showForm}
																	 element={this.state.selectedElement}
																	 {...this.props}/>
        <Paginator currentPage={this.state.page} maxPage={faxogrammsMaxPage} setPage={this.onPageChange.bind(this)}/>
				<Div hidden={this.state.selectedElement === null}>
	        <Row>
						<h4 style={{marginLeft: 20, fontWeight: 'bold'}}>Расшифровка факсограммы</h4>
	          <Col md={8}>
							<FaxogrammOperationInfoTable
								noHeader={true}
								preventNoDataMessage={true}
								data={faxogramm.technical_operations || []}/>
	          </Col>
	          <Col md={4}>
							<FaxogrammInfoTable
								noHeader={true}
								preventNoDataMessage={true}
								data={faxogrammInfoData}/>
	          </Col>
	        </Row>
				</Div>
			</div>
		);
	}
}

export default connectToStores(FaxogrammDirectory, ['objects']);
