import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects'])
export default class MaintenanceRateForm extends Form {
  handleChangeCategory = (value) => {
    this.handleChange('clean_subcategory_id', null);
    this.handleChange('clean_category_id', value);
  }
  myHandleSubmit = () => this.handleSubmit();

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      isPermitted = false,
      type,
      technicalOperationsList = [],
      maintenanceWorkList = [],
      cleanCategoriesList = [],
    } = this.props;
    const { subcategories = [] } = (cleanCategoriesList.find(c => state.clean_category_id === c.id) || {});

    const TECH_OPERATIONS = technicalOperationsList.map(defaultSelectListMapper);
    const MAINTENANCE_WORK = maintenanceWorkList.map(defaultSelectListMapper);
    const CATEGORIES = cleanCategoriesList.map(defaultSelectListMapper);
    const SUBCATEGORIES = subcategories.map(defaultSelectListMapper);
    return (
      <Modal {...this.props} backdrop="static" bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} нормы на содержание {this.props.type === 'odh' ? 'ОДХ' : 'ДТ'}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Технологическая операция"
                error={errors.technical_operation_id}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.handleChange}
                boundKeys={['technical_operation_id']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Наименование регламентной работы"
                error={errors.maintenance_work_id}
                options={MAINTENANCE_WORK}
                value={state.maintenance_work_id}
                onChange={this.handleChange}
                boundKeys={['maintenance_work_id']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <ExtField
                type="select"
                label="Сезон"
                error={errors.season_id}
                options={[{ value: 2, label: 'Зима' }, { value: 1, label: 'Лето' }]}
                value={state.season_id}
                onChange={this.handleChange}
                boundKeys={['season_id']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Категория"
                error={errors.clean_category_id}
                options={CATEGORIES}
                value={state.clean_category_id}
                onChange={this.handleChangeCategory}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Подкатегория"
                error={errors.clean_subcategory_id}
                options={SUBCATEGORIES}
                value={state.clean_subcategory_id}
                onChange={this.handleChange}
                boundKeys={['clean_subcategory_id']}
                disabled={!isPermitted || SUBCATEGORIES.length === 0}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="Норма"
                error={errors.value}
                value={state.value}
                onChange={this.handleChange}
                boundKeys={['value']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer>
          <Button onClick={this.myHandleSubmit} disabled={!this.props.canSave || !isPermitted}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}
