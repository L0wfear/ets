import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';
import _ from 'lodash';

class RouteForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			manualCreating: 1,
			companyStructureList: [],
      ROUTE_TYPE_OPTIONS: [{value: 'vector', label: 'Вручную'}, {value: 'simple', label: 'Выбор из ОДХ'}, {value: 'simple_dt', label: 'Выбор из ДТ'}, {value: 'points', label: 'Выбор пунктов назначения'}],
      routeTypeDisabled: true
		};
	}

	handleTypeChange(v) {
		this.handleChange('type', v);
		this.props.resetState();
	}

	setRouteTypeOptionsBasedOnTechnicalOperation(technical_operation_id, technicalOperationsList = this.props.technicalOperationsList, routeTypeValue = null) {
		const technicalOperation =_.find(technicalOperationsList, (o) => {
      return o.id === technical_operation_id;
    });

		let route_type_options = [];

    technicalOperation.objects.forEach(function(obj) {
      switch (obj.name) {
        case 'ОДХ':
          route_type_options.push({value: 'vector', label: 'Вручную'});
          route_type_options.push({value: 'simple', label: 'Выбор из ОДХ'});
          !routeTypeValue ? routeTypeValue = 'simple' : null;
          break;
        case 'ПН':
          route_type_options.push({value: 'points', label: 'Выбор пунктов назначения'});
          !routeTypeValue && routeTypeValue !== 'simple' ? routeTypeValue = 'points': null;
          break;
        case 'ДТ':
          route_type_options.push({value: 'simple_dt', label: 'Выбор из ДТ'});
          !routeTypeValue && routeTypeValue !== 'simple' ? routeTypeValue = 'simple_dt': null;
          break;
      }
    });

    this.setState({'ROUTE_TYPE_OPTIONS': route_type_options, 'routeTypeDisabled': routeTypeValue ? false : true});
    this.props.handleFormChange('type', routeTypeValue);
	}

  handleTechChange(t, v) {
    this.handleChange(t, v);
		this.setRouteTypeOptionsBasedOnTechnicalOperation(v);
  }

	async componentDidMount() {
		let { flux } = this.context;
		let technicalOperationsResponse = await flux.getActions('technical_operation').getTechnicalOperations();
		let technicalOperationsList = technicalOperationsResponse.result;

		let companyStructureList = await flux.getActions('company-structure').getLinearCompanyStructureForUser();

		if (this.props.formState.technical_operation_id) {
			this.setRouteTypeOptionsBasedOnTechnicalOperation(this.props.formState.technical_operation_id, technicalOperationsList, this.props.formState.type);
		}

		this.setState({companyStructureList});
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
		let { technicalOperationsList = [] } = this.props;
		let { companyStructureList = [] } = this.state;
		let ROUTE_TYPE_OPTIONS = [{value: 'vector', label: 'Вручную'}, {value: 'simple', label: 'Выбор из ОДХ'}, {value: 'simple_dt', label: 'Выбор из ДТ'}, {value: 'points', label: 'Выбор пунктов назначения'}];
    let TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
		let COMPANY_ELEMENTS = companyStructureList.map(el => ({value: el.id, label: el.name}));

    console.log('form state is ', state);

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Создание нового маршрута</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

          <Row>
            <Col md={4}>
              <Field type="string" label="Название маршрута" value={state.name} onChange={this.handleChange.bind(this, 'name')} error={errors['name']} />
            </Col>

						<Div hidden={this.props.forceTechnicalOperation}>
							<Col md={4}>
								<Field type="select" label="Технологическая операция"
											 options={TECH_OPERATIONS}
											 value={state.technical_operation_id}
											 onChange={this.handleTechChange.bind(this, 'technical_operation_id')}
											 disabled={this.props.fromMission}
                       clearable={false}
											 error={errors['technical_operation_id']}/>
	            </Col>
						</Div>

						<Div hidden={this.props.forceRouteType}>
							<Col md={4}>
								<Field type="select" label="Способ построения маршрута"
											 options={this.state.ROUTE_TYPE_OPTIONS}
											 value={state.type}
											 clearable={false}
                       disabled={this.state.routeTypeDisabled}
											 onChange={this.handleTypeChange.bind(this)}/>
								<Field type="select" label="Подразделение"
											 options={COMPANY_ELEMENTS}
											 value={state.company_structure_id}
											 clearable={false}
											 onChange={this.handleChange.bind(this, 'company_structure_id')}/>
	            </Col>
						</Div>
          </Row>


          <Row className={'routes-form-map-wrapper'}>
            <Col md={12}>
							<Div hidden={state.type !== 'simple' && state.type !== 'simple_dt'}>
              	<RouteCreating route={state} onChange={this.handleChange.bind(this)}/>
							</Div>
							<Div hidden={state.type !== 'vector' && state.type !== 'points'}>
              	<RouteCreating route={state} manual={true} onChange={this.handleChange.bind(this)}/>
							</Div>
            </Col>
          </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

RouteForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(RouteForm, ['objects']);
