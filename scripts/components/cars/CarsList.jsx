import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import CarFormWrap from './CarFormWrap.jsx';

let getCondition = (data) => {
	return parseInt(data) > 0 ? 'Исправно' : 'Неисправно';
};

let tableMeta = {
	cols: [
		{
			name: 'gov_number',
			caption: 'Госномер',
			type: 'text',
			filter: {
				type: 'text',
			}
		},
		{
			name: 'model',
			caption: 'Марка шасси',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'type',
			caption: 'Тип',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'condition',
			caption: 'Состояние',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'garage_number',
			caption: 'Гаражный номер',
			type: 'text',
			filter: {
				type: 'select',
			},
			form: {
				required: true,
				editable: true,
				//valueFunction: '',
			}
		},
		{
			name: 'fuel_correction_rate',
			caption: 'Поправочный коэффициент',
			type: 'number',
			filter: {
				type: 'select',
			},
			form: {
				required: true,
				editable: true,
				//valueFunction: '',
			}
		}
	]
}

let CarsTable = (props) => {

	const renderers = {
		condition: ({data}) => <div>{getCondition(data)}</div>,
		fuel_correction_rate: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
		garage_number: ({data}) => <div>{data && data !== 'null' ? data : ''}</div>
	};

	return <Table title='Реестр транспорта "Жилищник Крылатское"'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class CarsList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedCar: null,
			showForm: false,
		};
	}

	selectCar({props}) {
		const id = props.data.asuods_id;
		let car = _.find(this.props.carsList, c => c.asuods_id === id);//getCarById(id);

		this.setState({
			selectedCar: car
		});
	}

	editCar() {
		this.setState({showForm: true});
	}

	onFormHide() {
		this.setState({showForm: false, selectedCar: null});
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('objects').getCars();
		flux.getActions('objects').getOwners();
	}

	render() {

		const { carsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<CarsTable data={carsList} onRowSelected={this.selectCar.bind(this)} selected={this.state.selectedCar} selectField={'asuods_id'}>
					<Button bsSize="small" onClick={this.editCar.bind(this)} disabled={this.state.selectedCar === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
				</CarsTable>
				<CarFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												car={this.state.selectedCar}/>
			</div>
		);
	}
}

CarsList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(CarsList, ['objects']);
