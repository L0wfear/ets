import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import FormWrap from '../ui/form/FormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

let getWorkKindById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getWorkKindById(id);
};

let getWorkKindOptions = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getWorkKindById(id);
};

let getTableMeta = (props) => {
  let tableMeta = {
  	cols: [
  		{
  			name: 'work_kind_id',
  			caption: 'Вид работ',
  			type: 'number',
        filter: {
          type: 'select',
          labelFunction: (id) => getWorkKindById(id).name || id,
        },
        form: {
          required: true,
          editable: false,
          formType: 'select',
          formSelectOptions: (op) => props.workKindsList.map( ({id, name}) => ({value: id, label: name})),
        }
  		},
  		{
  			name: 'name',
  			caption: 'Наименование',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
        form: {
          required: true,
          editable: false,
          formType: 'string',
        }
  		},
  	]
  };

  return tableMeta;
}



let TechOperationsTable = (props) => {

    const renderers = {
      work_kind_id: ({data}) => <div>{getWorkKindById(data).name || data}</div>,
    };

		return <Table title="Реестр технологических операций"
                  results={props.data}
									tableMeta={getTableMeta(props)}
                  renderers={renderers}
                  initialSort={'work_kind_id'}
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

	selectTechOperation({props}) {
		const id = props.data.id;
		let selectedTechOperation = _.find(this.props.techOperationsList, to => to.id === id) || null;
		this.setState({selectedTechOperation});
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
        <TechOperationsTable data={techOperationsList} onRowSelected={this.selectTechOperation.bind(this)} selected={this.state.selectedTechOperation} selectField={'id'} {...this.props}>
          <Button bsSize="small" onClick={() => this.setState({ showForm: true })} disabled={this.state.selectedTechOperation === null}> Просмотреть</Button>
        </TechOperationsTable>
        <FormWrap tableMeta={getTableMeta(this.props)}
                  showForm={this.state.showForm}
                  onFormHide={() => this.setState({showForm: false})}
                  element={this.state.selectedTechOperation}
                  title={'Технологическая операция'} />
			</div>
		);
	}
}

TechOperationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(TechOperationsDirectory, ['objects']);

export default Wrapped;
