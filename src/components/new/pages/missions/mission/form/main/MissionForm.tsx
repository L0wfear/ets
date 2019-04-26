import * as React from 'react';

import {
  PropsMissionForm,
  StatePropsMission,
  DispatchPropsMission,
  OwnMissionProps,
  PropsMissionWithForm,
} from './@types/index.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { ReduxState } from 'redux-main/@types/state';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getDefaultMissionElement } from './utils';
import { missionFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState, getSomeUniqState, getMissionsState } from 'redux-main/reducers/selectors';

import FieldTechnicalOperationMission from 'components/new/pages/missions/mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationMission';
import withMapInConsumer from 'components/new/ui/map/context/withMapInConsumer';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import MissionFormTitle from './inside_fields/title/MissionFormTitle';
import FieldStructureMission from './inside_fields/structure/FieldStructureMission';
import FieldMunicipalFacilityIdMission from './inside_fields/municipal_facility_id/FieldMunicipalFacilityIdMission';
import FieldDatesMission from './inside_fields/dates/FieldDatesMission';
import FieldCarIdsMission from './inside_fields/car_ids/FieldCarIdsMission';
import FieldForColumnMission from './inside_fields/for_column/FieldForColumnMission';
import FieldRouteIdMission from './inside_fields/route_id/FieldRouteIdMission';
import { ExtField } from 'components/ui/new/field/ExtField';
import FieldMissionSourceMission from './inside_fields/mission_source_id/FieldMissionSourceMission';
import EtsModal from 'components/new/ui/modal/Modal';
import { diffDates } from 'utils/dates';
import { Button, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import FieldAssignToWaybillMission from './inside_fields/assign_to_waybill/FieldAssignToWaybillMission';
import ColumnAssignmentFormLazy from './column_assignment';
import FieldNormIdMission from './inside_fields/norm_id/FieldNormIdMission';
import { IPropsHiddenMapForPrint } from './inside_fields/route_id/print/HiddenMapForPrint';
import { saveData, printData } from 'utils/functions';
import {
  BtnGroupWrapper,
  DisplayFlexAlignCenterFooterForm,
  BtnPart,
} from 'global-styled/global-styled';
import FieldEdcRequestData from './inside_fields/edc_request/FieldEdcRequestData';
import { isOrderSource } from 'components/new/pages/missions/utils';
import missionPermissions from '../../_config-data/permissions';

const smallPrintMapKey = 'smallPrintMapKey';

class MissionForm extends React.PureComponent<PropsMissionForm, any> {
  constructor(props: PropsMissionForm) {
    super(props);

    const { formState: state } = props;

    const IS_CREATING = !state.status;
    const IS_COMPLETE = state.status === 'complete';
    const IS_FAIL = state.status === 'fail';
    const IS_ASSIGNED = state.status === 'assigned';
    const IS_NOT_ASSIGNED = state.status === 'not_assigned';
    const IS_EXPIRED = state.status === 'expired';
    const IS_IN_PROGRESS = state.status === 'in_progress';
    const IS_DEFERRED = diffDates(state.date_start, new Date()) > 0;
    const IS_POST_CREATING_NOT_ASSIGNED = (
      IS_NOT_ASSIGNED
      || (
        IS_CREATING
        && state.waybill_id
      )
    );
    const IS_POST_CREATING_ASSIGNED = (IS_ASSIGNED || IS_EXPIRED || IS_IN_PROGRESS) && IS_DEFERRED;
    const IS_DISPLAY = (
      !IS_CREATING
      && !(
        IS_POST_CREATING_NOT_ASSIGNED
        || IS_POST_CREATING_ASSIGNED
        )
    );
    const BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE = Boolean(props.formState.can_edit_car_and_route);
    const IS_DISABLED_ASSIGNED = (
      (
        IS_ASSIGNED
        || IS_EXPIRED
        || IS_IN_PROGRESS
      )
        ? false
        : IS_DISPLAY
    ); // флаг для возможности редактирования поля задач со статусом "Назначено", in_progress, expired

    const hiddenMapConfig: IPropsHiddenMapForPrint['hiddenMapConfig'] = [
      {
        printMapKey: smallPrintMapKey,
        width: '602px',
        height: '912px',
      },
    ];

    this.state = {
      isChanged: false,
      assign_to_waybill: [state.waybill_id ? 'not_assign' : 'assign_to_new_draft'],
      IS_CREATING,
      IS_COMPLETE,
      IS_FAIL,
      MISSION_IS_ORDER_SOURCE: isOrderSource(
        state.mission_source_id,
        this.props.order_mission_source_id,
      ),
      isPermitted: !IS_CREATING
        ? props.isPermittedToUpdate
        : props.isPermittedToCreate,
      IS_ASSIGNED,
      IS_NOT_ASSIGNED,
      IS_EXPIRED,
      IS_IN_PROGRESS,
      IS_DEFERRED,
      IS_POST_CREATING_NOT_ASSIGNED,
      IS_POST_CREATING_ASSIGNED,
      IS_DISPLAY,
      IS_DISABLED_ASSIGNED,
      BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE,

      showColumnAssignmentFormLazy: false,
      hiddenMapConfig,

      likeNewMission: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      IS_ASSIGNED,
      BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE,
    } = prevState;

    const {
      formState,
      originalFormState,
    } = nextProps;

    if (
      IS_ASSIGNED
      && BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
      && formState.car_ids !== originalFormState.car_ids
    ) {
      return {
        likeNewMission: true,
      };
    }

    return null;
  }

  componentDidMount() {
    const {
      page, path,
      formState: state,
      dependeceOrder,
      waybillData,
      edcRequest,
    } = this.props;

    const {
      isPermitted,
      MISSION_IS_ORDER_SOURCE,
    } = this.state;

    if (isPermitted) {
      if (MISSION_IS_ORDER_SOURCE && !dependeceOrder) {
        this.props.actionLoadOrderAndTechnicalOperationByIdForMission(
          state.order_id,
          state.order_operation_id,
          { page, path },
        );
      }

      if ((state.waybill_id && state.waybill_id !== -1) && !waybillData || (waybillData && waybillData.id && waybillData.id !== state.waybill_id)) {
        this.props.actionLoadWaybillDataByIdForMission(
          state.waybill_id,
          { page, path },
        );
      }

      if ((state.request_id  && state.request_id !== -1) && !edcRequest || (edcRequest && edcRequest.id && edcRequest.id !== state.request_id)) {
        this.props.loadEdcRequiedByIdForMission(
          state.request_id,
          { page, path },
        );
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      IS_ASSIGNED,
      BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE,
    } = this.state;

    const {
      formState,
      originalFormState,
    } = this.props;

    if (
      IS_ASSIGNED
      && BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
      && formState.car_ids !== originalFormState.car_ids
    ) {
      global.NOTIFICATION_SYSTEM.notify({
        title: 'Внимание!',
        message:
          'Данное задание было связано с черновиком путевого листа. При сохранении данного задания с новым ТС необходимо выбрать тип добавления в ПЛ. Из предыдущего ПЛ данное задание будет удалено.',
        level: 'info',
        dismissible: true,
        position: 'tr',
        uid: 'IS_NOT_IN_WAYBILL_car_id',
        autoDismiss: 0,
      });
    }
  }

  componentWillUnmount() {
    this.props.actionReseSetDependenceMissionDataForMissionForm();
  }

  handleChangeAssignToWaybill = (value) => {
    this.setState({
      assign_to_waybill: [...value],
    });
  }

  hideColumnAssignment = () => {
    this.setState({
      showColumnAssignmentFormLazy: false,
    });
  }

  handleSubmit = async () => {
    const response = await this.props.submitAction(
      this.props.formState,
      this.state.assign_to_waybill,
    );

    if (response) {
      this.props.handleHide(true, response);
    }

    return response;
  }

  handleSubmitWrap = async () => {
    const { formState: { for_column, car_ids } } = this.props;

    if (for_column) {
      this.setState({
        assign_to_waybill: car_ids.map(() => 'assign_to_new_draft'),
        showColumnAssignmentFormLazy: true,
      });
    } else {
      return this.handleSubmit();
    }
  }

  async printMission(payloadOwn, print_form_type) {
    const { page, path } = this.props;

    const { blob } = await this.props.actionPrintFormMission(
      payloadOwn,
      { page, path },
    );

    switch (print_form_type) {
      case 1: return saveData(blob, `Задание №${this.props.formState.number}.pdf`);
      case 2: return printData(blob);
    }
  }

  handlePrint: any = (print_form_type) => {
    const data: any = { mission_id: this.props.formState.id };

    this.props.getMapImageInBase64ByKey(smallPrintMapKey).then((image) => {
      if (image) {
        data.image = image;
        this.printMission(data, print_form_type);
      }
    });
  };

  render() {
    const {
      MISSION_IS_ORDER_SOURCE,
      IS_CREATING,
      IS_ASSIGNED,
      IS_COMPLETE,
      IS_FAIL,
      IS_POST_CREATING_ASSIGNED,
      IS_DISPLAY,
      IS_DISABLED_ASSIGNED,
      IS_NOT_ASSIGNED,
      BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE,
      isPermitted,
    } = this.state;

    const {
      formState: state,
      formErrors: errors,
      notChangeCar,
      STRUCTURE_FIELD_VIEW,
      page,
      path,
    } = this.props;

    const title = (
      <MissionFormTitle
        IS_CREATING={IS_CREATING}
        number={state.number}
        status={state.status}
        column_id={state.column_id}
        MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}
      />
    );

    return (
      <>
        <EtsModal
          id="modal-mission"
          show
          onHide={this.props.hideWithoutChanges}
          bsSize="large"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
            <Row>
              <Col md={6}>
                <Row>
                  {
                    IS_CREATING && !notChangeCar
                      ? (
                        <Col md={3}>
                          <FieldForColumnMission
                            value={state.for_column}
                            error={errors.car_ids}
                            onChange={this.props.handleChange}
                            disabled={!isPermitted} // внутри ещё проверка
                            page={page}
                            path={path}
                          />
                        </Col>
                      )
                      : (
                        <DivNone />
                        )
                  }
                  <Col md={IS_CREATING && !notChangeCar ? 9 : 12}>
                    <FieldCarIdsMission
                      value={state.car_ids}
                      disabled={
                        !isPermitted
                        || (
                          (
                            IS_POST_CREATING_ASSIGNED
                            || IS_NOT_ASSIGNED
                            || IS_DISPLAY
                            || notChangeCar
                          )
                          && !BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
                        )
                      }
                      isPermitted={
                        !(!isPermitted
                          || (
                            (
                              IS_POST_CREATING_ASSIGNED
                              || IS_NOT_ASSIGNED
                              || IS_DISPLAY
                              || notChangeCar
                            )
                            && !BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
                          )
                        )
                      }
                      error={errors.car_ids}
                      onChange={this.props.handleChange}
                      for_column={state.for_column}
                      municipal_facility_id={state.municipal_facility_id}
                      structure_id={state.structure_id}
                      car_gov_numbers={state.car_gov_numbers}
                      car_model_names={state.car_model_names}
                      car_special_model_names={state.car_special_model_names}
                      car_type_ids={state.car_type_ids}
                      car_type_names={state.car_type_names}

                      loadByNormId={IS_ASSIGNED || MISSION_IS_ORDER_SOURCE}
                      norm_ids={state.norm_ids}

                      MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}

                      page={page}
                      path={path}
                      />
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                {
                    STRUCTURE_FIELD_VIEW
                      ? (
                        <Col md={12}>
                          <FieldStructureMission
                            value={state.structure_id}
                            name={state.structure_name}
                            disabled={
                              !isPermitted
                              || Boolean(state.waybill_id)
                              || !IS_CREATING
                            }
                            error={errors.structure_id}
                            onChange={this.props.handleChange}
                            page={page}
                            path={path}
                          />
                        </Col>
                    ) : (
                      <DivNone />
                    )
                  }
                  <Col md={MISSION_IS_ORDER_SOURCE ? 6 : 12}>
                    <FieldMissionSourceMission
                      value={state.mission_source_id}
                      name={state.mission_source_name}
                      error={errors.mission_source_id}
                      disabled={
                        !isPermitted
                        || IS_POST_CREATING_ASSIGNED
                        || IS_DISPLAY
                        || MISSION_IS_ORDER_SOURCE
                        || state.request_id
                      }
                      isPermitted={
                        isPermitted
                        && !MISSION_IS_ORDER_SOURCE
                      }

                      request_id={state.request_id}
                      request_number={state.request_number}
                      onChange={this.props.handleChange}
                      page={page}
                      path={path}
                    />
                    {IS_CREATING && !MISSION_IS_ORDER_SOURCE ? (
                      <div className="help-block-mission-source">
                        Задания на основе централизованных заданий необходимо
                        создавать во вкладке "НСИ"-"Реестр централизованных заданий".
                      </div>
                    ) : (
                      <DivNone />
                    )}
                  </Col>
                  {
                    MISSION_IS_ORDER_SOURCE
                      ? (
                        <Col md={6}>
                          <ExtField
                            id="order-number"
                            type="string"
                            label="Номер централизованного задания"
                            readOnly
                            value={state.order_number}
                          />
                        </Col>
                      )
                      : (
                        <DivNone />
                      )
                  }
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FieldEdcRequestData request_id={state.request_id} edcRequest={this.props.edcRequest} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row>
                  <Col md={12}>
                    <FieldTechnicalOperationMission
                      value={state.technical_operation_id}
                      name={state.technical_operation_name}
                      isPermitted={!(
                        !isPermitted
                        || (
                          !IS_CREATING
                          && (
                            IS_POST_CREATING_ASSIGNED
                            || IS_DISPLAY
                          )
                        )
                        || MISSION_IS_ORDER_SOURCE
                      )}
                      disabled={
                        !isPermitted
                        || (
                          !IS_CREATING
                          && (
                            IS_POST_CREATING_ASSIGNED
                            || IS_DISPLAY
                          )
                        )
                        || MISSION_IS_ORDER_SOURCE
                        || !state.car_ids.length
                      }
                      error={errors.technical_operation_id}
                      onChange={this.props.handleChange}

                      car_ids={state.car_ids}
                      for_column={state.for_column}

                      IS_TEMPLATE={false}
                      MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}

                      page={page}
                      path={path}
                    />
                  </Col>
                  <Col md={12}>
                    <FieldMunicipalFacilityIdMission
                      value={state.municipal_facility_id}
                      name={state.municipal_facility_name}
                      disabled={
                        !state.technical_operation_id
                        || !isPermitted
                        || MISSION_IS_ORDER_SOURCE
                        || (
                          !IS_CREATING
                          && (
                            IS_POST_CREATING_ASSIGNED
                            ||
                            IS_DISPLAY
                          )
                        )
                      }
                      error={errors.municipal_facility_id}
                      isPermitted={!(
                        !isPermitted
                        || MISSION_IS_ORDER_SOURCE
                        || (
                          !IS_CREATING
                          && (
                            IS_POST_CREATING_ASSIGNED
                            ||
                            IS_DISPLAY
                          )
                        )
                      )}
                      onChange={this.props.handleChange}
                      technical_operation_id={state.technical_operation_id}
                      date_start={state.date_start}
                      IS_TEMPLATE={false}
                      MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}
                      page={page}
                      path={path}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={12}>
                    <FieldDatesMission
                      isPermitted={isPermitted}
                      date_start={state.date_start}
                      error_date_start={errors.date_start}
                      date_end={state.date_end}
                      error_date_end={errors.date_end}

                      onChange={this.props.handleChange}
                      disabled={IS_DISABLED_ASSIGNED}

                      is_cleaning_norm={state.is_cleaning_norm}
                      norm_ids={state.norm_ids}
                      object_type_name={state.object_type_name}

                      IS_CREATING={IS_CREATING}
                      MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}

                      page={page}
                      path={path}
                    />
                  </Col>
                  <Col md={12}>
                    <ExtField
                      id="passes-count"
                      type="string"
                      label="Количество циклов"
                      error={errors.passes_count}
                      disabled={
                        (
                          IS_POST_CREATING_ASSIGNED
                          || IS_DISPLAY
                        ) && (
                          IS_FAIL
                          || IS_COMPLETE
                        )
                      }
                      value={state.passes_count}
                      onChange={this.props.handleChange}
                      boundKeys="passes_count"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FieldRouteIdMission
                  error={errors.route_id}
                  value={state.route_id}
                  name={state.route_name}
                  municipal_facility_id={state.municipal_facility_id}
                  municipal_facility_name={state.municipal_facility_name}
                  technical_operation_id={state.technical_operation_id}
                  technical_operation_name={state.technical_operation_name}
                  for_column={state.for_column}

                  request_id={state.request_id}
                  MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}
                  disabled={
                    !isPermitted
                    || (
                      (
                        IS_POST_CREATING_ASSIGNED
                        || IS_DISPLAY
                        || !state.municipal_facility_id
                      )
                      && !BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
                    )
                  }
                  isPermitted={!(
                    !isPermitted
                    || (
                      (
                        IS_POST_CREATING_ASSIGNED
                        || IS_DISPLAY
                      )
                      && !BACKEND_PERMITTED_EDIT_CAR_AND_ROUTE
                    )
                  )}
                  structure_id={state.structure_id}
                  structure_name={state.structure_name}
                  mission_id={state.id}
                  onChange={this.props.handleChange}

                  hiddenMapConfig={this.state.hiddenMapConfig}

                  page={page}
                  path={path}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <ExtField
                  id="m-comment"
                  type="string"
                  label="Комментарий"
                  value={state.comment}
                  error={errors.comment}
                  disabled={IS_FAIL || IS_COMPLETE}
                  onChange={this.props.handleChange}
                  boundKeys="comment"
                />
              </Col>
            </Row>
            <FieldNormIdMission
              value={state.norm_ids}
              datetime={state.date_start}
              technical_operation_id={state.technical_operation_id}
              municipal_facility_id={state.municipal_facility_id}
              route_type={state.route_type}
              type_ids={state.car_type_ids}
              disabled={state.status && !IS_NOT_ASSIGNED}
              onChange={this.props.handleChange}
              IS_TEMPLATE={false}
              MISSION_IS_ORDER_SOURCE={MISSION_IS_ORDER_SOURCE}
              page={page}
              path={path}
            />
          </ModalBodyPreloader>
          <Modal.Footer>
            {isPermitted ? ( // либо обновление, либо создание
              <DisplayFlexAlignCenterFooterForm>
                {
                  !state.status && !state.waybill_id && !state.for_column || this.state.likeNewMission
                    ? (
                      <FieldAssignToWaybillMission
                        value={this.state.assign_to_waybill[0]}
                        label={false}
                        onChange={this.handleChangeAssignToWaybill}

                        page={page}
                      />
                    )
                    : (
                      <DivNone />
                    )
                }
                <BtnGroupWrapper>
                {
                  !state.for_column && state.status
                    ? (
                      <BtnPart>
                        <Dropdown
                          id="waybill-print-dropdown"
                          dropup
                          disabled={
                            !this.props.canSave
                          }
                          onSelect={this.handlePrint}>
                          <Dropdown.Toggle>
                            <Glyphicon id="m-print" glyph="print" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <MenuItem eventKey={1}>Экспорт в файл</MenuItem>
                            <MenuItem eventKey={2}>Печать</MenuItem>
                          </Dropdown.Menu>
                        </Dropdown>
                      </BtnPart>
                    )
                    : (
                      <BtnPart></BtnPart>
                    )
                  }
                  <BtnPart>
                    <Button
                      id="mission_submit"
                      disabled={!this.props.canSave}
                      onClick={this.handleSubmitWrap}
                    >
                      Сохранить
                    </Button>
                  </BtnPart>
                </BtnGroupWrapper>
              </DisplayFlexAlignCenterFooterForm>
            ) : (
              <DivNone />
            )}
          </Modal.Footer>
        </EtsModal>
        <ColumnAssignmentFormLazy
          showForm={this.state.showColumnAssignmentFormLazy}
          assign_to_waybill={this.state.assign_to_waybill}
          car_ids={state.car_ids}
          handleChangeAssignToWaybill={this.handleChangeAssignToWaybill}
          hideColumnAssignment={this.hideColumnAssignment}
          handleSubmit={this.handleSubmit}

          page={this.props.page}
        />
      </>
    );
  }
}

export default compose<PropsMissionForm, OwnMissionProps>(
  connect<StatePropsMission, DispatchPropsMission, OwnMissionProps, ReduxState>(
    (state) => ({
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      ...getSessionStructuresParams(state),
      order_mission_source_id: getSomeUniqState(state).missionSource.order_mission_source_id,
      edcRequest: getMissionsState(state).missionData.edcRequest,
      waybillData: getMissionsState(state).missionData.waybillData,
      dependeceOrder: getMissionsState(state).missionData.dependeceOrder,
      dependeceTechnicalOperation: getMissionsState(state).missionData.dependeceTechnicalOperation,
    }),
    (dispatch: any) => ({
      actionPrintFormMission: (...arg) => dispatch(missionsActions.actionPrintFormMission(...arg)),
      actionLoadOrderAndTechnicalOperationByIdForMission: (...arg) => dispatch(missionsActions.actionLoadOrderAndTechnicalOperationByIdForMission(...arg)),
      actionLoadWaybillDataByIdForMission: (...arg) => {
        return dispatch(
          missionsActions.actionLoadWaybillDataByIdForMission(...arg),
        );
      },
      loadEdcRequiedByIdForMission: (...arg) => (
        dispatch(
          missionsActions.loadEdcRequiedByIdForMission(...arg),
        )
      ),
      actionReseSetDependenceMissionDataForMissionForm: (...arg) => (
        dispatch(
          missionsActions.actionReseSetDependenceMissionDataForMissionForm(...arg),
        )
      ),
    }),
  ),
  withMapInConsumer(),
  withForm<PropsMissionWithForm, Mission>({
    uniqField: 'id',
    createAction: missionsActions.actionCreateMission,
    updateAction: missionsActions.actionUpdateMission,
    getRecordAction: missionsActions.actionGetMissionById,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultMissionElement({
        ...element,
        structure_id: (element && element.structure_id) || userStructureId,
        structure_name:
          element && (element.structure_name || element.structure_id)
            ? null
            : userStructureName,
      });
    },
    schema: missionFormSchema,
    permissions: missionPermissions,
  }),
)(MissionForm);
