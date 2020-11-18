import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import dutyDutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { getDefaultDutyMissionTemplateElement } from './utils';
import { dutyDutyMissionTemplateFormSchema } from './schema';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { DivNone } from 'global-styled/global-styled';
import {
  getSessionState,
  getEmployeeState,
} from 'redux-main/reducers/selectors';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import FieldTechnicalOperationDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationDutyMission';
import FieldMunicipalFacilityIdDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMission';
import FieldForemanIdDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/foreman_id/FieldForemanIdDutyMission';
import FieldBrigadeEmployeeIdListDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMission';
import FieldStructureDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import FieldRouteIdDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/route_id/FieldRouteIdDutyMission';

import {
  PropsDutyMissionTemplateForm,
  StatePropsDutyMissionTemplate,
  DispatchPropsDutyMissionTemplate,
  OwnDutyMissionTemplateProps,
  PropsDutyMissionTemplateWithForm,
} from './@types/index.h';
import { ReduxState } from 'redux-main/@types/state';
import { uniq } from 'lodash';

/**
 * Форма шаблона наряд-заданий
 * Собирается из формы наряд-задания
 */
const DutyMissionTemplateForm: React.FC<PropsDutyMissionTemplateForm> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      STRUCTURE_FIELD_VIEW,
      page, path,
    } = props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING
      ? props.isPermittedToUpdate
      : props.isPermittedToCreate;

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
    const title = !IS_CREATING ? 'Шаблон наряд-задания' : 'Создание шаблона наряд-задания';

    const handleSubmit = React.useCallback(() => {
      const brigade_employee_id_list_id = uniq(state.brigade_employee_id_list_id);
      const brigade_employee_id_list_fio = uniq(state.brigade_employee_id_list_fio);
      props.handleChange({
        brigade_employee_id_list: brigade_employee_id_list_id.map((id, index) => ({
          employee_id: id,
          employee_fio: brigade_employee_id_list_fio[index],
        })),
        brigade_employee_id_list_id,
        brigade_employee_id_list_fio,
      });
      setTimeout(() => {
        props.defaultSubmit();
      }, 0);
    }, [props.defaultSubmit, props.handleChange, state.brigade_employee_id_list_id, state.brigade_employee_id_list_fio]);

    return (
      <EtsBootstrap.ModalContainer
        id="modal-duty-mission-template"
        show
        onHide={props.hideWithoutChanges}
        bsSize="large"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FieldTechnicalOperationDutyMission
                value={state.technical_operation_id}
                name={state.technical_operation_name}
                disabled={!isPermitted}
                isPermitted={isPermitted}
                error={errors.technical_operation_id}
                onChange={props.handleChange}
                IS_TEMPLATE
                DUTY_MISSION_IS_ORDER_SOURCE={false}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <FieldMunicipalFacilityIdDutyMission
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={!state.technical_operation_id || !isPermitted}
                error={errors.municipal_facility_id}
                isPermitted={isPermitted}
                onChange={props.handleChange}
                technical_operation_id={state.technical_operation_id}
                IS_TEMPLATE
                DUTY_MISSION_IS_ORDER_SOURCE={false}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="passes_count"
                modalKey={page}
                type="number"
                label="Количество выполнений"
                value={state.passes_count}
                error={errors.passes_count}
                disabled={!isPermitted}
                onChange={props.handleChange}
                boundKeys="passes_count"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={STRUCTURE_FIELD_VIEW ? 6 : 12}>
              <FieldForemanIdDutyMission
                value={state.foreman_id}
                foreman_fio={state.foreman_fio}
                foreman_full_fio={state.foreman_full_fio}
                name={state.foreman_fio}
                error={errors.foreman_id}
                isPermitted={isPermitted}
                disabled={!isPermitted}
                onChange={props.handleChange}
                structure_id={state.structure_id}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
            {STRUCTURE_FIELD_VIEW ? (
              <EtsBootstrap.Col md={6}>
                <FieldStructureDutyMission
                  value={state.structure_id}
                  name={state.structure_name}
                  error={errors.structure_id}
                  disabled={!isPermitted}
                  isPermitted={isPermitted}
                  onChange={props.handleChange}
                  page={page}
                  path={path}
                />
              </EtsBootstrap.Col>
            ) : (
              <DivNone />
            )}
            <EtsBootstrap.Col md={12}>
              <FieldBrigadeEmployeeIdListDutyMission
                brigade_employee_id_list={state.brigade_employee_id_list}
                value={state.brigade_employee_id_list_id}
                name={state.brigade_employee_id_list_fio}
                error={errors.brigade_employee_id_list_id}
                isPermitted={isPermitted}
                disabled={!isPermitted}
                onChange={props.handleChange}
                foreman_id={state.foreman_id}
                structure_id={state.structure_id}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <FieldRouteIdDutyMission
            error={errors.route_id}
            value={state.route_id}
            name={state.route_name}
            municipal_facility_id={state.municipal_facility_id}
            municipal_facility_name={state.municipal_facility_name}
            technical_operation_id={state.technical_operation_id}
            technical_operation_name={state.technical_operation_name}
            DUTY_MISSION_IS_ORDER_SOURCE={false}
            disabled={!isPermitted}
            isPermitted={isPermitted}
            structure_id={state.structure_id}
            structure_name={state.structure_name}
            onChange={props.handleChange}
            fromMission={true}
            fromMissionTemplate={true}
            page={page}
            path={path}
          />
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="comment"
                modalKey={page}
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={props.handleChange}
                boundKeys="comment"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!props.canSave}
              onClick={handleSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsDutyMissionTemplateForm, OwnDutyMissionTemplateProps>(
  connect<StatePropsDutyMissionTemplate, DispatchPropsDutyMissionTemplate, OwnDutyMissionTemplateProps, ReduxState>(
    (state) => ({
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      employeeIndex: getEmployeeState(state).employeeIndex,
      STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
        .STRUCTURE_FIELD_VIEW,
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
  withForm<PropsDutyMissionTemplateWithForm, DutyMissionTemplate>({
    uniqField: 'id',
    createAction: missionsActions.actionCreateDutyMissionTemplate,
    updateAction: missionsActions.actionUpdateDutyMissionTemplate,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultDutyMissionTemplateElement({
        ...element,
        structure_id: (element && element.structure_id) || userStructureId,
        structure_name:
          element && (element.structure_name || element.structure_id)
            ? null
            : userStructureName,
      });
    },
    schema: dutyDutyMissionTemplateFormSchema,
    permissions: dutyDutyMissionTemplatePermissions,
  }),
)(DutyMissionTemplateForm);
