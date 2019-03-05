import * as React from 'react';

import {
  PropsDutyMissionTemplateForm,
  StatePropsDutyMissionTemplate,
  DispatchPropsDutyMissionTemplate,
  OwnDutyMissionTemplateProps,
  PropsDutyMissionTemplateWithForm,
} from './@types/index.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import dutyDutyMissionTemplatePermissions from 'components/missions/duty_mission_template/config-data/permissions';
import { ReduxState } from 'redux-main/@types/state';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { getDefaultDutyMissionTemplateElement } from './utils';
import { dutyDutyMissionTemplateFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import {
  getSessionState,
  getEmployeeState,
} from 'redux-main/reducers/selectors';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import FieldTechnicalOperationDutyMission from 'components/missions/duty_mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationDutyMission';
import FieldMunicipalFacilityIdDutyMission from 'components/missions/duty_mission/form/main/inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMission';
import FieldForemanIdDutyMission from 'components/missions/duty_mission/form/main/inside_fields/foreman_id/FieldForemanIdDutyMission';
import FieldBrigadeEmployeeIdListDutyMission from 'components/missions/duty_mission/form/main/inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMission';
import FieldStructureDutyMission from 'components/missions/duty_mission/form/main/inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import FieldRouteIdDutyMission from 'components/missions/duty_mission/form/main/inside_fields/route_id/FieldRouteIdDutyMission';
import EtsModal from 'components/new/ui/modal/Modal';

class DutyMissionTemplateForm extends React.PureComponent<
  PropsDutyMissionTemplateForm,
  {}
> {
  componentDidMount() {
    const { page, path } = this.props;

    this.props.employeeGetAndSetInStore({}, { page, path });
  }

  componentWillUnmount() {
    const { formState: state } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    if (isPermitted) {
      this.props.employeeEmployeeResetSetEmployee();
    }
  }

  handleHide = () => {
    this.props.handleHide(false);
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      STRUCTURE_FIELD_VIEW,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = !IS_CREATING ? 'Шаблон задания' : 'Создание шаблона задания';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsModal
        id="modal-duty-mission-template"
        show
        deepLvl={this.props.deepLvl}
        onHide={this.handleHide}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <FieldTechnicalOperationDutyMission
                value={state.technical_operation_id}
                name={state.technical_operation_name}
                disabled={!isPermitted}
                isPermitted={isPermitted}
                error={errors.technical_operation_id}
                onChange={this.props.handleChange}
                IS_TEMPLATE
                DUTY_MISSION_IS_ORDER_SOURCE={false}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FieldMunicipalFacilityIdDutyMission
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={!state.technical_operation_id || !isPermitted}
                error={errors.municipal_facility_id}
                isPermitted={isPermitted}
                onChange={this.props.handleChange}
                technical_operation_id={state.technical_operation_id}
                IS_TEMPLATE
                DUTY_MISSION_IS_ORDER_SOURCE={false}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 6 : 12}>
              <FieldForemanIdDutyMission
                value={state.foreman_id}
                foreman_fio={state.foreman_fio}
                foreman_full_fio={state.foreman_full_fio}
                name={state.foreman_fio}
                error={errors.foreman_id}
                isPermitted={isPermitted}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                structure_id={state.structure_id}
                page={page}
                path={path}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW ? (
              <Col md={6}>
                <FieldStructureDutyMission
                  value={state.structure_id}
                  name={state.structure_name}
                  error={errors.structure_id}
                  disabled={!isPermitted}
                  isPermitted={isPermitted}
                  onChange={this.props.handleChange}
                  page={page}
                  path={path}
                />
              </Col>
            ) : (
              <DivNone />
            )}
            <Col md={12}>
              <FieldBrigadeEmployeeIdListDutyMission
                brigade_employee_id_list={state.brigade_employee_id_list}
                value={state.brigade_employee_id_list_id}
                name={state.brigade_employee_id_list_fio}
                error={errors.brigade_employee_id_list_id}
                isPermitted={isPermitted}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                foreman_id={state.foreman_id}
                structure_id={state.structure_id}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
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
                onChange={this.props.handleChange}
                deepLvl={this.props.deepLvl}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                id="comment"
                modalKey={page}
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="comment"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted ? ( // либо обновление, либо создание
            <Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </Button>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default compose<
  PropsDutyMissionTemplateForm,
  OwnDutyMissionTemplateProps
>(
  connect<
    StatePropsDutyMissionTemplate,
    DispatchPropsDutyMissionTemplate,
    OwnDutyMissionTemplateProps,
    ReduxState
  >(
    (state) => ({
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      employeeIndex: getEmployeeState(state).employeeIndex,
      STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
        .STRUCTURE_FIELD_VIEW,
    }),
    (dispatch: any) => ({
      employeeGetAndSetInStore: (...arg) =>
        dispatch(employeeActions.employeeGetAndSetInStore(...arg)),
      employeeEmployeeResetSetEmployee: (...arg) =>
        dispatch(employeeActions.employeeEmployeeResetSetEmployee(...arg)),
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
