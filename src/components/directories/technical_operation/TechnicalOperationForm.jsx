import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

const seasonsList = [{ id: 1, name: 'Лето' }, { id: 2, name: 'Зима' }, { id: 3, name: 'Всесезон' }];

@connectToStores(['objects', 'employees', 'missions', 'routes'])
export default class TechnicalOperationForm extends Form {

  handleCarFuncTypesChange(v) {
    const data = v.split(',');
    const { typesList = [] } = this.props;
    const types = typesList.filter(ct => data.indexOf(ct.id.toString()) > -1);
    this.props.handleFormChange('car_func_types', types);
  }

  handleObjectsChange(v) {
    const data = v.split(',');
    const objects = this.props.technicalOperationsObjectsList.filter((obj) => {
      return data.indexOf(obj.id.toString()) > -1;
    });
    this.props.handleFormChange('objects', objects);
  }
  handleChangeSensorTypeIds = (v) => {
    const sensor_type_ids = v.split(',').map(d => Number(d));
    this.props.handleFormChange('sensor_type_ids', v ? sensor_type_ids : []);
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTypes();
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('technicalOperation').getTechnicalOperationsTypes();
    flux.getActions('objects').getSensorTypes();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const title = 'Тех. операция';
    const {
      workKindsList = [],
      typesList = [],
      technicalOperationsObjectsList = [],
      technicalOperationsTypesList = [],
      isPermitted = false,
    } = this.props;

    const WORK_KINDS = workKindsList.map(({ id, name }) => ({ value: id, label: name }));
    const SEASONS = seasonsList.map(({ id, name }) => ({ value: id, label: name }));
    const CAR_TYPES = typesList.map(({ asuods_id, full_name }) => ({ value: asuods_id, label: full_name }));
    const TECHNICAL_OPERATION_OBJECTS = technicalOperationsObjectsList.map(({ id, full_name }) => ({ value: id, label: full_name }));
    const NEEDS_BRIGADE_OPTIONS = [{ value: 1, label: 'Да' }, { value: 0, label: 'Нет' }];
    const TECHNICAL_OPERATION_TYPES = technicalOperationsTypesList.map(({ name, key }) => ({ value: key, label: name }));
    const SENSORS_TYPE_OPTIONS = this.props.sensorTypesList.map(defaultSelectListMapper);

    return (
      <Modal {...this.props} id="modal-technical-operation" bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={6}>
              <Field type="string" label="Наименование"
                value={state.name}
                onChange={this.handleChange.bind(this, 'name')}
                disabled={!isPermitted}
                error={errors[name]}
              />
            </Col>

            <Col md={3}>
              <Field type="select" label="Объект"
                multi
                value={state.objects.map(cft => cft.id).join(',')}
                options={TECHNICAL_OPERATION_OBJECTS}
                onChange={this.handleObjectsChange.bind(this)}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <Field
                type="select"
                label="Сезон"
                value={state.season_id}
                options={SEASONS}
                onChange={this.handleChange.bind(this, 'season_id')}
                error={errors[name]}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Field type="select" label="Вид работ"
                options={WORK_KINDS}
                value={state.work_kind_id}
                onChange={this.handleChange.bind(this, 'work_kind_id')}
                error={errors[name]}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={2}>
              <Field type="select" label="C участием РКУ"
                options={NEEDS_BRIGADE_OPTIONS}
                value={+state.needs_brigade}
                onChange={this.handleChange.bind(this, 'needs_brigade')}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <Field type="select" label="Тип проверки"
                options={TECHNICAL_OPERATION_TYPES}
                value={state.check_type}
                clearable={false}
                onChange={this.handleChange.bind(this, 'check_type')}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={2}>
              <Field type="select" label="Учитывать в отчетах"
                options={NEEDS_BRIGADE_OPTIONS}
                value={+state.use_in_reports}
                onChange={this.handleChange.bind(this, 'use_in_reports')}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3} className="vehicle-types-container">
              <Field type="select" label="Типы ТС"
                multi
                value={_.uniq(state.car_func_types.map(cft => cft.id)).join(',')}
                options={CAR_TYPES}
                onChange={this.handleCarFuncTypesChange.bind(this)}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3} className="vehicle-types-container">
              <Field
                type="select"
                label="Типы навесного оборудования"
                multi
                value={state.sensor_type_ids.join(',')}
                options={SENSORS_TYPE_OPTIONS}
                onChange={this.handleChangeSensorTypeIds}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button disabled={!isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
