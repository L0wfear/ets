import React, { Component } from 'react';
import { Link } from 'react-router';
import Table from '../ui/table/DataTable.jsx';
import FilterModal from '../ui/table/filter/FilterModal.jsx';
import FilterButton from '../ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import {makeDate, makeTime} from '../../utils/dates.js';
import moment from 'moment';
import cx from 'classnames';
import ClickOutHandler from 'react-onclickout';
import connectToStores from 'flummox/connect';
import { getModelById, getModels } from '../../models.js';
import FuelRateFormWrap from './FuelRateFormWrap.jsx';

let getOperationById = () => {};

let tableMeta = {
	cols: [
		{
			name: 'order_date',
			caption: 'Дата приказа',
			type: 'date',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'operation_id',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (operation_id) => getOperationById(operation_id).NAME,
      }
		},
		{
			name: 'summer_rate',
			caption: 'Норма для летнего периода',
			type: 'number',
		},
    {
			name: 'winter_rate',
			caption: 'Норма для зимнего периода',
			type: 'number',
		},
		{
			name: 'car_model_id',
			caption: 'Марка шасси',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (d) => getModelById(d).title,
      }
		},
		// {
		// 	name: 'gov_number',
		// 	caption: 'Гос. номер транспортного средства',
		// 	type: 'number',
    //   filter: {
    //     type: 'select',
    //     //labelFunction: (d) => getModelById(d).title,
    //   }
		// }
	]
};

let FuelRatesTable = (props) => {

    const renderers = {
      operation_id: ({data}) => {
        const operations = props.getOperations();
        const operation = _.find(operations, op => op.ID === data) || { NAME: '' };
        return <div>{operation.NAME}</div>;
      },
      car_model_id: ({data}) => <div>{getModelById(data).title}</div>,
      order_date: ({data}) => <div>{moment(data).format('YYYY-MM-DD')}</div>
    };

		return <Table results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class FuelRatesDirectory extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedFuelRate: null,
			filterModalIsOpen: false,
			filterValues: {},
      showForm: false,
		};
	}

	selectFuelRate({props}) {
		const id = props.data.id;
		let fuelRate = _.find(this.props.rates, r => r.id === id) || null;

		this.setState({
			selectedFuelRate: fuelRate
		})
	}

	createRate() {
		this.setState({
			showForm: true,
			selectedFuelRate: null
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
		})
	}

	componentDidMount() {
    const { flux } = this.context;
    flux.getActions('fuel-rates').getFuelOperations().then( (operations) => {
      flux.getActions('fuel-rates').getFuelRates();
      // very bad
      getOperationById = (operation_id) => _.find(operations.result, op => {
        return op.ID === operation_id
      });
    });
	}

	componentWillReceiveProps(){
	}

  updateFuelRate(formState) {
    const { flux } = this.context;
		console.log(formState)
    flux.getActions('fuel-rates').updateFuelRate(formState);
		this.setState({selectedFuelRate: null});
  }

	deleteFuelRate() {
    const { flux } = this.context;
		if (confirm('Вы уверены, что хотите удалить запись?')) {
			flux.getActions('fuel-rates').deleteFuelRate(this.state.selectedFuelRate);
			this.setState({selectedFuelRate: null});
		}
	}

	showFuelRate() {
		this.setState({ showForm: true });
	}

  addFuelRate(newRate) {
    const { flux } = this.context;
    flux.getActions('fuel-rates').addFuelRate(newRate);
		this.setState({selectedFuelRate: null});
  }

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
		this.setState({filterValues});
	}

	render() {

		const { rates = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Нормы расхода топлива
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => { if (this.state.filterModalIsOpen) { this.setState({filterModalIsOpen: false}) }}}>
							<FilterButton direction={'right'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 values={this.state.filterValues}
													 direction={'left'}
													 tableMeta={tableMeta}
                           tableData={rates}/>
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.createRate.bind(this)}><Glyphicon glyph="plus" /> Добавить</Button>
						<Button bsSize="small" onClick={this.showFuelRate.bind(this)} disabled={this.state.selectedFuelRate === null}><Glyphicon glyph="pencil" /> Изменить</Button>
						<Button bsSize="small" disabled={this.state.selectedFuelRate === null} onClick={this.deleteFuelRate.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>

        <FuelRatesTable data={rates} filter={this.state.filterValues} getOperations={(id) => this.props.operations} onRowSelected={this.selectFuelRate.bind(this)} selected={this.state.selectedFuelRate} selectField={'id'}/>
        <FuelRateFormWrap onFormHide={this.onFormHide.bind(this)}
  												showForm={this.state.showForm}
  												fuelRate={this.state.selectedFuelRate}
                          operations={this.props.operations}
                          models={getModels()}
                          updateFuelRate={this.updateFuelRate.bind(this)}
                          addFuelRate={this.addFuelRate.bind(this)}/>
			</div>
		);
	}
}



FuelRatesDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(FuelRatesDirectory, ['fuel-rates']);

export default Wrapped;
