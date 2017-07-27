import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div, { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase', 'objects'])
export default class TechMaintForm extends Form {
  async componentDidMount() {
    const { flux } = this.context;
    const { tech_maintenance_type_id = '' } = this.props.formState;
    flux.getActions('autobase').getAutobaseListByType('repairCompany');
    flux.getActions('autobase').getAutobaseListByType('techMaintOrder');

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
      repairCompanyList = [],
      techMaintOrderList = [],
      isPermitted = false,
    } = this.props;

    const REPAIR_COMPANIES = repairCompanyList.map(defaultSelectListMapper);
    const TECH_MAINT_ORDERS = techMaintOrderList.map(defaultSelectListMapper);

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Исполнитель ремонта"
                options={REPAIR_COMPANIES}
                value={state.company_id}
                error={errors.company_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['company_id']}
              />
            </Col>
            <Col md={12}>
              <ExtDiv hidden={false}>
                <ExtField
                  type="select"
                  label="Регламент ТО"
                  options={TECH_MAINT_ORDERS}
                  value={state.tech_maintenance_order_id}
                  error={errors.tech_maintenance_order_id}
                  disabled={!isPermitted}
                  onChange={this.handleChange}
                  boundKeys={['tech_maintenance_order_id']}
                />
              </ExtDiv>
            </Col>
            <Col md={12}>
              <ExtField
                type="string"
                label="Номер документа"
                value={state.number}
                error={errors.number}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['number']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="date"
                time={false}
                label="Плановая дата начала"
                date={state.plan_date_start}
                error={errors.plan_date_start}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="date"
                time={false}
                label="Плановая дата окончания"
                date={state.plan_date_end}
                error={errors.plan_date_end}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['plan_date_end']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="date"
                time={false}
                label="Фактическая дата начала"
                date={state.fact_date_start}
                error={errors.fact_date_start}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['fact_date_start']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="date"
                time={false}
                label="Фактическая дата окончания"
                date={state.fact_date_end}
                error={errors.fact_date_end}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['fact_date_end']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="number"
                label="Пробег на момент ТО, км"
                error={errors.motohours_fact}
                disabled={!isPermitted}
                value={state.motohours_fact}
                onChange={this.handleChange}
                boundKeys={['motohours_fact']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="number"
                label="Счетчик м/ч на момент ТО, м/ч"
                error={errors.odometr_fact}
                disabled={!isPermitted}
                value={state.odometr_fact}
                onChange={this.handleChange}
                boundKeys={['odometr_fact']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="string"
                label="Примечание"
                value={state.note}
                error={errors.note}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['note']}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="label"
                label="Файл"
                value={state.file}
                error={errors.file}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['file']}
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
