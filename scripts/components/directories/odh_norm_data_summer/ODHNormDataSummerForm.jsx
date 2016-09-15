import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects', 'odh'])
export default class ODHNormDataSummerForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { technicalOperationsList, odhNormList } = this.props;
    const IS_CREATING = !state.id;
    const title = IS_CREATING ? 'Добавление показателя нормы по содержанию ОДХ (лето)' : 'Изменение показателя нормы по содержанию ОДХ (лето)';
    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const ODH_STANDARDS = odhNormList.map(({ id, standard }) => ({ value: id, label: standard }));

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Div>
                <Field
                  type="select"
                  label="Технологическая операция"
                  error={errors.technical_operation_id}
                  disabled={false}
                  options={TECH_OPERATIONS}
                  value={state.technical_operation_id}
                  onChange={this.handleChange.bind(this, 'technical_operation_id')}
                />
              </Div>
              <Div>
                <Field
                  type="select"
                  label="Норматив по содержанию ОДХ"
                  error={errors.standard_id}
                  disabled={false}
                  options={ODH_STANDARDS}
                  value={state.standard_id}
                  onChange={this.handleChange.bind(this, 'standard_id')}
                />
              </Div>
              <Div>
                <Field
                  type="string"
                  label="Единица измерения"
                  value={state.unit}
                  error={errors.unit}
                  onChange={this.handleChange.bind(this, 'unit')}
                />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <label>Категории:</label>
              <Row>
                <Col md={2}>
                  <Field
                    type="string"
                    label="1"
                    value={state.categorized_1}
                    error={errors.categorized_1}
                    onChange={this.handleChange.bind(this, 'categorized_1')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="2"
                    value={state.categorized_2}
                    error={errors.categorized_2}
                    onChange={this.handleChange.bind(this, 'categorized_2')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="3"
                    value={state.categorized_3}
                    error={errors.categorized_3}
                    onChange={this.handleChange.bind(this, 'categorized_3')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="4"
                    value={state.categorized_4}
                    error={errors.categorized_4}
                    onChange={this.handleChange.bind(this, 'categorized_4')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="5"
                    value={state.categorized_5}
                    error={errors.categorized_5}
                    onChange={this.handleChange.bind(this, 'categorized_5')}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={2}>
                  <Field
                    type="string"
                    label="6а"
                    value={state.categorized_6a}
                    error={errors.categorized_6a}
                    onChange={this.handleChange.bind(this, 'categorized_6a')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="6б"
                    value={state.categorized_6b}
                    error={errors.categorized_6b}
                    onChange={this.handleChange.bind(this, 'categorized_6b')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="6в"
                    value={state.categorized_6c}
                    error={errors.categorized_6c}
                    onChange={this.handleChange.bind(this, 'categorized_6c')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="7а"
                    value={state.categorized_7a}
                    error={errors.categorized_7a}
                    onChange={this.handleChange.bind(this, 'categorized_7a')}
                  />
                </Col>
                <Col md={2}>
                  <Field
                    type="string"
                    label="7б"
                    value={state.categorized_7b}
                    error={errors.categorized_7b}
                    onChange={this.handleChange.bind(this, 'categorized_7b')}
                  />
                </Col>
              </Row>
              <Row style={{ height: '120px' }}>
                <Col md={4} style={{ height: '100%', display: 'table' }}>
                  <Field
                    type="string"
                    label='Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")'
                    value={state.uncategorized_highway}
                    error={errors.uncategorized_highway}
                    wrapStyle={{ display: 'table-cell', 'verticalAlign': 'bottom' }}
                    onChange={this.handleChange.bind(this, 'uncategorized_highway')}
                  />
                </Col>
                <Col md={4} style={{ height: '100%', display: 'table' }}>
                  <Field
                    type="string"
                    label="ОДХ внутри Садового кольца"
                    value={state.uncategorized_odhs_center}
                    error={errors.uncategorized_odhs_center}
                    wrapStyle={{ display: 'table-cell', 'verticalAlign': 'bottom' }}
                    onChange={this.handleChange.bind(this, 'uncategorized_odhs_center')}
                  />
                </Col>
                <Col md={4} style={{ height: '100%', display: 'table' }}>
                  <Field
                    type="string"
                    label="ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы"
                    value={state.uncategorized_odhs_other}
                    error={errors.uncategorized_odhs_other}
                    wrapStyle={{ display: 'table-cell', 'verticalAlign': 'bottom' }}
                    onChange={this.handleChange.bind(this, 'uncategorized_odhs_other')}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
