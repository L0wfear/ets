import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnStateProgramProps,
  PropsStateProgram,
  StatePropsStateProgram,
  DispatchPropsStateProgram,
  PropsStateProgramWithForm,
} from 'components/new/pages/nsi/repair/pages/state_program/form/@types/StateProgramForm';
import { DivNone } from 'global-styled/global-styled';
import stateProgramPermissions from '../_config-data/permissions';
import { stateProgramFormSchema } from './schema';
import { getDefaultStateProgramElement } from './utils';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';
import { actionCreateStateProgram, actionUpdateStateProgram } from 'redux-main/reducers/modules/repair/state_program/actions_state_program';
import useStateProgramStatusOptions from './use/useStateProgramStatusOptions';
import { actionLoadStateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/actions_state_program_status';
import { ExtField } from 'components/ui/new/field/ExtField';

const StateProgramForm: React.FC<PropsStateProgram> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    isPermitted,
  } = props;

  const statusOptions = useStateProgramStatusOptions(
    props.actionLoadStateProgramStatus,
    page, path,
  );

  const title = 'Государственная программа ремонта';

  return (
    <EtsBootstrap.ModalContainer id="modal-state_program" show onHide={props.hideWithoutChanges} backdrop="static">
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="Наименование государственной программы"
              error={errors.name}
              value={state.name}
              onChange={props.handleChange}
              boundKeys="name"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="select"
              label="Статус"
              error={errors.status_id}
              value={state.status_id}
              options={statusOptions}
              onChange={props.handleChange}
              clearable={false}
              boundKeys="status_id"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsStateProgram, OwnStateProgramProps>(
  connect<StatePropsStateProgram, DispatchPropsStateProgram, OwnStateProgramProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadStateProgramStatus: (...arg) => (
        dispatch(
          actionLoadStateProgramStatus(...arg),
        )
      ),
    }),
  ),
  withForm<PropsStateProgramWithForm, StateProgram>({
    uniqField: 'id',
    createAction: actionCreateStateProgram,
    updateAction: actionUpdateStateProgram,
    mergeElement: (props) => {
      return getDefaultStateProgramElement(props.element);
    },
    schema: stateProgramFormSchema,
    permissions: stateProgramPermissions,
  }),
)(StateProgramForm);
