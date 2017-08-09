import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import ModalBody from 'components/ui/Modal';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { connectToStores } from 'utils/decorators';
import Div, { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';
import { FileField } from 'components/ui/input/fields';
import {
  TIME_MEASURES_SELECT_OPTIONS,
  SEQUENCE_1_TO_20_SELECT_OPTIONS,
} from 'constants/dictionary';

@loadingOverlay
@connectToStores(['autobase', 'objects'])
export default class TechMaintOrderForm extends Form {
  state = {
    areFilesLoading: false,
  }
  async componentDidMount() {
    const { flux } = this.context;
    const { tech_maintenance_type_id = '' } = this.props.formState;
    flux.getActions('objects').getSpecialModels();
    flux.getActions('autobase').getAutobaseListByType('techMaintType');

    if (tech_maintenance_type_id !== '') {
      this.context.flux.getActions('autobase').getAutobaseListByType('measureUnitRun', {
        tech_maintenance_type_id,
      });
    }
  }
  handleTechMaintTypeChange = (key, value) => {
    if (value !== '') {
      this.context.flux.getActions('autobase').getAutobaseListByType('measureUnitRun', {
        tech_maintenance_type_id: value,
      });
    }

    this.handleChange('measure_unit_run_id', null);
    this.handleChange(key, value);
  }
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      techMaintTypeList = [],
      specialModelsList = [],
      measureUnitRunList = [],
      isPermitted = false,
    } = this.props;

    const TECH_MAINT_TYPE = techMaintTypeList.map(defaultSelectListMapper);
    const VEHICLE_MODELS = specialModelsList.map(defaultSelectListMapper);
    const MEASURE_UNITS_RUN = measureUnitRunList.map(defaultSelectListMapper);

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    const tech_maintenance_type_id = get(state, 'tech_maintenance_type_id', '');

    return (
      <Modal {...this.props} backdrop="static" >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Тип ТО"
                options={TECH_MAINT_TYPE}
                value={state.tech_maintenance_type_id}
                error={errors.tech_maintenance_type_id}
                disabled={!isPermitted}
                onChange={this.handleTechMaintTypeChange}
                boundKeys={['tech_maintenance_type_id']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="select"
                label="Пробег измеряется"
                options={MEASURE_UNITS_RUN}
                value={state.measure_unit_run_id}
                error={errors.measure_unit_run_id}
                disabled={!isPermitted || tech_maintenance_type_id === ''}
                onChange={this.handleChange}
                boundKeys={['measure_unit_run_id']}
              />
            </Col>
            <Col md={12}>
              <ExtDiv hidden={state.is_periodic}>
                <ExtField
                  type="select"
                  label="Последовательность ТО"
                  options={SEQUENCE_1_TO_20_SELECT_OPTIONS}
                  value={state.sequence}
                  error={errors.sequence}
                  disabled={!isPermitted}
                  onChange={this.handleChange}
                  boundKeys={['sequence']}
                />
              </ExtDiv>
            </Col>
            <Col md={12}>
              <ExtField
                type="string"
                label="Описание"
                value={state.description}
                error={errors.description}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['description']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="select"
                label="Модель ТС"
                options={VEHICLE_MODELS}
                value={state.car_model_id}
                error={errors.car_model_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['car_model_id']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="boolean"
                label="Признак периодического ТО"
                value={state.is_periodic}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['is_periodic', !state.is_periodic]}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="number"
                label="Интервал до следующего ТО (по пробегу)"
                error={errors.interval_probeg}
                disabled={!isPermitted}
                value={state.interval_probeg}
                onChange={this.handleChange}
                boundKeys={['interval_probeg']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="number"
                label="Интервал до следующего ТО (по времени)"
                error={errors.interval_time}
                disabled={!isPermitted}
                value={state.interval_time}
                onChange={this.handleChange}
                boundKeys={['interval_time']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="select"
                label="Время измеряется"
                options={TIME_MEASURES_SELECT_OPTIONS}
                value={state.interval_time_type}
                error={errors.interval_time_type}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['interval_time_type']}
              />
            </Col>
            <Col md={12}>
              <FileField
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
