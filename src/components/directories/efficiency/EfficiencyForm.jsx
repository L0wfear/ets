import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh', 'objects'])
export default class EfficiencyForm extends Form {

  async componentDidMount() {
    const { flux } = this.context;
    await flux.getActions('odh').getODHNorm();
    await flux.getActions('technicalOperation').getTechnicalOperations();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { technicalOperationsList = [], odhNormList = [] } = this.props;
    const IS_CREATING = !!!state.id;
    const title = IS_CREATING ? 'Добавление показателя для расчета эффективности' : 'Изменение показателя для расчета эффективности';
    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const ODH_NORMS = odhNormList.map(({ id, norm }) => ({ value: id, label: norm }));
    const ODH_FIELDS = ['Общая площадь (кв.м.)', 'Протяженность (п.м.)', 'Площадь проезжей части (кв.м.)', 'Площадь тротуаров (кв.м.)',
      'Площадь уборки (кв.м.)', 'Площадь механизированной уборки тротуаров (кв.м.)', 'Площадь ручной уборки тротуаров (кв.м.)',
      'Площадь уборки снега (кв.м.)', 'Протяженность лотков (п.м.)'].map((label, value) => ({ value, label }));
    const SOURCES = [{ value: 0, label: 'Реестр ОДХ' }, { value: 1, label: 'Справочник показателей норм на содержание ОДХ' }];

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              label="Источник"
              error={errors.source}
              disabled={false}
              options={SOURCES}
              value={state.source}
              onChange={this.handleChange.bind(this, 'source')}
            />
          </Div>
          <Div>
            <Field
              type="select"
              label="Площадная характеристика"
              error={errors.areal_feature_id}
              disabled={typeof state.source === undefined}
              options={+state.source ? ODH_NORMS : ODH_FIELDS}
              value={state.areal_feature_id}
              onChange={this.handleChange.bind(this, 'areal_feature_id')}
            />
          </Div>
          <Div>
            <Field
              type="number"
              label="Коэффициент"
              value={state.ratio}
              error={errors.ratio}
              onChange={this.handleChange.bind(this, 'ratio')}
            />
          </Div>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
