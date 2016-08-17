import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import moment from 'moment';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';
import _ from 'lodash';

class RouteForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
      ROUTE_TYPE_OPTIONS: [
				{value: 'vector', label: 'Вручную'},
				{value: 'simple', label: 'Выбор из ОДХ'},
				{value: 'simple_dt', label: 'Выбор из ДТ'},
				{value: 'points', label: 'Выбор пунктов назначения'}
			],
      routeTypeDisabled: true
		};
	}

	handleTypeChange(v) {
		this.handleChange('type', v);
		this.props.resetState();
	}

	setRouteTypeOptionsBasedOnTechnicalOperation(technical_operation_id, technicalOperationsList = this.props.technicalOperationsList, routeTypeValue = null, resetState = true) {
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
		this.props.fromMission && this.handleTypeChange(routeTypeValue);
    this.props.handleFormChange('type', routeTypeValue);
		resetState && this.props.resetState();
	}

  handleTechChange(v) {
    this.handleChange('technical_operation_id', v);
		if (!this.props.formState.copy) {
			this.setRouteTypeOptionsBasedOnTechnicalOperation(v);
		}
  }

	async getTechnicalOperationsByType(type) {
		let { flux } = this.context;

		let technicalOperationsList = await flux.getActions('technicalOperation').getTechnicalOperationsByObjectsType(type);
		this.setState({technicalOperationsList});
	}

	async componentDidMount() {
		let { flux } = this.context;
		let { formState } = this.props;
		let technicalOperationsResponse = await flux.getActions('technicalOperation').getTechnicalOperations();
		let technicalOperationsList = technicalOperationsResponse.result;

		if (formState.technical_operation_id && !formState.copy) {
			this.setRouteTypeOptionsBasedOnTechnicalOperation(formState.technical_operation_id, technicalOperationsList, formState.type, false);
		}

		let getObjectIdByType = (type) => {
			return type === 'points' ? 3 : type === 'simple_dt' ? 2 : 1;
		}

		// this.getTechnicalOperationsByType(formState.type);
		if (formState.copy) {
			technicalOperationsList = technicalOperationsList.filter(to => {
				return to.objects.find(o => o.id === getObjectIdByType(formState.type));
			});
		}

		this.setState({technicalOperationsList});
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
		let { ROUTE_TYPE_OPTIONS, technicalOperationsList = [] } = this.state;
    let TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));

		return (
			<Modal {...this.props} bsSize="large" backdrop="static">

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
										onChange={this.handleTechChange.bind(this)}
										disabled={this.props.fromMission}
										clearable={false}
										error={errors['technical_operation_id']}/>
	            </Col>
						</Div>

						<Div hidden={this.props.forceRouteType}>
							<Col md={4}>
								<Field type="select" label="Способ построения маршрута"
									options={ROUTE_TYPE_OPTIONS}
									value={state.type}
									clearable={false}
									disabled={this.state.routeTypeDisabled || !!state.id || state.copy}
									onChange={this.handleTypeChange.bind(this)}/>
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

export default connectToStores(RouteForm, ['objects']);
