import * as React from 'react';
import { connect } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import UNSAFE_Form from 'components/old/compositions/UNSAFE_Form';
import ModalBody from 'components/old/ui/Modal';
import ExtField from 'components/@next/@ui/renderFields/Field';

import { connectToStores } from 'utils/decorators';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { actionGetAndSetInStoreTechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const PermittedSlug = ['dt', 'odh'];
const setTypeOptionsBySlug = (slug, allOptions) => {
  switch (slug) {
    case 'dt':
      return allOptions.filter(({ label }) => label === 'Капитальный');
    case 'odh':
      return allOptions;
    default:
      return [];
  }
};

type Props = {
  [k: string]: any;
};
type State = any;

@connectToStores(['repair'])
class ProgramRegistryForm extends UNSAFE_Form<Props, State> {
  state = { REPAIR_TYPES_OPTIONS: [] };
  componentDidMount() {
    const { flux } = this.context;

    flux
      .getActions('repair')
      .getRepairListByType(
        'stateProgram',
        { status: 'active' },
        { makeOptions: true, selectListMapper: defaultSelectListMapper },
      );
    flux
      .getActions('repair')
      .getRepairListByType(
        'repairType',
        {},
        { makeOptions: true, selectListMapper: defaultSelectListMapper },
      );
    this.props.dispatch(
      actionGetAndSetInStoreTechnicalOperationObjects(
        {},
        {
          page: 'mainpage',
        },
      ),
    );
  }

  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);
  handleChangeObjectType = (fieldName, val) => {
    const {
      technicalOperationObjectsList,
      RepairOptions: { repairTypeOptions },
    } = this.props;

    const REPAIR_TYPES_OPTIONS = setTypeOptionsBySlug(
      technicalOperationObjectsList.find(({ id }) => id === val).slug,
      repairTypeOptions,
    );

    this.setState({ REPAIR_TYPES_OPTIONS });

    this.handleChange(fieldName, val);
    this.handleChange('repair_type_id', null);
  };
  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      RepairOptions: { stateProgramOptions },
      technicalOperationObjectsList,
    } = this.props;

    const { REPAIR_TYPES_OPTIONS = [] } = this.state;

    const OBJECTS = technicalOperationObjectsList.reduce(
      (arr, { id, full_name, slug }) => {
        if (PermittedSlug.includes(slug)) {
          arr.push({ value: id, label: full_name, slug });
        }

        return arr;
      },
      [],
    );

    const title = 'Создание программы ремонта';

    return (
      <EtsBootstrap.ModalContainer
        id="modal-program-registry-c"
        show={this.props.show}
        onHide={this.props.onHide}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody style={{ padding: 15 }}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="select"
                label="Гос. программа"
                error={errors.state_program_id}
                options={stateProgramOptions}
                value={state.state_program_id}
                onChange={this.handleChange}
                boundKeys="state_program_id"
                disabled={!isPermitted}
                clearable={false}
              />
              <ExtField
                type="string"
                label="Наименование программы"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys="name"
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Тип объекта ремонта"
                error={errors.object_type_id}
                options={OBJECTS}
                value={state.object_type_id}
                onChange={this.handleChangeObjectType}
                boundKeys="object_type_id"
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
                boundKeys="repair_type_id"
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
                boundKeys="plan_date_start"
                disabled={!isPermitted}
              />
              <ExtField
                type="date"
                label="План. Завершение"
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.handleChange}
                boundKeys="plan_date_end"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button
            disabled={!this.props.canSave}
            onClick={this.props.onSubmit}>
            Далее
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default connect((state: ReduxState) => ({
  technicalOperationObjectsList: getSomeUniqState(state)
    .technicalOperationObjectsList,
}))(ProgramRegistryForm);
