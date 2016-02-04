import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import moment from 'moment';
import RouteCreating from './RouteCreating.jsx';

class Form extends Component {

	constructor(props) {
		super(props);

		this.state = {
			manualCreating: 1,
		};
	}

	handleChange(field, e) {
		this.props.handleFormChange(field, e);
	}

  handleSubmit() {
    console.log('submitting route form', this.props.formState);
    this.props.onSubmit(this.props.formState, this.state.manualCreating);
  }

	componentDidMount() {
	}

	handleManualCreatingChange() {
		this.setState({manualCreating: +(!!!this.state.manualCreating)});
		this.props.resetState();
	}

	render() {

		let state = this.props.formState;
		let { techOperationsList = [] } = this.props;
		let CREATE_OPTIONS = [{value: 1, label: 'Вручную'}, {value: 0, label: 'Выбор из ОДХ'}];

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

						<Col md={4}>
							<Field type="select" label="Технологическая операция"
										 options={TECH_OPERATIONS}
										 value={state.technical_operation_id}
										 onChange={this.handleChange.bind(this, 'technical_operation_id')}/>
            </Col>

						<Col md={4}>
							<Field type="select" label="Способ построения маршрута"
										 options={CREATE_OPTIONS}
										 value={this.state.manualCreating}
										 onChange={this.handleManualCreatingChange.bind(this)}/>
            </Col>
          </Row>


          <Row className={'routes-form-map-wrapper'}>
            <Col md={12}>
							<Div hidden={this.state.manualCreating}>
              	<RouteCreating route={state} onChange={this.handleChange.bind(this)}/>
							</Div>
							<Div hidden={!this.state.manualCreating}>
              	<RouteCreating route={state} manual={true} onChange={this.handleChange.bind(this)}/>
							</Div>
            </Col>
          </Row>

	      </Modal.Body>

	      <Modal.Footer>
	      	<Button disabled={this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
	      </Modal.Footer>

			</Modal>
		)
	}
}

Form.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(Form, ['objects']);
