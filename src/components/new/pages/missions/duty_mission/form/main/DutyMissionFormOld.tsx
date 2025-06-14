import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  PropsDutyMissionForm,
  StatePropsDutyMission,
  DispatchPropsDutyMission,
  OwnDutyMissionProps,
} from './@types/index.h';

import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { ReduxState } from 'redux-main/@types/state';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import {
  dutyMissionIsDisplay,
  dutyMissionIsClosed,
  dutyMissionIsAssigned,
  dutyMissionIsComplete,
  dutyMissionIsNotAssigned,
} from './utils';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { DivNone } from 'global-styled/global-styled';

import FieldTechnicalOperationDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationDutyMission';
import FieldMunicipalFacilityIdDutyMission from './inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMission';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import FieldForemanIdDutyMission from './inside_fields/foreman_id/FieldForemanIdDutyMission';
import FieldBrigadeEmployeeIdListDutyMission from './inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMission';
import FieldDatesDutyMission from './inside_fields/dates/FieldDatesDutyMission';
import FieldStructureDutyMission from './inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getSomeUniqState } from 'redux-main/reducers/selectors/index';
import FieldRouteIdDutyMission from './inside_fields/route_id/FieldRouteIdDutyMission';
import FieldCarMissionIdDutyMission from './inside_fields/car_mission_id/FieldCarMissionIdDutyMission';

import { saveData } from 'utils/functions';
import { getMissionsState } from 'redux-main/reducers/selectors/index';

import {
  diffDates,
  createValidDateTime,
} from 'components/@next/@utils/dates/dates';
import FieldNormIdDutyMission from './inside_fields/norm_id/FieldNormIdDutyMission';

import { isOrderSource } from 'components/new/pages/missions/utils';
import FieldMissionSourceMission from 'components/new/pages/missions/mission/form/main/inside_fields/mission_source_id/FieldMissionSourceMission';
import FieldEdcRequestData from 'components/new/pages/missions/mission/form/main/inside_fields/edc_request/FieldEdcRequestData';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import FieldConsumableMaterials from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/FieldConsumableMaterials';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

class DutyMissionForm extends React.PureComponent<PropsDutyMissionForm, any> {
  constructor(props) {
    super(props);

    const { formState: state } = props;

    const IS_CREATING = !state.id;

    this.state = {
      isChanged: false,

      IS_CREATING,
      DUTY_MISSION_IS_NOT_ASSIGNED: dutyMissionIsNotAssigned(state.status),
      DUTY_MISSION_IS_DISPLAY: dutyMissionIsDisplay(state.status), // не назначенно
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

      timeId: null, // id таймера
    };
  }

  componentDidMount() {
    const loadData = async () => {
      const {
        page, path,
        formState: state,
        dependeceOrder,
        edcRequest,
      } = this.props;

      const {
        isPermitted,
        IS_CREATING,
        //DUTY_MISSION_IS_NOT_ASSIGNED,
        DUTY_MISSION_IS_ORDER_SOURCE,
        DUTY_MISSION_IS_DISPLAY,
      } = this.state;

      await this.props.employeeGetAndSetInStore({}, { page, path });

      if (isPermitted) {
        if (
          DUTY_MISSION_IS_ORDER_SOURCE
          && !DUTY_MISSION_IS_DISPLAY
        ) {
          if (!dependeceOrder) {
            await this.props.actionLoadOrderAndTechnicalOperationByIdForDutyMission(
              state.faxogramm_id,
              state.order_operation_id,
              { page, path },
            );
          }
        }

        if ((state.request_id  && state.request_id !== -1) && !edcRequest || (edcRequest && edcRequest.id && edcRequest.id !== state.request_id)) {
          await this.props.loadEdcRequiedByIdForDutyMission(
            state.request_id,
            { page, path },
          );
        }
      }

      if (IS_CREATING) {
        this.checkOnMosckowTime();
        if (!DUTY_MISSION_IS_ORDER_SOURCE && !dependeceOrder) {
          this.props.handleChange('passes_count', 1);
        }
      }

      this.checkErrorsWithTime(true);

      const timeId = this.setTimer(() => {
        this.checkErrorsWithTime();
      });
      this.setState({timeId});

      this.props.updateFormErrors();
    };

    loadData();
  }

  async checkErrorsWithTime(first?: boolean) {
    await this.props.actionGetAndSetInStoreMoscowTimeServer(
      {},
      first
        ? {
          page: this.props.page,
          path: this.props.path,
        }
        : {
          page: 'null',
        }
    );
    this.props.updateFormErrors();
  }

  setTimer(callBackFunc) {
    // const currentDate = new Date();
    const timeId = setInterval(
      callBackFunc,
      30000,
    );
    return timeId;
  }

  clearTimer(timeId) {
    clearInterval(timeId);
  }

  async checkOnMosckowTime() {
    const {
      date,
    } = await this.props.dispatch(
      actionLoadTimeMoscow(
        {},
        {
          page: this.props.page,
          path: this.props.path,
        },
      ),
    );

    const currentTime = createValidDateTime(date);

    const { formState } = this.props;

    if (diffDates(currentTime, formState.plan_date_start) > 0) {
      this.props.handleChange(
        'plan_date_start',
        currentTime,
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
      isPermitted
      && DUTY_MISSION_IS_ORDER_SOURCE
      && !DUTY_MISSION_IS_DISPLAY
    ) {
      if (dependeceOrder) {
        this.props.actionSetDependenceOrderDataForDutyMission(null, null);
      }
    }

    this.props.actionReseSetDependenceMissionDataForDutyMissionForm();
    if(this.state.timeId) {
      this.clearTimer(this.state.timeId);
    }
  }

  handleGetPrintForm = async () => {
    const { formState: state, page, path } = this.props;

    const { DUTY_MISSION_IS_DISPLAY } = this.state;

    const result: DutyMission = await this.props.submitAction(state);

    if (result) {
      let printFormData = null;
      try {
        printFormData = await this.props.actionPrintFormDutyMission(result.id, {
          page,
          path,
        });
      } catch (error) {
        console.warn('Ошибка загрузки ПФ наряд-задания', result.id); // eslint-disable-line
      }

      if (!DUTY_MISSION_IS_DISPLAY) {
        this.props.handleHide(true, result);
      } else {
        this.props.handleChange(result);
        this.setState({
          isChanged: true,
        });
      }

      if (printFormData) {
        saveData(
          printFormData.blob,
          `Наряд-задание №${result.number}.pdf`,
        );
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
      isPermitted,
    } = this.props;

    const {
      IS_CREATING,
      DUTY_MISSION_IS_DISPLAY,
      DUTY_MISSION_IS_CLOSED,
      DUTY_MISSION_IS_ASSIGNED,
      DUTY_MISSION_IS_NOT_ASSIGNED,
      DUTY_MISSION_IS_COMPLETED,
      DUTY_MISSION_IS_ORDER_SOURCE,
    } = this.state;

    const title = IS_CREATING ? (
      'Создание наряд-задания'
    ) : (
      <div>
        {`Наряд-задание № ${state.number_text || ''}`}
        <EtsBootstrap.BackgroundLabel bsStyle="default">
          {DUTY_MISSION_STATUS_LABELS[state.status]}
        </EtsBootstrap.BackgroundLabel>
      </div>
    );

    return (
      <EtsBootstrap.ModalContainer
        id="modal-duty-mission"
        show
        onHide={this.handleHideFom}
        bsSize="large"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <FieldTechnicalOperationDutyMission
                value={state.technical_operation_id}
                name={state.technical_operation_name}
                disabled={
                  !isPermitted
                  || DUTY_MISSION_IS_DISPLAY
                  || DUTY_MISSION_IS_ORDER_SOURCE
                }
                isPermitted={
                  isPermitted
                  && !DUTY_MISSION_IS_DISPLAY
                  && !DUTY_MISSION_IS_ORDER_SOURCE
                }
                error={errors.technical_operation_id}
                onChange={this.props.handleChange}
                IS_TEMPLATE={false}
                DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={DUTY_MISSION_IS_ORDER_SOURCE ? 3 : 6}>
              <FieldMissionSourceMission
                value={state.mission_source_id}
                name={state.mission_source_name}
                error={errors.mission_source_id}
                disabled={
                  !isPermitted
                  || DUTY_MISSION_IS_DISPLAY
                  || DUTY_MISSION_IS_ORDER_SOURCE
                  || state.request_id
                }
                isPermitted={
                  isPermitted
                  && !DUTY_MISSION_IS_DISPLAY
                  && !DUTY_MISSION_IS_ORDER_SOURCE
                  && Boolean(state.request_id)
                }

                request_id={state.request_id}
                request_number={state.request_number}

                onChange={this.props.handleChange}
                page={page}
                path={path}
              />
              {IS_CREATING && !DUTY_MISSION_IS_ORDER_SOURCE ? (
                <div className="help-block-mission-source">
                  Задания на основе централизованных заданий необходимо
                  создавать во вкладке "НСИ"-"Реестр централизованных заданий".
                </div>
              ) : (
                <DivNone />
              )}
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={DUTY_MISSION_IS_ORDER_SOURCE ? 3 : 0}>
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
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FieldMunicipalFacilityIdDutyMission
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={
                  !state.technical_operation_id
                  || !isPermitted
                  || DUTY_MISSION_IS_DISPLAY
                  || DUTY_MISSION_IS_ORDER_SOURCE
                }
                error={errors.municipal_facility_id}
                isPermitted={
                  isPermitted
                  && !DUTY_MISSION_IS_DISPLAY
                  && !DUTY_MISSION_IS_ORDER_SOURCE
                }
                onChange={this.props.handleChange}
                technical_operation_id={state.technical_operation_id}
                IS_TEMPLATE={false}
                DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
                page={page}
                path={path}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={STRUCTURE_FIELD_VIEW ? 6 : 12}>
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
                </EtsBootstrap.Col>
                {STRUCTURE_FIELD_VIEW ? (
                  <EtsBootstrap.Col md={6}>
                    <FieldStructureDutyMission
                      value={state.structure_id}
                      name={state.structure_name}
                      error={errors.structure_id}
                      disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
                      isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
                      onChange={this.props.handleChange}
                      page={page}
                      path={path}

                      formDataKey={this.props.formDataKey}
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
                    isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
                    disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
                    onChange={this.props.handleChange}
                    foreman_id={state.foreman_id}
                    structure_id={state.structure_id}
                    page={page}
                    path={path}
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
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
                consumable_materials={state.consumable_materials}
                order_operation_id={state.order_operation_id}

                is_cleaning_norm={state.is_cleaning_norm}
                object_type_name={state.object_type_name}
                norm_id={state.norm_id}
                route_id={state.route_id}
                municipal_facility_id={state.municipal_facility_id}

                DUTY_MISSION_IS_DISPLAY={DUTY_MISSION_IS_DISPLAY}
                DUTY_MISSION_IS_CLOSED={DUTY_MISSION_IS_CLOSED}
                DUTY_MISSION_IS_ASSIGNED={DUTY_MISSION_IS_ASSIGNED}
                DUTY_MISSION_IS_COMPLETED={DUTY_MISSION_IS_COMPLETED}
                IS_CREATING={IS_CREATING}
                onChange={this.props.handleChange}
                page={page}
                path={path}

                formDataKey={this.props.formDataKey}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FieldEdcRequestData request_id={state.request_id} edcRequest={this.props.edcRequest} />
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
            request_id={state.request_id}
            DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
            disabled={!isPermitted || DUTY_MISSION_IS_DISPLAY}
            isPermitted={isPermitted && !DUTY_MISSION_IS_DISPLAY}
            structure_id={state.structure_id}
            structure_name={state.structure_name}
            consumable_materials={state.consumable_materials}
            formDataKey={this.props.formDataKey}
            onChange={this.props.handleChange}
            fromMission={true}
            fromMissionTemplate={false}
            page={page}
            path={path}
          />
          {
            state.technical_operation_id && state.municipal_facility_id && state.route_id && state.norm_id && (
              <FieldConsumableMaterials formDataKey={this.props.formDataKey} />
            )
          }
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
                onChange={this.props.handleChange}
                boundKeys="comment"
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
                disabled={!(IS_CREATING || DUTY_MISSION_IS_ASSIGNED || DUTY_MISSION_IS_NOT_ASSIGNED)}
                onChange={this.props.handleChange}
                boundKeys="passes_count"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
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
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <FieldNormIdDutyMission
            value={state.norm_id}
            datetime={state.plan_date_start}
            technical_operation_id={state.technical_operation_id}
            municipal_facility_id={state.municipal_facility_id}
            route_type={state.route_type}
            disabled={DUTY_MISSION_IS_DISPLAY}
            onChange={this.props.handleChange}
            IS_TEMPLATE={false}
            DUTY_MISSION_IS_ORDER_SOURCE={DUTY_MISSION_IS_ORDER_SOURCE}
            page={page}
            path={path}
          />
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? ( // либо обновление, либо создание
            <EtsButtonsContainer>
              <EtsBootstrap.Button
                onClick={this.handleGetPrintForm}
                disabled={!this.props.canSave}>
                <EtsBootstrap.Glyphicon id="dm-download-all" glyph="download-alt" />{' '}
                {DUTY_MISSION_IS_DISPLAY ? 'Просмотр' : 'Выдать'}
              </EtsBootstrap.Button>
              <EtsBootstrap.Button
                disabled={!this.props.canSave}
                onClick={this.props.defaultSubmit}>
                Сохранить
              </EtsBootstrap.Button>
            </EtsButtonsContainer>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsDutyMissionForm, OwnDutyMissionProps>(
  connect<StatePropsDutyMission, DispatchPropsDutyMission, OwnDutyMissionProps, ReduxState>(
    (state) => ({
      edcRequest: getMissionsState(state).dutyMissionData.edcRequest,
      dependeceOrder: getMissionsState(state).dutyMissionData.dependeceOrder,
      STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
        .STRUCTURE_FIELD_VIEW,
      order_mission_source_id: getSomeUniqState(state).missionSource
        .order_mission_source_id,
      moscowTimeServer: getSomeUniqState(state).moscowTimeServer,
    }),
    (dispatch: any) => ({
      dispatch,
      employeeGetAndSetInStore: (...arg) =>
        dispatch(employeeActions.employeeGetAndSetInStore(...arg)),
      employeeEmployeeResetSetEmployee: (...arg) =>
        dispatch(employeeActions.employeeEmployeeResetSetEmployee(...arg)),
      actionPrintFormDutyMission: (...arg) =>
        dispatch(missionsActions.actionPrintFormDutyMission(...arg)),
      actionLoadOrderAndTechnicalOperationByIdForDutyMission: (...arg) =>
        dispatch(
          missionsActions.actionLoadOrderAndTechnicalOperationByIdForDutyMission(...arg),
        ),
      actionSetDependenceOrderDataForDutyMission: (...arg) =>
        dispatch(
          missionsActions.actionSetDependenceOrderDataForDutyMission(...arg),
        ),
      loadEdcRequiedByIdForDutyMission: (...arg) => (
        dispatch(
          missionsActions.loadEdcRequiedByIdForDutyMission(...arg),
        )
      ),
      actionReseSetDependenceMissionDataForDutyMissionForm: (...arg) => (
        dispatch(
          missionsActions.actionReseSetDependenceMissionDataForDutyMissionForm(...arg),
        )
      ),
      actionGetAndSetInStoreMoscowTimeServer: (payload, meta) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreMoscowTimeServer(payload, meta),
        )
      ),
      actionResetMoscowTimeServer: () => (
        dispatch(
          someUniqActions.actionResetMoscowTimeServer(),
        )
      ),
    }),
  ),
)(DutyMissionForm);
