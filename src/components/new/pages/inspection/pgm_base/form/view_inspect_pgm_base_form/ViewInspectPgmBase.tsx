import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { get } from 'lodash';
import IAVisibleWarning from 'components/new/pages/inspection/pgm_base/components/vsible_warning/IAVisibleWarning';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { FooterEnd, DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { ViewInspectPgmBaseProps, ViewInspectPgmBaseWrapOwnProps, ViewInspectPgmBaseStateProps, ViewInspectPgmBaseDispatchProps } from './@types/ViewInspectPgmBase';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import ViewInspectPgmBaseButtonSubmit from './button_sumbit/ViewInspectPgmBaseButtonSubmit';
import { Reducer } from 'redux';
import { inspectAutobaeSchema } from './inspect_pgm_base_schema';
import { validate } from 'components/ui/form/new/validate';
import ViewAddInspectEmployee, {
  ViewAddInspectEmployeeInitialState,
  viewAddInspectEmployeeInitialState,
} from 'components/new/pages/inspection/common_components/add_inspect_employee/addInspectEmployee';
import {
  filedToCheckMonitoring,
  filedToCheckFall,
  filedToCheckFallHardPgm,
} from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/filed_to_check/filedToCheck';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import ContainerBlock from './container_bloc';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';
import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { ExtField } from 'components/ui/new/field/ExtField';

type InitialState = {
  selectedInspect: InspectPgmBase,
  errors: Partial<Record<keyof InspectPgmBase['data'], string>>;
  canSave: boolean;
  type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM;
  agents_from_gbu?: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
  containerElement: Partial<InspectContainer> | null;
  containerElementList: Partial<InspectContainer>[] | null;
  showDutyMissionForm: boolean;
};

const containerElementInitialState: InitialState['containerElement'] = {
  inspection_id: null,
  number: null,
  capacity: null,
  capacity_percent: null,
  pgm_volume: null,
  pgm_marka: null,
  last_checked_at: null,
  diagnostic_result: null,
  id: null, // бэк ещё не присылает
  data: {
    equipment_pipeline_in_poor_condition: null,
    control_measuring_instruments_in_poor_condition: null,
  },
};

const initialState: InitialState = {
  selectedInspect: null,
  errors: {},
  canSave: false,
  type: 'list',
  agents_from_gbu: viewAddInspectEmployeeInitialState.agents_from_gbu,
  commission_members: viewAddInspectEmployeeInitialState.commission_members,
  resolve_to: viewAddInspectEmployeeInitialState.resolve_to,
  containerElement: containerElementInitialState,
  containerElementList: [],
  showDutyMissionForm: false,
};

const CHANGE_DATA = 'CHANGE_DATA';
const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
const SET_COMISSION_AND_MEMBERS = 'SET_COMISSION_AND_MEMBERS';
const CHANGE_STATE = 'CHANGE_STATE';

const actionChangeSelectedInspectPgmBaseData = (data: InspectPgmBase['data']) => ({
  type: CHANGE_DATA,
  payload: {
    data,
  },
});

const actionSetSelectedInspectPgmBaseData = (selectedInspect: InitialState['selectedInspect'], type: InitialState['type']) => ({
  type: SET_INITIAL_STATE,
  payload: {
    selectedInspect,
    type,
  },
});

const actionSetComissionAndMembers = (
  data: {
    agents_from_gbu: InitialState['agents_from_gbu'];
    commission_members: InitialState['commission_members'];
    resolve_to: InitialState['resolve_to'];
  }) => ({
    type: SET_COMISSION_AND_MEMBERS,
    payload: {
      data,
    },
  });

const reducer = (state: InitialState, { type, payload }) => {
  switch (type) {
    case SET_INITIAL_STATE: {
      const { selectedInspect } = payload;
      selectedInspect.data.address_base = selectedInspect.base_address;
      selectedInspect.data.balance_holder_base = selectedInspect.company_name;
      selectedInspect.data.operating_base = selectedInspect.company_name;

      const errors = validate(inspectAutobaeSchema, selectedInspect.data, { type: payload.type }, selectedInspect);

      return {
        ...state,
        selectedInspect,
        type: payload.type,
        errors,
        canSave: Object.values(errors).every((error) => !error),
      };
    }
    case CHANGE_STATE: {
      return {
        ...state,
        ...payload,
      };
    }
    case CHANGE_DATA: {
      const selectedInspect = {
        ...state.selectedInspect,
        data: {
          ...state.selectedInspect.data,
          ...payload.data,
        },
      };
      const errors = validate(inspectAutobaeSchema, selectedInspect.data, { type: state.type }, selectedInspect);

      return {
        ...state,
        selectedInspect,
        errors,
        canSave: Object.values(errors).every((error) => !error),
      };
    }
    case SET_COMISSION_AND_MEMBERS: {
      const {
        commission_members,
        agents_from_gbu,
        resolve_to,
      } = payload.data;
      const selectedInspect = {
        ...state.selectedInspect,
        commission_members,
        agents_from_gbu,
        resolve_to,
      };
      return {
        ...state,
        selectedInspect,
      };
    }
    default: return state;
  }
};

const ViewInspectPgmBase: React.FC<ViewInspectPgmBaseProps> = (props) => {
  const [state, dispatch] = React.useReducer<Reducer<InitialState, any>>(
    reducer,
    initialState,
  );

  React.useEffect(
    () => {
      dispatch(
        actionSetSelectedInspectPgmBaseData(
          props.selectedInspect,
          props.type,
        ),
      );
    },
    [props.type, props.selectedInspect],
  );

  const isPermittedChangeListParams = (
    props.isPermitted
    && props.type === INSPECT_PGM_BASE_TYPE_FORM.list
  );

  const onChangeData = React.useCallback(
    (data, canChangeWithoutPermission: boolean = false) => {
      if (isPermittedChangeListParams || canChangeWithoutPermission) {
        dispatch(
          actionChangeSelectedInspectPgmBaseData(data),
        );
      }
    },
    [state.selectedInspect, isPermittedChangeListParams],
  );

  const onChangeFile = React.useCallback(
    (key, value) => {
      if (isPermittedChangeListParams) {
        dispatch(
          actionChangeSelectedInspectPgmBaseData({
            ...state.selectedInspect.data,
            [key]: value,
          }),
        );
      }
    },
    [state.selectedInspect, isPermittedChangeListParams],
  );

  const closeWithoutChanges = React.useCallback(
    () => props.handleHide(false),
    [],
  );

  const setComissionAndMembers = React.useCallback(
    (agents_from_gbu, commission_members, resolve_to) => {
      dispatch(
        actionSetComissionAndMembers({
          agents_from_gbu,
          commission_members,
          resolve_to,
        }),
      );
    },
    [state.agents_from_gbu, state.commission_members, state.resolve_to],
  );

  const base_type = get(state.selectedInspect, 'base_type', null);

  return state.selectedInspect
    ? (
      <React.Fragment>
        <ContainerForm>
          <Col md={6} sm={12}>
            <BoxContainer>
              <ExtField
                type="string"
                label="Адрес базы:"
                value={`${state.selectedInspect.data.address_base}${base_type ? ` (${base_type})` : ''}`}
                readOnly
                inline
              />
              <IAVisibleWarning
                onChange={onChangeData}
                data={state.selectedInspect.data}
                errors={state.errors}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckMonitoring}
              />
            </BoxContainer>
            <BoxContainer>
              <h4>
                Выявленные нарушения на базе:
              </h4>
              <IAVisibleWarning
                onChange={onChangeData}
                data={state.selectedInspect.data}
                errors={state.errors}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckFall}
              />
            </BoxContainer>
            <BoxContainer>
              <h4>
                Нарушения, связанные с хранением твердых ПГМ:
              </h4>
              <IAVisibleWarning
                onChange={onChangeData}
                data={state.selectedInspect.data}
                errors={state.errors}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckFallHardPgm}
              />
            </BoxContainer>
          </Col>
          {
            state.selectedInspect.can_have_container ? (
              <Col md={6} sm={12}>
                <ContainerBlock
                  selectedInspectPgmBase={state.selectedInspect}
                  onChangeData={onChangeData}
                  isPermittedChangeListParams={isPermittedChangeListParams}
                  errors={state.errors}

                  page={props.loadingPage}
                />
              </Col>
            )
            : (
              <DivNone />
            )
          }
          <Col md={6} sm={12}>
            <Row>
              { (props.type === INSPECT_PGM_BASE_TYPE_FORM.closed && state.selectedInspect.data.photos_of_supporting_documents.length)
                || props.type === INSPECT_PGM_BASE_TYPE_FORM.list
                ? (
                  <Col md={6}>
                    <FileField
                      id="file"
                      label="Фотографии подтверждающих документов"
                      multiple
                      value={state.selectedInspect.data.photos_of_supporting_documents}
                      onChange={onChangeFile}
                      disabled={!isPermittedChangeListParams}
                      boundKeys="photos_of_supporting_documents"
                    />
                  </Col>
                ) : (
                  <DivNone />
                )
              }
              {
                (props.type === INSPECT_PGM_BASE_TYPE_FORM.closed && state.selectedInspect.data.photos_defect.length)
                || props.type === INSPECT_PGM_BASE_TYPE_FORM.list
                ? (
                  <Col md={6}>
                    <FileField
                      id="file"
                      label="Фотографии дефектов"
                      multiple
                      value={state.selectedInspect.data.photos_defect}
                      onChange={onChangeFile}
                      disabled={!isPermittedChangeListParams}
                      boundKeys="photos_defect"
                    />
                  </Col>
                ) : (
                  <DivNone />
                )
              }
            </Row>
          </Col>
          <ViewAddInspectEmployee
            type={props.type}
            isPermitted={props.isPermitted}
            canAddMembers={true}
            canAddCompanyAgent={true}
            canRemoveEmployee={true}
            selectedInspect={state.selectedInspect}
            setComissionAndMembers={setComissionAndMembers}
            inspectTypeForm={INSPECT_PGM_BASE_TYPE_FORM}
          >
          </ViewAddInspectEmployee>
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <ViewInspectPgmBaseButtonSubmit
              canSave={state.canSave}
              type={props.type}
              handleHide={props.handleHide}
              selectedInspectPgmBase={state.selectedInspect}
              loadingPage={props.loadingPage}
            />
            <Button onClick={closeWithoutChanges}>{props.type !== INSPECT_PGM_BASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
          </FooterEnd>
        </FooterForm>
      </React.Fragment>
    )
    : (
      <DivNone />
    );
};

export default compose<ViewInspectPgmBaseProps, ViewInspectPgmBaseWrapOwnProps>(
  connect<ViewInspectPgmBaseStateProps, ViewInspectPgmBaseDispatchProps, ViewInspectPgmBaseWrapOwnProps, ReduxState>(
    null,
  ),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
)(ViewInspectPgmBase);
