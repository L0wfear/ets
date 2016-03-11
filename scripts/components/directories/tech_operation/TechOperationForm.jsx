import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Datepicker from '../../ui/DatePicker.jsx';
import Field from '../../ui/Field.jsx';
import Div from '../../ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';
import Form from '../../compositions/Form.jsx';

let seasonsList = [{id: 1, name: 'Лето'},{id: 2, name: 'Зима'},{id: 3, name: 'Всесезон'}]

export class MissionForm extends Form {

	constructor(props) {
		super(props);

		this.state = {
		};
	}

  handleCarFuncTypesChange(v) {
    let data = v.split(',');
    let { carFuncTypesList = [] } = this.props;
    let carFuncTypes = carFuncTypesList.filter(cft => data.indexOf(cft.id.toString()) > -1);
    this.props.handleFormChange('car_func_types', carFuncTypes);
  }

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
    let title = 'Тех. операция';
    let { workKindsList = [], carFuncTypesList = [] } = this.props;
    let WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    let SEASONS = seasonsList.map(({id, name}) => ({value: id, label: name}));
    let CAR_FUNC_TYPES = carFuncTypesList.map(({id, full_name}) => ({value: id, label: full_name}));
    console.log(state);

		return (
			<Modal {...this.props} bsSize="large">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>

	      	<Row>
            <Col md={6}>
              <Field type="string" label="Наименование"
                     value={state.name}
                     onChange={this.handleChange.bind(this, 'name')}
                     error={errors[name]}/>
            </Col>
	      	</Row>

          <Row>
            <Col md={3}>
              <Field type="select" label="Вид работ"
                     options={WORK_KINDS}
                     value={state.work_kind_id}
                     onChange={this.handleChange.bind(this, 'work_kind_id')}
                     error={errors[name]}/>
            </Col>
            <Col md={3}>
              <Field type="select" label="Сезон"
                     value={state.season_id}
                     options={SEASONS}
                     onChange={this.handleChange.bind(this, 'season_id')}
                     error={errors[name]}/>
            </Col>
            <Col md={2}>
              <Field type="number" label="Максимальная скорость"
                     value={state.max_speed}
                     onChange={this.handleChange.bind(this, 'max_speed')}
                     error={errors[name]}/>
            </Col>
            <Col md={4}>
              <Field type="select" label="Типы ТС"
                     multi={true}
                     value={state.car_func_types.map(cft => cft.id).join(',')}
                     options={CAR_FUNC_TYPES}
                     onChange={this.handleCarFuncTypesChange.bind(this)}/>
            </Col>
	      	</Row>

          <Row>

          </Row>

	      </Modal.Body>

	      <Modal.Footer>
					<Div className="inline-block">
		      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
					</Div>
	      </Modal.Footer>
			</Modal>
		)
	}
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes']);
