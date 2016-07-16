import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import TechOperationFormWrap from './TechOperationFormWrap.jsx';
import { Button, Glyphicon, Input } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from 'components/ElementsList.jsx';
import Field from 'components/ui/Field.jsx';

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

  let CAR_TYPES = props.typesList.map(({id, full_name}) => ({value: id, label: full_name}));
  let OBJECT = [
    {
      value: 1,
      label: "ОДХ"
    },
    {
      value: 2,
      label: "ДТ"
    },
    {
      value: 3,
      label: "ПН"
    }
  ];

  let tableMeta = {
  	cols: [
  		{
  			name: 'work_kind_name',
  			caption: 'Вид работ',
  			type: 'number',
        filter: {
          type: 'select',
        },
  		},
  		{
  			name: 'name',
  			caption: 'Наименование',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'season_name',
  			caption: 'Сезон',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
        cssClassName: 'width80'
  		},
  		{
  			name: 'max_speed',
  			caption: 'Максимальная скорость',
  			type: 'number',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'check_type_name',
  			caption: 'Тип проверки',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
  		},
  		{
  			name: 'objects',
  			caption: 'Объект',
  			type: 'string',
  			filter: {
  				type: 'multiselect',
          options: OBJECT,
          strict: true
  			},
        cssClassName: 'width60'
  		},
  		{
  			name: 'needs_brigade',
  			caption: 'С участием РКУ',
  			type: 'boolean',
  			filter: {
  				type: 'select',
          labelFunction: (data) => data ? 'Да' : 'Нет'
  			},
  		},
      {
  			name: 'use_in_reports',
  			caption: 'Учет в отчетах',
  			type: 'boolean',
  			filter: {
  				type: 'select',
          labelFunction: (data) => data ? 'Да' : 'Нет'
  			},
  		},
  		{
  			name: 'car_func_types',
  			caption: 'Типы ТС',
  			type: 'string',
  			filter: {
					type: 'multiselect',
					options: CAR_TYPES,
  			},
  		},
  	]
  };

  return tableMeta;
}

let PROPS = null; // todo remove

let TechOperationsTable = (props) => {

    PROPS = props;

    let getCarFuncTypesOptions = () => {
      let OPTIONS = PROPS.typesList.map(({id, full_name}) => ({value: id, label: full_name}));
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
        return (
          <div>
            <Field type="select"
                   multi={true}
                   className="car-func-types-container"
                   options={OPTIONS}
                   value={values}
                   disabled={true}/>
          </div>
        );
      },
      objects: ({data}) => {
        let OBJECT = [
          {
            value: 1,
            label: "ОДХ"
          },
          {
            value: 2,
            label: "ДТ"
          },
          {
            value: 3,
            label: "ПН"
          }
        ];
        let values = data.map(d => d.id).join(',');
        let dataAsString = data.map(d => d.name).join(', ');
        return <div>{dataAsString}</div>;
      },
      needs_brigade: ({data}) => <input type="checkbox" disabled checked={!!data}/>,
      use_in_reports: ({data}) => <input type="checkbox" disabled checked={!!data}/>,
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

    this.mainListName = 'technicalOperationsList';
	}

	componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('objects').getTypes();
	}

	render() {
    const { technicalOperationsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <TechOperationsTable data={technicalOperationsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
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
