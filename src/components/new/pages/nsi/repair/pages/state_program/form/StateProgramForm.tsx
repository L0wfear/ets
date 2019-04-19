import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
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
import { Row, Col } from 'react-bootstrap';
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
    <Modal id="modal-state_program" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            <ExtField
              type="string"
              label="Наименование государственной программы"
              error={errors.name}
              value={state.name}
              onChange={props.handleChange}
              boundKeys="name"
            />
          </Col>
          <Col md={6}>
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
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        <div>
          {
            isPermitted // либо обновление, либо создание
            ? (
              <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
            )
            : (
              <DivNone />
            )
          }
          <Button onClick={props.hideWithoutChanges}>Отменить</Button>
        </div>
      </Modal.Footer>
    </Modal>
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
