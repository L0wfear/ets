import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import FuelOperationFormWrap from './FuelOperationFormWrap.jsx';

let getOperationById = () => {};

let getModelById = (id) =>  {
	let { flux } = window.__ETS_CONTAINER__;
	let { modelsIndex } = flux.getStore('objects').state;
	return modelsIndex[id] || {};
};

let tableMeta = {
	cols: [
		{
			name: 'NAME',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
      }
		}
	]
};

let FuelOperationsTable = (props) => {

    const renderers = {
      operation_id: ({data}) => {
        const operations = props.getOperations();
        const operation = _.find(operations, op => op.ID === data) || { NAME: '' };
        return <div>{operation.NAME}</div>;
      }
    };

		return <Table title='Операции для расчета топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class FuelOperationsDirectory extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedFuelOperation: null,
			filterModalIsOpen: false,
			filterValues: {},
      showForm: false,
		};
	}

	selectFuelOperation({props}) {
		const id = props.data.ID;
		let fuelOperation = _.find(this.props.operations, r => r.ID === id) || null;

		this.setState({
			selectedFuelOperation: fuelOperation
		})
	}

	createRate() {
		this.setState({
			showForm: true,
			selectedFuelOperation: null
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedFuelOperation: null
		})
	}

	componentDidMount() {
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('fuel-rates').getFuelOperations();
	}

	deleteFuelOperation() {
    const { flux } = this.context;
		if (confirm('Вы уверены, что хотите удалить запись?')) {
			flux.getActions('fuel-rates').deleteFuelOperation(this.state.selectedFuelOperation);
			this.setState({selectedFuelOperation: null});
		}
	}

	showFuelOperation() {
		this.setState({ showForm: true });
	}

	render() {

		const { operations = [], modelsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <FuelOperationsTable data={operations} getOperations={(id) => this.props.operations} onRowSelected={this.selectFuelOperation.bind(this)} selected={this.state.selectedFuelOperation} selectField={'ID'}>
					<Button bsSize="small" onClick={this.createRate.bind(this)}><Glyphicon glyph="plus" /> Добавить</Button>
					<Button bsSize="small" onClick={this.showFuelOperation.bind(this)} disabled={this.state.selectedFuelOperation === null}><Glyphicon glyph="pencil" /> Изменить</Button>
					<Button bsSize="small" disabled={this.state.selectedFuelOperation === null} onClick={this.deleteFuelOperation.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</FuelOperationsTable>
        <FuelOperationFormWrap onFormHide={this.onFormHide.bind(this)}
						showForm={this.state.showForm}
						fuelOperation={this.state.selectedFuelOperation} />
			</div>
		);
	}
}



FuelOperationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(FuelOperationsDirectory, ['fuel-rates', 'objects']);

export default Wrapped;
