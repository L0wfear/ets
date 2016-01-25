import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

let getWorkKindById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getWorkKindById(id);
};

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Наименование',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'work_kind_id',
			caption: 'Вид работ',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (id) => getWorkKindById(id).name || id,
      }
		},
	]
};

let TechOperationsTable = (props) => {

    const renderers = {
      work_kind_id: ({data}) => <div>{getWorkKindById(data).name || data}</div>,
    };

		return <Table title="Реестр технологических операций"
                  results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class TechOperationsDirectory extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedTechOperation: null,
			filterModalIsOpen: false,
			filterValues: {},
      showForm: false,
		};
	}

	selectFuelRate({props}) {
		const id = props.data.id;
		let fuelRate = _.find(this.props.rates, r => r.id === id) || null;

		this.setState({
			selectedTechOperation: fuelRate
		})
	}


	componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
	}

	render() {
    const { techOperationsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <TechOperationsTable data={techOperationsList} selected={this.state.selectedTechOperation} selectField={'id'}>
        </TechOperationsTable>
			</div>
		);
	}
}

TechOperationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(TechOperationsDirectory, ['objects']);

export default Wrapped;
