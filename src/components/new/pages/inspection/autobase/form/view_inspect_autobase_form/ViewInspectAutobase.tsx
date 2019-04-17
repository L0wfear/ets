import * as React from 'react';
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
import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

type InitialState = {
  selectedInspect: InspectAutobase,
  errors: Partial<Record<keyof InspectAutobase['data'], string>>;
  canSave: boolean;
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  agents_from_gbu?: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
};

const initialState: InitialState = {
  selectedInspect: null,
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

const actionSetSelectedInspectAutobaseData = (selectedInspect: InitialState['selectedInspect'], type: InitialState['type']) => ({
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
      const errors = validate(inspectAutobaeSchema, payload.selectedInspect.data, { type: payload.type }, payload.selectedInspect);

      return {
        selectedInspect: payload.selectedInspect,
        type: payload.type,
        errors,
        canSave: Object.values(errors).every((error) => !error),
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

const ViewInspectAutobase: React.FC<ViewInspectAutobaseProps> = (props) => {
  const [state, dispatch] = React.useReducer<Reducer<InitialState, any>>(
    reducer,
    initialState,
  );

  React.useEffect(
    () => {
      dispatch(
        actionSetSelectedInspectAutobaseData(
          props.selectedInspect,
          props.type,
        ),
      );
    },
    [props.type, props.selectedInspect],
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
    [state.selectedInspect, isPermittedChangeListParams],
  );

  const onChangeFile = React.useCallback(
    (key, value) => {
      if (isPermittedChangeListParams) {
        dispatch(
          actionChangeSelectedInspectAutobaseData({
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

  return state.selectedInspect
    ? (
      <>
        <ContainerForm>
          <Col md={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6} sm={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6}>
            <BoxContainer>
              <ExtField
                type="string"
                label="Организация:"
                value={state.selectedInspect.company_name}
                readOnly
                inline
              />
              <ExtField
                type="string"
                label="Адрес базы:"
                value={state.selectedInspect.base_address}
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
                data={state.selectedInspect.data}
                errors={state.errors}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheck}
              />
            </BoxContainer>
            <Row>
            {
              props.type === INSPECT_AUTOBASE_TYPE_FORM.list || state.selectedInspect.data.photos_of_supporting_documents.length
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
                )
                : (
                  <DivNone />
                )
            }
            {
              props.type === INSPECT_AUTOBASE_TYPE_FORM.list || state.selectedInspect.data.photos_defect.length
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
                )
                : (
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
            selectedInspectAutobase={state.selectedInspect}
            setComissionAndMembers={setComissionAndMembers}
          />
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <ViewInspectAutobaseButtonSubmit
              canSave={state.canSave}
              type={props.type}
              handleHide={props.handleHide}
              selectedInspectAutobase={state.selectedInspect}
              loadingPage={props.loadingPage}
            />
            <Button onClick={closeWithoutChanges}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
          </FooterEnd>
        </FooterForm>
      </>
    )
    : (
      <DivNone />
    );
};

export default withPreloader({
  typePreloader: 'mainpage',
  withPagePath: true,
})(ViewInspectAutobase);
