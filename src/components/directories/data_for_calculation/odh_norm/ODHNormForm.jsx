import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div';
import Field from 'components/ui/Field';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh'])
export default class ODHNormForm extends Form {

  render() {
    const [
      state = {},
      errors = {},
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const {
      isPermitted = false,
      measureUnitList = [],
    } = this.props;

    const IS_CREATING = !state.id;
    const MEASUREUNIT_OPTION = measureUnitList.map(defaultSelectListMapper);

    const title = IS_CREATING ? 'Добавление расходного материала' : 'Изменение расходного материала'; //'Добавление норматива по содержанию ОДХ' : 'Изменение норматива по содержанию ОДХ';

    return (
      <Modal id="modal-odh-norm" show={this.props.show} onHide={this.props.onHide} backdrop="static">
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
              options={MEASUREUNIT_OPTION}
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
