import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import dutyDutyMissionTemplatePermissions from 'components/missions/duty_mission_template/config-data/permissions';
import { getDefaultDutyMissionTemplateElement, checkMissionsOnStructureIdBrigade } from './utils';
import { dutyDutyMissionTemplateCreatingFormSchema } from './schema';

import EtsModal from 'components/new/ui/modal/Modal';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { DivNone } from 'global-styled/global-styled';
import {
  getEmployeeState,
} from 'redux-main/reducers/selectors';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import {
  PropsDutyMissionTemplateCreatingForm,
  StatePropsDutyMissionTemplate,
  DispatchPropsDutyMissionTemplate,
  OwnDutyMissionTemplateProps,
  PropsDutyMissionTemplateWithForm,
} from './@types/index.h';
import { ReduxState } from 'redux-main/@types/state';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import FieldDatesDutyMission from 'components/missions/duty_mission/form/main/inside_fields/dates/FieldDatesDutyMission';
import FieldMissionSourceMission from 'components/missions/mission/form/main/inside_fields/mission_source_id/FieldMissionSourceMission';

/**
 * Форма шаблона наряд-заданий
 * Собирается из формы наряд-задания
 */
const DutyMissionTemplateCreatingForm: React.FC<PropsDutyMissionTemplateCreatingForm> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page, path,
  } = props;

  const isPermitted = props.isPermittedToCreate;
  const title = 'Формирование заданий из шаблонов';

  // Получение сотрудников для валидации бригадира и бригады в схеме
  React.useEffect(
    () => {
      if (isPermitted) {
        props.employeeGetAndSetInStore({}, { page, path });

        return () => {
          props.employeeEmployeeResetSetEmployee();
        };
      }
    },
    [isPermitted],
  );

  const handleSubmit = React.useCallback(
    async () => {
      const dutyMissions = Object.values(props.dutyMissionTemplates);
      const hasErorrTemplates = checkMissionsOnStructureIdBrigade(
        dutyMissions,
        props.employeeIndex,
      );

      if (!hasErorrTemplates) {
        const response = await Promise.all(
          dutyMissions.map((dutyMissionTamplate) => (
            props.submitAction(
              {
                ...dutyMissionTamplate,
                ...props.formState,
                status: 'not_assigned', // зачем-то
              },
            )
          )),
        );

        if (response.every((ans) => Boolean(ans))) {
          props.handleHide(true, response);
        }
      }
    },
    [state, props.dutyMissionTemplates, props.employeeIndex],
  );

  return (
    <EtsModal
      id="modal-duty-mission-template-creating"
      show
      onHide={props.hideWithoutChanges}
      bsSize="large"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            <FieldDatesDutyMission
              isPermitted={isPermitted}
              plan_date_start={state.plan_date_start}
              error_plan_date_start={errors.plan_date_start}
              plan_date_end={state.plan_date_end}
              error_plan_date_end={errors.plan_date_end}

              onChange={props.handleChange}
              page={page}
              path={path}
            />
          </Col>
          <Col md={12}>
            <FieldMissionSourceMission
              value={state.mission_source_id}
              name={state.mission_source_name}
              error={errors.mission_source_id}
              disabled={!isPermitted}
              isPermitted={isPermitted}
              onChange={props.handleChange}
              page={page}
              path={path}
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        {isPermitted ? ( // либо обновление, либо создание
          <Button
            disabled={!props.canSave}
            onClick={handleSubmit}>
            Сохранить
          </Button>
        ) : (
          <DivNone />
        )}
      </Modal.Footer>
    </EtsModal>
  );
};

export default compose<PropsDutyMissionTemplateCreatingForm, OwnDutyMissionTemplateProps>(
  connect<StatePropsDutyMissionTemplate, DispatchPropsDutyMissionTemplate, OwnDutyMissionTemplateProps, ReduxState>(
    (state) => ({
      employeeIndex: getEmployeeState(state).employeeIndex,
    }),
    (dispatch: any) => ({
      employeeGetAndSetInStore: (...arg) => (
        dispatch(employeeActions.employeeGetAndSetInStore(...arg))
      ),
      employeeEmployeeResetSetEmployee: (...arg) => (
        dispatch(employeeActions.employeeEmployeeResetSetEmployee(...arg))
      ),
    }),
  ),
  withForm<PropsDutyMissionTemplateWithForm, Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id' | 'mission_source_name'>>({
    uniqField: false,
    createAction: missionsActions.actionCreateDutyMission,
    mergeElement: ({ element }) => {
      return getDefaultDutyMissionTemplateElement(element);
    },
    schema: dutyDutyMissionTemplateCreatingFormSchema,
    permissions: dutyDutyMissionTemplatePermissions,
  }),
)(DutyMissionTemplateCreatingForm);
