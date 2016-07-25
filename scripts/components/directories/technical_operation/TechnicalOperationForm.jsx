import React, {Component} from 'react';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';

let seasonsList = [{id: 1, name: 'Лето'}, {id: 2, name: 'Зима'}, {id: 3, name: 'Всесезон'}];

@connectToStores(['objects', 'employees', 'missions', 'routes'])
export default class TechnicalOperationForm extends Form {

	constructor(props) {
		super(props);
	}

  handleCarFuncTypesChange(v) {
    let data = v.split(',');
    let { typesList = [] } = this.props;
    let types = typesList.filter(ct => data.indexOf(ct.id.toString()) > -1);
    this.props.handleFormChange('car_func_types', types);
  }

	handleObjectsChange(v) {
		let data = v.split(',');
		let objects = this.props.technicalOperationsObjectsList.filter(obj => {
			return data.indexOf(obj.id.toString()) > -1;
		});
		this.props.handleFormChange('objects', objects);
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTypes();
		flux.getActions('technicalOperation').getTechnicalOperationsObjects();
		flux.getActions('technicalOperation').getTechnicalOperationsTypes();
	}

	render() {

		let state = this.props.formState;
		let errors = this.props.formErrors;
    let title = 'Тех. операция';
    let { workKindsList = [], typesList = [], technicalOperationsObjectsList = [], technicalOperationsTypesList = [], } = this.props;

    let WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    let SEASONS = seasonsList.map(({id, name}) => ({value: id, label: name}));
    let CAR_TYPES = typesList.map(({id, full_name}) => ({value: id, label: full_name}));
    let TECHNICAL_OPERATION_OBJECTS = technicalOperationsObjectsList.map(({id, full_name}) => ({value: id, label: full_name}));
		let NEEDS_BRIGADE_OPTIONS = [{value: 1, label: 'Да'}, {value: 0, label: 'Нет'}];
    let TECHNICAL_OPERATION_TYPES = technicalOperationsTypesList.map(({name, key}) => ({value: key, label: name}));

		return (
			<Modal {...this.props} bsSize="large" backdrop="static">

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

						<Col md={3}>
              <Field type="select" label="Объект"
									multi={true}
									value={state.objects.map(cft => cft.id).join(',')}
									options={TECHNICAL_OPERATION_OBJECTS}
									onChange={this.handleObjectsChange.bind(this)}/>
						</Col>

            <Col md={3}>
              <Field type="select" label="Сезон"
									value={state.season_id}
									options={SEASONS}
									onChange={this.handleChange.bind(this, 'season_id')}
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
						<Col md={2}>
              <Field type="select" label="C участием РКУ"
										 options={NEEDS_BRIGADE_OPTIONS}
                     value={+state.needs_brigade}
                     onChange={this.handleChange.bind(this, 'needs_brigade')}/>
						</Col>
            <Col md={2}>
              <Field type="number" label="Максимальная скорость"
                     value={state.max_speed}
                     onChange={this.handleChange.bind(this, 'max_speed')}
                     error={errors[name]}/>
            </Col>

						<Col md={3}>
              <Field type="select" label="Тип проверки"
										 options={TECHNICAL_OPERATION_TYPES}
                     value={state.check_type}
										 clearable={false}
                     onChange={this.handleChange.bind(this, 'check_type')}/>
						</Col>
						<Col md={2}>
							<Field type="select" label="Учитывать в отчетах"
										 options={NEEDS_BRIGADE_OPTIONS}
										 value={+state.use_in_reports}
										 onChange={this.handleChange.bind(this, 'use_in_reports')}/>
						</Col>
	      	</Row>

          <Row>
						<Col md={3} className="vehicle-types-container">
							<Field type="select" label="Типы ТС"
										 multi={true}
										 value={_.uniq(state.car_func_types.map(cft => cft.id)).join(',')}
										 options={CAR_TYPES}
										 onChange={this.handleCarFuncTypesChange.bind(this)}/>
						</Col>
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
