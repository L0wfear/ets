import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';

class RouteForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
			manualCreating: 1,
		};
	}

	handleTypeChange(v) {
		console.log(v);
		this.handleChange('type', v);
		this.props.resetState();
	}

	render() {

		let state = this.props.formState;
		let { techOperationsList = [] } = this.props;
		let ROUTE_TYPE_OPTIONS = [{value: 'vector', label: 'Вручную'}, {value: 'simple', label: 'Выбор из ОДХ'}, {value: 'points', label: 'Выбор пунктов назначения'}];

    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));

    console.log('form state is ', state);

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Создание нового маршрута</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

          <Row>
            <Col md={4}>
              <Field type="string" label="Название маршрута" value={state.name} onChange={this.handleChange.bind(this, 'name')} />
            </Col>

						<Div hidden={this.props.forceTechnicalOperation}>
							<Col md={4}>
								<Field type="select" label="Технологическая операция"
											 options={TECH_OPERATIONS}
											 value={state.technical_operation_id}
											 onChange={this.handleChange.bind(this, 'technical_operation_id')}/>
	            </Col>
						</Div>

						<Div hidden={this.props.forceRouteType}>
							<Col md={4}>
								<Field type="select" label="Способ построения маршрута"
											 options={ROUTE_TYPE_OPTIONS}
											 value={state.type}
											 clearable={false}
											 onChange={this.handleTypeChange.bind(this)}/>
	            </Col>
						</Div>
          </Row>


          <Row className={'routes-form-map-wrapper'}>
            <Col md={12}>
							<Div hidden={state.type !== 'simple'}>
              	<RouteCreating route={state} onChange={this.handleChange.bind(this)}/>
							</Div>
							<Div hidden={state.type !== 'vector' && state.type !== 'points'}>
              	<RouteCreating route={state} manual={true} onChange={this.handleChange.bind(this)}/>
							</Div>
							<Div hidden={state.type !== 'multiselect'}>
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
