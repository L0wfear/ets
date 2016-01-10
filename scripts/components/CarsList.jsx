import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { getCarsByOwnerId } from '../adapter.js';
import CarFormWrap from './cars/CarFormWrap.jsx';
import ClickOutHandler from 'react-onclickout';

let CARS = [];
getCarsByOwnerId().then((response)=> {
	CARS = response.map( (el, i) => {
		el.garage_number = i % 3 === 0 ? 256 : 128;
		el.state = i % 9 === 0 ? 'Несправно' : 'Исправно';
		return el;
	})
});

let tableCaptions = [
	"Гаражный номер", "Госномер", "Модель", "Тип", "Состояние"
];

let tableCols = [
	'garage_number', 'gov_number', 'model', 'type', 'state'
];

let tableMeta = {
	cols: [
		{
			name: 'garage_number',
			caption: 'Гаражный номер',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
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
			caption: 'Модель',
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
			name: 'state',
			caption: 'Состояние',
			type: 'text',
			filter: {
				type: 'select',
			}
		}
	]
}


export default class CarsList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			filterValues: {},
			filterModalIsOpen: false,
			selectedCar: null,
			showForm: false,
		};
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	selectCar({props}) {
		const id = props.data.id;
		let car = _.find(CARS, c => c.id === id);//getCarById(id);

		this.setState({
			selectedCar: car
		});
	}

	editCar() {
		this.setState({showForm: true});
	}

	onFormHide() {
		this.setState({showForm: false});
	}

	render() {

		console.log(CARS);
		const data = _.filter(CARS, (obj) => {
			let isValid = true;

			_.mapKeys(this.state.filterValues, (value, key) => {

				if (typeof value.getMonth === 'function') {
					if (obj[key] !== moment(value).format('YYYY-MM-DD H:mm')) {
						isValid = false;
					}
				} else {
					if (obj[key] != value) {
						isValid = false;
					}
				}
			});

			return isValid;
		});

		return (
			<div className="ets-page-wrap">

				<div className="some-header"> Реестр транспорта "Жилищник Крылатское"
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => this.setState({filterModalIsOpen: false})}>
							<FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 cols={tableCols}
													 captions={tableCaptions}
													 values={this.state.filterValues}
													 direction={'left'}
													 tableMeta={tableMeta}
													 tableData={CARS}/>
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.editCar.bind(this)} disabled={this.state.selectedCar === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
					</div>
				</div>

				<CarsTable data={data} onRowSelected={this.selectCar.bind(this)} selected={this.state.selectedCar} selectField={'id'}/>
				<CarFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												car={this.state.selectedCar}/>
			</div>
		);
	}
}

let CarsTable = (props) => {

	return <Table tableCaptions={tableCaptions}
								tableCols={tableCols}
								results={props.data}
								{...props} />

}
