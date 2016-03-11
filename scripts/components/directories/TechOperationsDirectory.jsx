import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import TechOperationFormWrap from './tech_operation/TechOperationFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from '../ElementsList.jsx';
import Field from '../ui/Field.jsx';

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
  			name: 'work_kind_name',
  			caption: 'Вид работ',
  			type: 'number',
        filter: {
          type: 'select',
        },
        form: {
          required: true,
          editable: false,
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
  		{
  			name: 'season_name',
  			caption: 'Сезон',
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
  		{
  			name: 'max_speed',
  			caption: 'Максимальная скорость',
  			type: 'number',
  			filter: {
  				type: 'select',
  			},
        form: {
          required: true,
          editable: false,
          formType: 'number',
        }
  		},
  		{
  			name: 'check_type_name',
  			caption: 'Тип проверки',
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
  		{
  			name: 'car_func_types',
  			caption: 'Типы ТС',
  			type: 'select2',
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

let PROPS = null; // todo remove

let TechOperationsTable = (props) => {

    PROPS = props;

    let getCarFuncTypesOptions = () => {
      let OPTIONS = PROPS.carFuncTypesList.map(({id, full_name}) => ({value: id, label: full_name}));
      return OPTIONS;
    };

    const renderers = {
      work_kind_id: ({data}) => <div>{getWorkKindById(data).name || data}</div>,
      car_func_types: ({data}) => {
        let OPTIONS = getCarFuncTypesOptions();
        let values = data.map(d => d.id).join(',');
        let dataAsString = data.map(d => d.name).join(', ');
        return <div>{dataAsString}</div>;
        //не уверен
        return <div>
        <Field type="select"
               multi={true}
               className="car-func-types-container"
               options={OPTIONS}
               value={values}
               disabled={true}/></div>;
      },
    };

		return <Table title="Реестр технологических операций"
                  results={props.data}
									tableMeta={getTableMeta(props)}
                  renderers={renderers}
                  initialSort={'id'}
									{...props}/>
}

class TechOperationsDirectory extends ElementsList {


	constructor(props) {
		super(props);

		this.state = {
			selectedElement: null,
			filterModalIsOpen: false,
			filterValues: {},
      showForm: false,
		};

    this.mainListName = 'techOperationsList';
	}

	componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
    flux.getActions('objects').getCarFuncTypes();
	}

	render() {
    const { techOperationsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <TechOperationsTable data={techOperationsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
          <Button bsSize="small" onClick={() => this.setState({ showForm: true })} disabled={this.state.selectedElement === null}> Изменить</Button>
        </TechOperationsTable>
        <TechOperationFormWrap showForm={this.state.showForm} onFormHide={this.onFormHide.bind(this)} element={this.state.selectedElement}/>

        {/*<FormWrap tableMeta={getTableMeta(this.props)}
                  showForm={this.state.showForm}
                  onFormHide={() => this.setState({showForm: false})}
                  element={this.state.selectedTechOperation}
                  title={'Технологическая операция'} />*/}
			</div>
		);
	}
}

TechOperationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(TechOperationsDirectory, ['objects']);

export default Wrapped;
