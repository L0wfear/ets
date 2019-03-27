import * as React from 'react';
import { TitleForm } from './styled/ViewInspectPgmBaseStyled';
import { Button, Row, Col } from 'react-bootstrap';
import { BoxContainer } from 'components/new/pages/inspection/pgm_base/components/data/styled/InspectionPgmBaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import IAVisibleWarning from 'components/new/pages/inspection/pgm_base/components/vsible_warning/IAVisibleWarning';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { FooterEnd, DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { ViewInspectPgmBaseProps } from './@types/ViewInspectPgmBase';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import ViewInspectPgmBaseButtonSubmit from './button_sumbit/ViewInspectPgmBaseButtonSubmit';
import { Reducer } from 'redux';
import { inspectAutobaeSchema } from './inspect_pgm_base_schema';
import { validate } from 'components/ui/form/new/validate';
import ViewAddInspectEmployee, { ViewAddInspectEmployeeInitialState, viewAddInspectEmployeeInitialState } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/add_inspect_employee/addInspectEmployee';
import { filedToCheck } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/filed_to_check/filedToCheck';

type InitialState = {
  selectedInspectPgmBase: InspectPgmBase,
  errors: Partial<Record<keyof InspectPgmBase['data'], string>>;
  canSave: boolean;
  type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM;
  agents_from_gbu?: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
};

const initialState: InitialState = {
  selectedInspectPgmBase: null,
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

const actionChangeSelectedInspectPgmBaseData = (data: InspectPgmBase['data']) => ({
  type: CHANGE_DATA,
  payload: {
    data,
  },
});

const actionSetSelectedInspectPgmBaseData = (selectedInspectPgmBase: InitialState['selectedInspectPgmBase'], type: InitialState['type']) => ({
  type: SET_INITIAL_STATE,
  payload: {
    selectedInspectPgmBase,
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
      const errors = validate(inspectAutobaeSchema, payload.selectedInspectPgmBase.data, { type: payload.type });

      return {
        selectedInspectPgmBase: payload.selectedInspectPgmBase,
        type: payload.type,
        errors,
        canSave: Object.values(errors).every((error) => !error),
      };
    }
    case CHANGE_DATA: {
      const selectedInspectPgmBase = {
        ...state.selectedInspectPgmBase,
        data: {
          ...state.selectedInspectPgmBase.data,
          ...payload.data,
        },
      };
      const errors = validate(inspectAutobaeSchema, selectedInspectPgmBase.data, { type: state.type });

      return {
        ...state,
        selectedInspectPgmBase,
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
      const selectedInspectPgmBase = {
        ...state.selectedInspectPgmBase,
        commission_members,
        agents_from_gbu,
        resolve_to,
      };
      return {
        ...state,
        selectedInspectPgmBase,
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
          props.selectedInspectPgmBase,
          props.type,
        ),
      );
    },
    [props.type, props.selectedInspectPgmBase],
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
    [state.selectedInspectPgmBase, isPermittedChangeListParams],
  );

  const onChangeFile = React.useCallback(
    (key, value) => {
      if (isPermittedChangeListParams) {
        dispatch(
          actionChangeSelectedInspectPgmBaseData({
            ...state.selectedInspectPgmBase.data,
            [key]: value,
          }),
        );
      }
    },
    [state.selectedInspectPgmBase, isPermittedChangeListParams],
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

  return state.selectedInspectPgmBase
    ? (
      <Row>
        <Col md={12} sm={12}>
          <TitleForm>
            <h4>Мониторинг состояния баз хранения ПГМ</h4>
          </TitleForm>
        </Col>
        <Col md={props.type === INSPECT_PGM_BASE_TYPE_FORM.list ? 12 : 6} sm={props.type === INSPECT_PGM_BASE_TYPE_FORM.list ? 12 : 6}>
          <BoxContainer>
            {/* Добавить тип базы, `${rowData.address} (${rowData.pgm_stores_type_name})` */}
            <ExtField
              type="string"
              label="Адрес базы:"
              value={state.selectedInspectPgmBase.base_address}
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
              data={state.selectedInspectPgmBase.data}
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
                value={state.selectedInspectPgmBase.data.photos_of_supporting_documents}
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
                value={state.selectedInspectPgmBase.data.photos_defect}
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
          selectedInspectPgmBase={state.selectedInspectPgmBase}
          setComissionAndMembers={setComissionAndMembers}
        >
        </ViewAddInspectEmployee>
        <Col md={12} sm={12}>
          <FooterEnd>
            <ViewInspectPgmBaseButtonSubmit
              canSave={state.canSave}
              type={props.type}
              handleHide={props.handleHide}
              selectedInspectPgmBase={state.selectedInspectPgmBase}
              loadingPage={props.page}
            />
            <Button onClick={closeWithoutChanges}>{props.type !== INSPECT_PGM_BASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
          </FooterEnd>
        </Col>
      </Row>
    )
    : (
      <DivNone />
    );
};

export default ViewInspectPgmBase;
