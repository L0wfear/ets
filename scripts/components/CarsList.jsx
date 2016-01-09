import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { getCarsByOwnerId } from '../adapter.js';

let CARS = [];
getCarsByOwnerId().then((response)=> {
	CARS = response
});

let tableCaptions = [
	"Госномер", "Модель", "Тип"
]

let tableCols = [
	'gov_number', 'model', 'type'
]

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
		}
	]
}


export default class CarsList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			filterValues: {},
			filterModalIsOpen: false,
		};
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
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
					</div>
				</div>

				<CarsTable data={data}/>
			</div>
		);
	}
}

let CarsTable = (props) => {

	return <Table tableCaptions={tableCaptions}
								tableCols={tableCols}
								results={props.data} />

}
