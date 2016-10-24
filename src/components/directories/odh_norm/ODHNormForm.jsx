import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['odh'])
export default class ODHNormForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const IS_CREATING = !state.id;
    const MEASUREUNITS = this.props.measureUnitList.map(({ id, name }) => ({ value: id, label: name }));
    const title = IS_CREATING ? 'Добавление расходного материала' : 'Изменение расходного материала'; //'Добавление норматива по содержанию ОДХ' : 'Изменение норматива по содержанию ОДХ';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Div>
            <Field
              type="string"
              label="Наименование" //Норматив
              value={state.name}
              error={errors.name}
              onChange={this.handleChange.bind(this, 'name')}
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
            />
            {/* <Field
              type="string"
              label="Единица измерения"
              value={state.unit}
              error={errors.unit}
              onChange={this.handleChange.bind(this, 'unit')}
            /> */}
          </Div>
          {/* <Div>
            <Field
            type="boolean"
            label="Расходный материал"
            value={state.consumable_material}
            error={errors.consumable_material}
            onChange={this.handleChange.bind(this, 'consumable_material', !!!state.consumable_material)}
            />
          </Div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
