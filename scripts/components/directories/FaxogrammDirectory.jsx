import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import ElementsList from '../ElementsList.jsx';
import Paginator from '../ui/Paginator.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';


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
			},
      // {
			// 	name: 'order_status_name',
			// 	caption: 'Статус',
			// 	type: 'string',
			// 	filter: {
			// 		type: 'select'
			// 	},
			// },
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
		};

		return <Table title="Реестр факсограмм"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
                  serverPagination={true}
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
    };
	}

  init() {
    const { flux } = this.context;
    flux.getActions('objects').getFaxogramms(0);
  }

  componentDidMount() {
    this.init();
	}

  onPageChange(page) {
    console.log(page);
    this.setState({page});
    this.context.flux.getActions('objects').getFaxogramms(page);
  }

	render() {

		const { faxogrammsList = [], faxogrammsMaxPage } = this.props;
    console.log(faxogrammsList.map(f => f.id).sort());
		let faxogrammInfoData = [];
		let faxogramm = this.state.selectedElement || {};
		if (faxogramm.technical_operations) {
			faxogrammInfoData = [{id: 0, order_info: faxogramm.order_info}];
		}

		return (
			<div className="ets-page-wrap">

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
