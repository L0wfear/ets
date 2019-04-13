import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
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
import ViewAddInspectEmployee, { ViewAddInspectEmployeeInitialState, viewAddInspectEmployeeInitialState } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/add_inspect_employee/addInspectEmployee';
import {
  filedToCheckMonitoring,
  filedToCheckFall,
  filedToCheckFallHardPgm,
} from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/filed_to_check/filedToCheck';
import { get } from 'lodash';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import ContainerBlock from './container_bloc';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';
import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

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
      const errors = validate(inspectAutobaeSchema, payload.selectedInspect.data, { type: payload.type });

      return {
        ...state,
        selectedInspect: payload.selectedInspect,
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
      const errors = validate(inspectAutobaeSchema, selectedInspect.data, { type: state.type });

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
    (data) => {
      if (isPermittedChangeListParams) {
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

  const selectedPgmBase = props.pgmBaseList.find((elem) => get(props, 'selectedInspect.base_id', null) === get(elem, 'id'));
  const selectedPgmBaseTypeIsCombinate = get(selectedPgmBase, 'pgm_stores_type_id', null) === 3 ? true : false;

  return state.selectedInspect
    ? (
      <React.Fragment>
        <ContainerForm>
          <Col md={6} sm={12}>
            <BoxContainer>
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
            selectedPgmBaseTypeIsCombinate ? (
              <Col md={6} sm={12}>
                <ContainerBlock
                  selectedInspectPgmBase={state.selectedInspect}
                  onChangeData={onChangeData}
                  isPermittedChangeListParams={isPermittedChangeListParams}
                  errors={state.errors}

                  page={props.page}
                />
                <Row>
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
                </Row>
              </Col>
            ) : (
              <DivNone />
            )
          }
          <ViewAddInspectEmployee
            type={props.type}
            isPermitted={props.isPermitted}
            canAddMembers={true}
            canAddCompanyAgent={true}
            canRemoveEmployee={true}
            selectedInspectPgmBase={state.selectedInspect}
            setComissionAndMembers={setComissionAndMembers}
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
              loadingPage={props.page}
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
    (state) => ({
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
  ),
)(ViewInspectPgmBase);
