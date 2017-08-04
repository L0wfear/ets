import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import Preloader from 'components/ui/Preloader.jsx';
import ModalBody from 'components/ui/Modal';
import {
  Field,
  MultiSelectField,
  DataTimeField,
  // FileField,
 } from 'components/ui/input/fields';
import { connectToStores } from 'utils/decorators';
import { ExtDiv } from 'components/ui/Div.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';
import {
  isThreeDigitGovNumber,
  isFourDigitGovNumber,
} from 'utils/functions';

@connectToStores(['autobase', 'objects'])
export default class TechMaintForm extends Form {
  state = {
    areFilesLoading: false,
  }
  async componentDidMount() {
    const { flux } = this.context;
    const { car_model_id } = this.props.formState;

    flux.getActions('autobase').getAutobaseListByType('repairCompany');
    flux.getActions('autobase').getAutobaseListByType('techMaintOrder', {
      car_model_id,
    });

    // if (car_id !== null) {
    //   flux.getActions('objects').getCars();
    // }
  }
  hanleFileLoading = indicator => this.setState({ areFilesLoading: indicator })
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      repairCompanyList = [],
      techMaintOrderList = [],
      isPermitted = false,
    } = this.props;

    const REPAIR_COMPANIES = repairCompanyList.map(defaultSelectListMapper);
    const TECH_MAINT_ORDERS = techMaintOrderList.map(({ tech_maintenance_type_name, id }) => ({ label: tech_maintenance_type_name, value: id }));

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>

        <div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Исполнитель ремонта"
                options={REPAIR_COMPANIES}
                value={state.repair_company_id}
                error={errors.repair_company_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['repair_company_id']}
              />
            </Col>
            <Col md={12}>
              <MultiSelectField
                integer
                label="Регламент ТО"
                options={TECH_MAINT_ORDERS}
                value={state.tech_maintenance_order_ids}
                error={errors.tech_maintenance_order_ids}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['tech_maintenance_order_ids']}
              />
            </Col>
            <Col md={12}>
              <Field
                type="string"
                label="Номер документа"
                value={state.number}
                error={errors.number}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['number']}
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Плановая дата начала"
                date={state.plan_date_start}
                error={errors.plan_date_start}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Плановая дата окончания"
                date={state.plan_date_end}
                error={errors.plan_date_end}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['plan_date_end']}
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Фактическая дата начала"
                date={state.fact_date_start}
                error={errors.fact_date_start}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['fact_date_start']}
              />
            </Col>
            <Col md={6}>
              <DataTimeField
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
              <ExtDiv hidden={!isThreeDigitGovNumber(state.gov_number)}>
                <Field
                  type="number"
                  label="Пробег на момент ТО, км"
                  error={errors.odometr_fact}
                  disabled={!isPermitted}
                  value={state.odometr_fact}
                  onChange={this.handleChange}
                  boundKeys={['odometr_fact']}
                />
              </ExtDiv>
            </Col>
            <Col md={12}>
              <ExtDiv hidden={!isFourDigitGovNumber(state.gov_number)}>
                <Field
                  type="number"
                  label="Счетчик м/ч на момент ТО, м/ч"
                  error={errors.motohours_fact}
                  disabled={!isPermitted}
                  value={state.motohours_fact}
                  onChange={this.handleChange}
                  boundKeys={['motohours_fact']}
                />
              </ExtDiv>
            </Col>
            <Col md={12}>
              <Field
                type="string"
                label="Примечание"
                value={state.note}
                error={errors.note}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['note']}
              />
            </Col>
            {/*
            <Col md={12}>
              <FileField
                multiple
                label="Файл"
                value={state.file}
                error={errors.file}
                onChange={this.handleChange}
                boundKeys={['file']}
                isLoading={this.hanleFileLoading}
              />
            </Col>
            */}
          </Row>
        </div>

        {this.state.areFilesLoading && <Preloader type="mainpage" />}
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
