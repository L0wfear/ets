import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';
import { ExtField } from 'components/ui/new/field/ExtField';

@connectToStores(['odh', 'objects'])
class EfficiencyForm extends Form {
  async componentDidMount() {
    const { flux } = this.context;
    await flux.getActions('odh').getODHNorm();
    await flux.getActions('technicalOperation').getTechnicalOperations();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { technicalOperationsList = [], odhNormList = [] } = this.props;
    const IS_CREATING = !state.id;
    const title = IS_CREATING
      ? 'Добавление показателя для расчета эффективности'
      : 'Изменение показателя для расчета эффективности';
    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    const ODH_NORMS = odhNormList.map(({ id, norm }) => ({
      value: id,
      label: norm,
    }));
    const ODH_FIELDS = [
      'Общая площадь (кв.м.)',
      'Протяженность (п.м.)',
      'Площадь проезжей части (кв.м.)',
      'Площадь тротуаров (кв.м.)',
      'Площадь уборки (кв.м.)',
      'Площадь механизированной уборки тротуаров (кв.м.)',
      'Площадь ручной уборки тротуаров (кв.м.)',
      'Площадь уборки снега (кв.м.)',
      'Протяженность лотков (п.м.)',
    ].map((label, value) => ({ value, label }));
    const SOURCES = [
      { value: 0, label: 'Реестр ОДХ' },
      { value: 1, label: 'Справочник показателей норм на содержание ОДХ' },
    ];

    return (
      <Modal
        id="modal-efficiency"
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Div>
            <ExtField
              type="select"
              label="Технологическая операция"
              error={errors.technical_operation_id}
              disabled={false}
              options={TECH_OPERATIONS}
              value={state.technical_operation_id}
              onChange={this.handleChange}
              boundKeys="technical_operation_id"
            />
          </Div>
          <Div>
            <ExtField
              type="select"
              label="Источник"
              error={errors.source}
              disabled={false}
              options={SOURCES}
              value={state.source}
              onChange={this.handleChange}
              boundKeys="source"
            />
          </Div>
          <Div>
            <ExtField
              type="select"
              label="Площадная характеристика"
              error={errors.areal_feature_id}
              disabled={typeof state.source === undefined}
              options={+state.source ? ODH_NORMS : ODH_FIELDS}
              value={state.areal_feature_id}
              onChange={this.handleChange}
              boundKeys="areal_feature_id"
            />
          </Div>
          <Div>
            <ExtField
              type="number"
              label="Коэффициент"
              value={state.ratio}
              error={errors.ratio}
              onChange={this.handleChange}
              boundKeys="ratio"
            />
          </Div>
        </ModalBody>
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EfficiencyForm;
