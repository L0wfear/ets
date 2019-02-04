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
import missionActions from 'redux-main/reducers/modules/missions/actions';
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
import { getSessionState, getEmployeeState } from 'redux-main/reducers/selectors';

import FieldTechnicalOperationDutyMissionTemplate from 'components/missions/duty_mission_template/form/template/inside_fields/technical_operation/FieldTechnicalOperationDutyMissionTemplate';
import FieldMunicipalFacilityIdDutyMissionTemplate from './inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMissionTemplate';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import FieldForemanIdDutyMissionTemplate from './inside_fields/foreman_id/FieldForemanIdDutyMissionTemplate';
import FieldBrigadeEmployeeIdListDutyMissionTemplate from './inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMissionTemplate';
import FieldRouteAndStructureDutyMissionTemplate from 'components/missions/duty_mission_template/form/template/inside_fields/route_and_structure/FieldRouteAndStructureDutyMissionTemplate';

class DutyMissionTemplateForm extends React.PureComponent<PropsDutyMissionTemplateForm, {}> {
  componentDidMount() {
    const {
      page,
      path,
      formState: state,
    } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    if (isPermitted) {
      this.props.employeeGetAndSetInStore(
        {},
        { page, path },
      );
    }
  }

  componentWillUnmount() {
    const {
      formState: state,
    } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    if (isPermitted) {
      this.props.employeeEmployeeResetSetEmployee();
    }
  }

  handleHide = () => {
    this.props.handleHide(false);
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = !IS_CREATING ? 'Шаблон задания' : 'Создание шаблона задания';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-duty-mission-template" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={6}>
              <FieldTechnicalOperationDutyMissionTemplate
                value={state.technical_operation_id}
                name={state.technical_operation_name}
                disabled={!isPermitted}
                isPermitted={isPermitted}
                error={errors.technical_operation_id}
                onChange={this.props.handleChange}

                page={page}
                path={path}
              />
            </Col>
            <Col md={6}>
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
          <Row>
            <Col md={12}>
              <FieldMunicipalFacilityIdDutyMissionTemplate
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={!state.technical_operation_id || !isPermitted}
                error={errors.municipal_facility_id}
                isPermitted={isPermitted}
                onChange={this.props.handleChange}

                technical_operation_id={state.technical_operation_id}

                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FieldForemanIdDutyMissionTemplate
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
            <Col md={6}>
              <FieldBrigadeEmployeeIdListDutyMissionTemplate
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
          <FieldRouteAndStructureDutyMissionTemplate
            error_route_id={errors.route_id}
            error_structure_id={errors.structure_id}
            route_id={state.route_id}
            municipal_facility_id={state.municipal_facility_id}
            municipal_facility_name={state.municipal_facility_name}
            technical_operation_id={state.technical_operation_id}
            technical_operation_name={state.technical_operation_name}
            structure_id={state.structure_id}
            structure_name={state.structure_name}
            isPermitted={isPermitted}

            handleChange={this.props.handleChange}

            page={page}
            path={path}
          />
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsDutyMissionTemplateForm, OwnDutyMissionTemplateProps>(
  connect<StatePropsDutyMissionTemplate, DispatchPropsDutyMissionTemplate, OwnDutyMissionTemplateProps, ReduxState>(
    (state) => ({
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      employeeIndex: getEmployeeState(state).employeeIndex,
    }),
    (dispatch: any) => ({
      employeeGetAndSetInStore: (...arg) => (
        dispatch(
          employeeActions.employeeGetAndSetInStore(...arg),
        )
      ),
      employeeEmployeeResetSetEmployee: (...arg) => (
        dispatch(
          employeeActions.employeeEmployeeResetSetEmployee(...arg),
        )
      ),
    }),
  ),
  withForm<PropsDutyMissionTemplateWithForm, DutyMissionTemplate>({
    uniqField: 'id',
    createAction: missionActions.actionCreateDutyMissionTemplate,
    updateAction: missionActions.actionUpdateDutyMissionTemplate,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultDutyMissionTemplateElement({
        ...element,
        structure_id: element && element.structure_id || userStructureId,
        structure_name: element && (element.structure_name || element.structure_id) ? null : userStructureName,
      });
    },
    schema: dutyDutyMissionTemplateFormSchema,
    permissions: dutyDutyMissionTemplatePermissions,
  }),
)(DutyMissionTemplateForm);
