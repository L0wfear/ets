import * as React from 'react';
import { TitleForm } from './styled/ViewInspectAutobaseStyled';
import { Button, Row, Col } from 'react-bootstrap';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import IAVisibleWarning from 'components/new/pages/inspection/autobase/components/vsible_warning/IAVisibleWarning';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { FooterEnd, DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { ViewInspectAutobaseProps } from './@types/ViewInspectAutobase';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import ViewInspectAutobaseButtonSubmit from './button_sumbit/ViewInspectAutobaseButtonSubmit';
import { Reducer } from 'redux';
import { inspectAutobaeSchema } from './inspect_autobase_schema';
import { validate } from 'components/ui/form/new/validate';
import ViewAddInspectEmployee, { ViewAddInspectEmployeeInitialState, viewAddInspectEmployeeInitialState } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/add_inspect_employee/addInspectEmployee';
import { filedToCheck } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/filed_to_check/filedToCheck';

type InitialState = {
  selectedInspectAutobase: InspectAutobase,
  errors: Partial<Record<keyof InspectAutobase['data'], string>>;
  canSave: boolean;
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  agents_from_gbu?: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
};

const initialState: InitialState = {
  selectedInspectAutobase: null,
  errors: {},
  canSave: false,
  type: 'list',
  agents_from_gbu: viewAddInspectEmployeeInitialState.agents_from_gbu,
  commission_members: viewAddInspectEmployeeInitialState.commission_members,
  resolve_to: viewAddInspectEmployeeInitialState.resolve_to,
};

const CHANGE_DATA = 'CHANGE_DATA';
const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
const SET_COMISSION_AND_MEMBERS = 'SET_COMISSION_AND_MEMBERS';

const actionChangeSelectedInspectAutobaseData = (data: InspectAutobase['data']) => ({
  type: CHANGE_DATA,
  payload: {
    data,
  },
});

const actionSetSelectedInspectAutobaseData = (selectedInspectAutobase: InitialState['selectedInspectAutobase'], type: InitialState['type']) => ({
  type: SET_INITIAL_STATE,
  payload: {
    selectedInspectAutobase,
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
      const errors = validate(inspectAutobaeSchema, payload.selectedInspectAutobase.data, { type: payload.type });

      return {
        selectedInspectAutobase: payload.selectedInspectAutobase,
        type: payload.type,
        errors,
        canSave: Object.values(errors).every((error) => !error),
      };
    }
    case CHANGE_DATA: {
      const selectedInspectAutobase = {
        ...state.selectedInspectAutobase,
        data: {
          ...state.selectedInspectAutobase.data,
          ...payload.data,
        },
      };
      const errors = validate(inspectAutobaeSchema, selectedInspectAutobase.data, { type: state.type });

      return {
        ...state,
        selectedInspectAutobase,
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
      const selectedInspectAutobase = {
        ...state.selectedInspectAutobase,
        commission_members,
        agents_from_gbu,
        resolve_to,
      };
      return {
        ...state,
        selectedInspectAutobase,
      };
    }
    default: return state;
  }
};

const ViewInspectAutobase: React.FC<ViewInspectAutobaseProps> = (props) => {
  const [state, dispatch] = React.useReducer<Reducer<InitialState, any>>(
    reducer,
    initialState,
  );

  React.useEffect(
    () => {
      dispatch(
        actionSetSelectedInspectAutobaseData(
          props.selectedInspectAutobase,
          props.type,
        ),
      );
    },
    [props.type, props.selectedInspectAutobase],
  );

  const isPermittedChangeListParams = (
    props.isPermitted
    && props.type === INSPECT_AUTOBASE_TYPE_FORM.list
  );

  const onChangeData = React.useCallback(
    (data) => {
      if (isPermittedChangeListParams) {
        dispatch(
          actionChangeSelectedInspectAutobaseData(data),
        );
      }
    },
    [state.selectedInspectAutobase, isPermittedChangeListParams],
  );

  const onChangeFile = React.useCallback(
    (key, value) => {
      if (isPermittedChangeListParams) {
        dispatch(
          actionChangeSelectedInspectAutobaseData({
            ...state.selectedInspectAutobase.data,
            [key]: value,
          }),
        );
      }
    },
    [state.selectedInspectAutobase, isPermittedChangeListParams],
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

  return state.selectedInspectAutobase
    ? (
      <Row>
        <Col md={12} sm={12}>
          <TitleForm>
            <h4>Мониторинг обустройства автобаз</h4>
          </TitleForm>
        </Col>
        <Col md={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6} sm={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6}>
          <BoxContainer>
            <ExtField
              type="string"
              label="Организация:"
              value={state.selectedInspectAutobase.company_name}
              readOnly
              inline
            />
            <ExtField
              type="string"
              label="Адрес базы:"
              value={state.selectedInspectAutobase.base_address}
              readOnly
              inline
            />
          </BoxContainer>
          <BoxContainer>
            <h4>
              Выявленные нарушения:
            </h4>
            <IAVisibleWarning
              onChange={onChangeData}
              data={state.selectedInspectAutobase.data}
              errors={state.errors}
              isPermitted={isPermittedChangeListParams}
              filedToCheck={filedToCheck}
            />
          </BoxContainer>
          <Row>
            <Col md={6}>
              <FileField
                id="file"
                label="Фотографии подтверждающих документов"
                multiple
                value={state.selectedInspectAutobase.data.photos_of_supporting_documents}
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
                value={state.selectedInspectAutobase.data.photos_defect}
                onChange={onChangeFile}
                disabled={!isPermittedChangeListParams}
                boundKeys="photos_defect"
              />
            </Col>
          </Row>
        </Col>
        <ViewAddInspectEmployee
          type={props.type}
          isPermitted={props.isPermitted}
          canAddMembers={true}
          canAddCompanyAgent={true}
          canRemoveEmployee={true}
          selectedInspectAutobase={state.selectedInspectAutobase}
          setComissionAndMembers={setComissionAndMembers}
        >
        </ViewAddInspectEmployee>
        <Col md={12} sm={12}>
          <FooterEnd>
            <ViewInspectAutobaseButtonSubmit
              canSave={state.canSave}
              type={props.type}
              handleHide={props.handleHide}
              selectedInspectAutobase={state.selectedInspectAutobase}
              loadingPage={props.page}
            />
            <Button onClick={closeWithoutChanges}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
          </FooterEnd>
        </Col>
      </Row>
    )
    : (
      <DivNone />
    );
};

export default ViewInspectAutobase;
