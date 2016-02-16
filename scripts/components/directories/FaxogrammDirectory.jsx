import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import ElementsList from '../ElementsList.jsx';
import Paginator from '../ui/Paginator.jsx';
import Div from '../ui/Div.jsx';
import Datepicker from '../ui/Datepicker.jsx';
import moment from 'moment';
import cx from 'classnames';
import { createValidDateTime, getToday7am, getToday2359 } from '../../utils/dates.js';


let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'order_number',
				caption: 'Номер',
				type: 'number',
        cssClassName: 'width120'
			},
      {
				name: 'create_date',
				caption: 'Дата создания',
				type: 'date',
				filter: {
					type: 'select'
				}
			},
      {
				name: 'order_date',
				caption: 'Начало действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_date_to',
				caption: 'Окончание действия',
				type: 'number',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'order_type_name',
				caption: 'Тип',
				type: 'string',
				filter: {
					type: 'select'
				},
        cssClassName: 'width60'
			},
      {
				name: 'order_status_name',
				caption: 'Статус',
				type: 'string',
				filter: {
					type: 'select'
				},
			},
      {
				name: 'pgm_deny',
				caption: 'ПГМ не применять',
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
			order_date: ({data}) => <div>{moment.utc(data).format('YYYY-MM-DD HH:mm')}</div>,
  		order_date_to: ({data}) => <div>{moment.utc(data).format('YYYY-MM-DD HH:mm')}</div>,
    	create_date: ({data}) => <div>{moment.utc(data).format('YYYY-MM-DD HH:mm')}</div>,
			pgm_deny: ({data}) => <div>{data === 1 ? 'Да' : 'Нет'}</div>,
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
				caption: 'Операция',
				type: 'string',
			},
			{
				name: 'num_exec',
				caption: 'Количество выполнений',
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
				caption: 'Дополнительная информация',
				type: 'string',
			},
		]
	};

	return <Table title="Реестр факсограмм"
								results={props.data}
								tableMeta={tableMeta}
								{...props}/>
}


class FaxogrammDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

    this.mainListName = 'faxogrammsList';

    this.state = {
      page: 0,
			selectedElement: null,
			create_date_from: getToday7am(),
			create_date_to: getToday2359(),
    };
	}

  init() {
		this.getFaxogramms();
  }

  componentDidMount() {
    this.init();
	}

	getFaxogramms() {
    this.context.flux.getActions('objects').getFaxogramms(this.state.page, this.state.create_date_from, this.state.create_date_to);
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
		console.log(this.state);

		return (
			<div className="ets-page-wrap">
				<Row className="faxogramms-date-range">
					<Col md={3}>
					</Col>
					<Col md={3}>
						<Datepicker date={ this.state.create_date_from } onChange={this.handleChange.bind(this, 'create_date_from')}/>
					</Col>
					<Div className="date-divider">—</Div>
					<Col md={3}>
					<Datepicker date={ this.state.create_date_to } onChange={this.handleChange.bind(this, 'create_date_to')}/>
					</Col>
				</Row>
        <FaxogrammsTable data={faxogrammsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
        </FaxogrammsTable>
        <Paginator currentPage={this.state.page} maxPage={faxogrammsMaxPage} setPage={this.onPageChange.bind(this)}/>
				<Div hidden={this.state.selectedElement === null}>
	        <Row>
						<h4 style={{marginLeft: 20, fontWeight: 'bold'}}>Расшифровка факсограммы</h4>
	          <Col md={8}>
							<FaxogrammOperationInfoTable noFilter={true} data={faxogramm.technical_operations || []}/>
	          </Col>
	          <Col md={4}>
							<FaxogrammInfoTable noFilter={true} data={faxogrammInfoData}/>
	          </Col>
	        </Row>
				</Div>
			</div>
		);
	}
}

export default connectToStores(FaxogrammDirectory, ['objects']);
