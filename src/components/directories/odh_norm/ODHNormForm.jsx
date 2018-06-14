import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh'])
export default class ODHNormForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted = false } = this.props;
    const IS_CREATING = !state.id;
    const MEASUREUNITS = this.props.measureUnitList.map(({ id, name }) => ({ value: id, label: name }));
    const title = IS_CREATING ? 'Добавление расходного материала' : 'Изменение расходного материала'; //'Добавление норматива по содержанию ОДХ' : 'Изменение норматива по содержанию ОДХ';

    return (
      <Modal {...this.props} id="modal-odh-norm" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Div>
            <Field
              type="string"
              label="Наименование" //Норматив
              value={state.name}
              error={errors.name}
              onChange={this.handleChange.bind(this, 'name')}
              disabled={!isPermitted}
            />
          </Div>
          <Div>
            <Field
              type="select"
              label="Единица измерения"
              value={state.measure_unit_id}
              options={MEASUREUNITS}
              error={errors.measure_unit_id}
              onChange={this.handleChange.bind(this, 'measure_unit_id')}
              disabled={!isPermitted}
            />
          </Div>
        </ModalBody>
        <Modal.Footer>
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
