import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

import Form from '../../compositions/Form.jsx';

@connectToStores(['objects', 'odh'])
export default class MaterialConsumptionRateForm extends Form {
  handleSubmitWrap = () => this.handleSubmit();

  handleChangeCategory = (value) => {
    this.handleChange('clean_subcategory_id', null);
    this.handleChange('clean_category_id', value);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      isPermitted = false,
      technicalOperationsList = [],
      cleanCategoriesList = [],
      odhNormList = [],
    } = this.props;
    const { subcategories = [] } = cleanCategoriesList.find(c => state.clean_category_id === c.id) || {};

    const IS_CREATING = !state.id;
    const TECH_OPERATIONS = technicalOperationsList.map(defaultSelectListMapper);
    const CONSUMABLE_MATERIALS = odhNormList.map(defaultSelectListMapper);
    const CATEGORIES = cleanCategoriesList.map(defaultSelectListMapper);
    const SUBCATEGORIES = subcategories.map(defaultSelectListMapper);

    const title = IS_CREATING ? 'Добавление нормы на расход расходных материалов' : 'Изменение нормы на расход расходных материалов';

    return (
      <Modal {...this.props} backdrop="static" bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
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
                label="Расходный материал"
                error={errors.consumable_material_id}
                options={CONSUMABLE_MATERIALS}
                value={state.consumable_material_id}
                onChange={this.handleChange}
                boundKeys={['consumable_material_id']}
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
                disabled={!isPermitted || SUBCATEGORIES.length === 0}
                options={SUBCATEGORIES}
                value={state.clean_subcategory_id}
                onChange={this.handleChange}
                boundKeys={['clean_subcategory_id']}
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
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
