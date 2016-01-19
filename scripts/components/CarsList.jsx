import React, { Component } from 'react';
import { Link } from 'react-router';
import connectToStores from 'flummox/connect';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import CarFormWrap from './cars/CarFormWrap.jsx';
import ClickOutHandler from 'react-onclickout';

// function createFakeMissingCarData(types, el, i) {
// 	el.type = _.find(types, t => t.id === el.type_id).title;
// 	return el;
// }

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
			}
		},
		{
			name: 'fuel_correction_rate',
			caption: 'Поправочный коэффициент',
			type: 'number',
			filter: {
				type: 'select',
			}
		}
	]
}

let CarsTable = (props) => {

	const renderers = {
		condition: ({data}) => <div>{getCondition(data)}</div>,
		fuel_correction_rate: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>
	};

	return <Table tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class CarsList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			filterValues: {},
			filterModalIsOpen: false,
			selectedCar: null,
			showForm: false,
			carsList: [],
			typesList: [],
		};
	}

	saveFilter(filterValues) {
		//console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
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
	}

	render() {

		const { carsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">

				<div className="some-header"> Реестр транспорта "Жилищник Крылатское"
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => { if (this.state.filterModalIsOpen) { this.setState({filterModalIsOpen: false}) }}}>
							<FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 values={this.state.filterValues}
													 direction={'left'}
													 tableMeta={tableMeta}
													 tableData={carsList}/>
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.editCar.bind(this)} disabled={this.state.selectedCar === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
					</div>
				</div>

				<CarsTable data={carsList} filter={this.state.filterValues} onRowSelected={this.selectCar.bind(this)} selected={this.state.selectedCar} selectField={'asuods_id'}/>
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
