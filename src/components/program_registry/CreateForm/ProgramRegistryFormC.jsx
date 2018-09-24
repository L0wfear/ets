import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import Form from 'components/compositions/Form.jsx';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/new/field/ExtField';

import { connectToStores } from 'utils/decorators';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

const PermittedSlug = ['dt', 'odh'];
const setTypeOptionsBySlug = (slug, allOptions) => {
  switch (slug) {
    case 'dt': return allOptions.filter(({ label }) => label === 'Капитальный');
    case 'odh': return allOptions;
    default: return [];
  }
};

@connectToStores(['repair', 'objects'])
export default class ProgramRegistryForm extends Form {
  state = { REPAIR_TYPES_OPTIONS: [] };
  componentDidMount() {
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('stateProgram', { status: 'active' }, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    flux.getActions('repair').getRepairListByType('repairType', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  }

  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);
  handleChangeObjectType = (fieldName, val) => {
    const {
      technicalOperationsObjectsList,
      RepairOptions: { repairTypeOptions },
    } = this.props;

    const REPAIR_TYPES_OPTIONS = setTypeOptionsBySlug(
      technicalOperationsObjectsList.find(({ id }) => id === val).slug,
      repairTypeOptions
    );

    this.setState({ REPAIR_TYPES_OPTIONS });

    this.handleChange(fieldName, val);
    this.handleChange('repair_type_id', null);
  }
  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      RepairOptions: { stateProgramOptions },
      technicalOperationsObjectsList,
    } = this.props;

    const { REPAIR_TYPES_OPTIONS = [] } = this.state;

    const OBJECTS = technicalOperationsObjectsList.reduce((arr, { id, full_name, slug }) => {
      if (PermittedSlug.includes(slug)) {
        arr.push({ value: id, label: full_name, slug });
      }

      return arr;
    }, []);

    const title = 'Создание программы ремонта';

    return (
      <Modal id="modal-program-registry-c" show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Гос. программа"
                error={errors.state_program_id}
                options={stateProgramOptions}
                value={state.state_program_id}
                onChange={this.handleChange}
                boundKeys={['state_program_id']}
                disabled={!isPermitted}
                clearable={false}
              />
              <ExtField
                type="string"
                label="Наименование программы"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['name']}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Тип объекта ремонта"
                error={errors.object_type_id}
                options={OBJECTS}
                value={state.object_type_id}
                onChange={this.handleChangeObjectType}
                boundKeys={['object_type_id']}
                disabled={!isPermitted}
                clearable={false}
              />
              <ExtField
                type="select"
                label="Тип ремонта"
                error={errors.repair_type_id}
                options={REPAIR_TYPES_OPTIONS}
                value={state.repair_type_id}
                onChange={this.handleChange}
                boundKeys={['repair_type_id']}
                disabled={!isPermitted || !state.object_type_id}
                clearable={false}
              />
              <ExtField
                type="date"
                label="План. Начало"
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type="date"
                label="План. Завершение"
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.handleChange}
                boundKeys={['plan_date_end']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.props.onSubmit}>Далее</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
