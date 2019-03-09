import * as React from 'react';
import { Label } from 'react-bootstrap';

import {
  PropsDutyMissionForm,
  StatePropsDutyMission,
  DispatchPropsDutyMission,
  OwnDutyMissionProps,
  PropsDutyMissionWithForm,
} from './@types/index.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import dutyDutyMissionPermissions from 'components/missions/duty_mission/config-data/permissions';
import { ReduxState } from 'redux-main/@types/state';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import {
  getDefaultDutyMissionElement,
  dutyMissionIsDisplay,
  dutyMissionIsClosed,
  dutyMissionIsAssigned,
  dutyMissionIsComplete,
} from './utils';
import { dutyDutyMissionFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { DivNone } from 'global-styled/global-styled';
import {
  getSessionState,
  getEmployeeState,
} from 'redux-main/reducers/selectors';

import FieldTechnicalOperationDutyMission from 'components/missions/duty_mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationDutyMission';
import FieldMunicipalFacilityIdDutyMission from './inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMission';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import FieldForemanIdDutyMission from './inside_fields/foreman_id/FieldForemanIdDutyMission';
import FieldBrigadeEmployeeIdListDutyMission from './inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMission';
import FieldDatesDutyMission from './inside_fields/dates/FieldDatesDutyMission';
import FieldStructureDutyMission from './inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { ExtField } from 'components/ui/new/field/ExtField';
import FieldMissionSourceDutyMission from './inside_fields/mission_source_id/FieldMissionSourceDutyMission';
import { isOrderSource } from 'components/missions/duty_mission/form/main/utils';
import { getSomeUniqState } from 'redux-main/reducers/selectors/index';
import FieldRouteIdDutyMission from './inside_fields/route_id/FieldRouteIdDutyMission';
import FieldCarMissionIdDutyMission from './inside_fields/car_mission_id/FieldCarMissionIdDutyMission';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { saveData } from 'utils/functions';
import { DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/mission/constants';
import { getMissionsState } from 'redux-main/reducers/selectors/index';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import {
  getDateWithMoscowTzByTimestamp,
  diffDates,
  createValidDateTime,
} from 'utils/dates';
import FieldNormIdDutyMission from './inside_fields/norm_id/FieldNormIdDutyMission';
import EtsModal from 'components/new/ui/modal/Modal';

class DutyMissionForm extends React.PureComponent<PropsDutyMissionForm, any> {
  constructor(props) {
    super(props);

    const { formState: state } = props;

    const IS_CREATING = !state.id;

    this.state = {
      isChanged: false,

      IS_CREATING,
      DUTY_MISSION_IS_DISPLAY: dutyMissionIsDisplay(state.status),
      DUTY_MISSION_IS_CLOSED: dutyMissionIsClosed(state.status),
      DUTY_MISSION_IS_ASSIGNED: dutyMissionIsAssigned(state.status),
      DUTY_MISSION_IS_COMPLETED: dutyMissionIsComplete(state.status),
      DUTY_MISSION_IS_ORDER_SOURCE: isOrderSource(
        state.mission_source_id,
        this.props.order_mission_source_id,
      ),
      isPermitted: !IS_CREATING
        ? props.isPermittedToUpdate
        : props.isPermittedToCreate,
    };
  }

  componentDidMount() {
    const { page, path, formState: state, dependeceOrder } = this.props;

    const {
      isPermitted,
      IS_CREATING,
      DUTY_MISSION_IS_ORDER_SOURCE,
      DUTY_MISSION_IS_DISPLAY,
    } = this.state;

    this.props.employeeGetAndSetInStore({}, { page, path });

    if (
      isPermitted &&
      DUTY_MISSION_IS_ORDER_SOURCE &&
      !DUTY_MISSION_IS_DISPLAY
    ) {
      if (!dependeceOrder) {
        this.props.actionLoadOrderAndTechnicalOperationById(
          state.faxogramm_id,
          state.order_operation_id,
          { page, path },
        );
      }
      if (IS_CREATING) {
        this.checkOnMosckowTime();
      }
    }
  }

  async checkOnMosckowTime() {
    const {
      time: { date },
    } = await loadMoscowTime();

    const currentTime = getDateWithMoscowTzByTimestamp(date);

    const { formState } = this.props;

    if (diffDates(currentTime, formState.plan_date_start) > 0) {
      this.props.handleChange(
        'plan_date_start',
        createValidDateTime(currentTime),
      );
    }
  }

  componentWillUnmount() {
    const { dependeceOrder } = this.props;

    const {
      isPermitted,
      DUTY_MISSION_IS_ORDER_SOURCE,
      DUTY_MISSION_IS_DISPLAY,
    } = this.state;

    this.props.employeeEmployeeResetSetEmployee();

    if (
      isPermitted &&
      DUTY_MISSION_IS_ORDER_SOURCE &&
      !DUTY_MISSION_IS_DISPLAY
    ) {
      if (dependeceOrder) {
        this.props.actionSetDependenceOrderDataForDutyMission(null, null);
      }
    }
  }

  handleGetPrintForm = async () => {
    const { formState: state, page, path } = this.props;

    const { DUTY_MISSION_IS_DISPLAY } = this.state;

    const result: DutyMission = await this.props.submitAction(state, {
      page,
      path,
    });

    if (result) {
      let printFormData = null;
      try {
        printFormData = await this.props.actionPrintFormDutyMission(result.id, {
          page,
          path,
        });
      } catch (error) {
        console.warn('Ошибка загрузки ПФ наряд-задания', result.id); // tslint:disable-line:no-console
      }

      if (printFormData) {
        saveData(
          printFormData.blob,
          `Печатная форма наряд-задания №${result.id}.pdf`,
        );

        if (!DUTY_MISSION_IS_DISPLAY) {
          this.props.handleHide(true, result);
        } else {
          this.props.handleChange(result);
          this.setState({
            isChanged: true,
          });
        }
      }
    }
  };

  handleHideFom = () => {
    if (this.state.isChanged) {
      this.props.handleHide(true, this.props.formState);
    } else {
      this.props.handleHide(false);
    }
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      STRUCTURE_FIELD_VIEW,
    } = this.props;

    const {
      IS_CREATING,
      DUTY_MISSION_IS_DISPLAY,
      DUTY_MISSION_IS_CLOSED,
      DUTY_MISSION_IS_ASSIGNED,
      DUTY_MISSION_IS_COMPLETED,
      DUTY_MISSION_IS_ORDER_SOURCE,
    } = this.state;

    const title = IS_CREATING ? (
      'Создание наряд-задания'
    ) : (
      <div>
        {`Наряд-задание № ${state.number || ''}`}
        <Label bsStyle="default" style={{ marginLeft: 10 }}>
          {DUTY_MISSION_STATUS_LABELS[state.status]}
        </Label>
      </div>
    );

    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsModal
        id="modal-duty-mission"
        show
        onHide={this.handleHideFom}
        bsSize="large"
        backdrop="static"
        deepLvl={this.props.deepLvl}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={6}>
              <FieldTechnicalOperationDutyMission
                value={state.technical_operation_id}
                name={state.technical_operation_name}
                disabled={
                  !isPermitted ||
                  DUTY_MISSION_IS_DISPLAY ||
                  DUTY_MISSION_IS_ORDER_SOURCE
                }
                isPermitted={
                  isPermitted &&
                  !DUTY_MISSION_IS_DISPLAY &&
                  !DUTY_MISSION_IS_ORDER_SOURCE
                }
                error={errors.technical_operation_id}
                onChange={this.props.handleChange}
                IS_TEMPLATE={false}
                DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
                page={page}
                path={path}
              />
            </Col>
            <Col md={DUTY_MISSION_IS_ORDER_SOURCE ? 3 : 6}>
              <FieldMissionSourceDutyMission
                value={state.mission_source_id}
                name={state.mission_source_name}
                error={errors.mission_source_id}
                disabled={
                  !isPermitted ||
                  DUTY_MISSION_IS_DISPLAY ||
                  DUTY_MISSION_IS_ORDER_SOURCE
                }
                isPermitted={
                  isPermitted &&
                  !DUTY_MISSION_IS_DISPLAY &&
                  !DUTY_MISSION_IS_ORDER_SOURCE
                }
                onChange={this.props.handleChange}
                page={page}
                path={path}
              />
              {IS_CREATING && !DUTY_MISSION_IS_ORDER_SOURCE ? (
                <span className="help-block-mission-source">
                  Задания на основе централизованных заданий необходимо
                  создавать во вкладке "НСИ"-"Реестр централизованных заданий".
                </span>
              ) : (
                <DivNone />
              )}
            </Col>
            <Col md={DUTY_MISSION_IS_ORDER_SOURCE ? 3 : 0}>
              {DUTY_MISSION_IS_ORDER_SOURCE ? (
                <ExtField
                  id="order-number"
                  type="string"
                  label="Номер централизованного задания"
                  readOnly
                  value={state.order_number}
                />
              ) : (
                <DivNone />
              )}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FieldMunicipalFacilityIdDutyMission
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={
                  !state.technical_operation_id ||
                  !isPermitted ||
                  DUTY_MISSION_IS_DISPLAY ||
                  DUTY_MISSION_IS_ORDER_SOURCE
                }
                error={errors.municipal_facility_id}
                isPermitted={
                  isPermitted &&
                  !DUTY_MISSION_IS_DISPLAY &&
                  !DUTY_MISSION_IS_ORDER_SOURCE
                }
                onChange={this.props.handleChange}
                technical_operation_id={state.technical_operation_id}
                IS_TEMPLATE={false}
                DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={STRUCTURE_FIELD_VIEW ? 6 : 12}>
                  <FieldForemanIdDutyMission
                    value={state.foreman_id}
                    foreman_fio={state.foreman_fio}
                    foreman_full_fio={state.foreman_full_fio}
                    name={state.foreman_fio}
                    error={errors.foreman_id}
                    isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
                    disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
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
                      disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
                      isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
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
                    isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
                    disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
                    onChange={this.props.handleChange}
                    foreman_id={state.foreman_id}
                    structure_id={state.structure_id}
                    page={page}
                    path={path}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <FieldDatesDutyMission
                isPermitted={isPermitted}
                plan_date_start={state.plan_date_start}
                error_plan_date_start={errors.plan_date_start}
                plan_date_end={state.plan_date_end}
                error_plan_date_end={errors.plan_date_end}
                fact_date_start={state.fact_date_start}
                error_fact_date_start={errors.fact_date_start}
                fact_date_end={state.fact_date_end}
                error_fact_date_end={errors.fact_date_end}
                DUTY_MISSION_IS_DISPLAY={DUTY_MISSION_IS_DISPLAY}
                DUTY_MISSION_IS_CLOSED={DUTY_MISSION_IS_CLOSED}
                DUTY_MISSION_IS_ASSIGNED={DUTY_MISSION_IS_ASSIGNED}
                DUTY_MISSION_IS_COMPLETED={DUTY_MISSION_IS_COMPLETED}
                onChange={this.props.handleChange}
                page={page}
                path={path}
              />
            </Col>
          </Row>
          <FieldRouteIdDutyMission
            error={errors.route_id}
            value={state.route_id}
            name={state.route_name}
            municipal_facility_id={state.municipal_facility_id}
            municipal_facility_name={state.municipal_facility_name}
            technical_operation_id={state.technical_operation_id}
            technical_operation_name={state.technical_operation_name}
            DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
            disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
            isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
            structure_id={state.structure_id}
            structure_name={state.structure_name}
            onChange={this.props.handleChange}
            deepLvl={this.props.deepLvl}
            page={page}
            path={path}
          />
          <Row>
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
            <Col md={6}>
              <FieldCarMissionIdDutyMission
                value={state.car_mission_id}
                name={state.car_mission_name}
                error={errors.car_mission_id}
                plan_date_start={state.plan_date_start}
                plan_date_end={state.plan_date_end}
                technical_operation_id={state.technical_operation_id}
                disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
                isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
                onChange={this.props.handleChange}
                path={path}
                page={page}
              />
            </Col>
          </Row>
          <FieldNormIdDutyMission
            value={state.norm_id}
            datetime={state.plan_date_start}
            technical_operation_id={state.technical_operation_id}
            municipal_facility_id={state.municipal_facility_id}
            route_id={state.route_id}
            disabled={DUTY_MISSION_IS_DISPLAY}
            onChange={this.props.handleChange}
            IS_TEMPLATE={false}
            DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
            page={page}
            path={path}
          />
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted ? ( // либо обновление, либо создание
            <>
              <Button
                onClick={this.handleGetPrintForm}
                disabled={!this.props.canSave}>
                <Glyphicon id="dm-download-all" glyph="download-alt" />{' '}
                {DUTY_MISSION_IS_DISPLAY ? 'Просмотр' : 'Выдать'}
              </Button>
              <Button
                disabled={!this.props.canSave}
                onClick={this.props.defaultSubmit}>
                Сохранить
              </Button>
            </>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default compose<PropsDutyMissionForm, OwnDutyMissionProps>(
  connect<
    StatePropsDutyMission,
    DispatchPropsDutyMission,
    OwnDutyMissionProps,
    ReduxState
  >(
    (state) => ({
      dependeceOrder: getMissionsState(state).dutyMissionData.dependeceOrder,
      dependeceTechnicalOperation: getMissionsState(state).dutyMissionData
        .dependeceTechnicalOperation,
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      employeeIndex: getEmployeeState(state).employeeIndex,
      STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
        .STRUCTURE_FIELD_VIEW,
      order_mission_source_id: getSomeUniqState(state).missionSource
        .order_mission_source_id,
    }),
    (dispatch: any) => ({
      employeeGetAndSetInStore: (...arg) =>
        dispatch(employeeActions.employeeGetAndSetInStore(...arg)),
      employeeEmployeeResetSetEmployee: (...arg) =>
        dispatch(employeeActions.employeeEmployeeResetSetEmployee(...arg)),
      actionPrintFormDutyMission: (...arg) =>
        dispatch(missionsActions.actionPrintFormDutyMission(...arg)),
      actionLoadOrderAndTechnicalOperationById: (...arg) =>
        dispatch(
          missionsActions.actionLoadOrderAndTechnicalOperationById(...arg),
        ),
      actionSetDependenceOrderDataForDutyMission: (...arg) =>
        dispatch(
          missionsActions.actionSetDependenceOrderDataForDutyMission(...arg),
        ),
    }),
  ),
  withForm<PropsDutyMissionWithForm, DutyMission>({
    uniqField: 'id',
    createAction: missionsActions.actionCreateDutyMission,
    updateAction: missionsActions.actionUpdateDutyMission,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultDutyMissionElement({
        ...element,
        structure_id: (element && element.structure_id) || userStructureId,
        structure_name:
          element && (element.structure_name || element.structure_id)
            ? null
            : userStructureName,
      });
    },
    schema: dutyDutyMissionFormSchema,
    permissions: dutyDutyMissionPermissions,
  }),
)(DutyMissionForm);
