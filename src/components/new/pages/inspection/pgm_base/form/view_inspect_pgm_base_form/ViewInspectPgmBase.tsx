import * as React from 'react';
import {
  TitleForm,
  CheckContainerTable,
  CheckContainerRow,
  CheckContainerTd,
  ButtonBlock,
} from './styled/ViewInspectPgmBaseStyled';
import { Button, Row, Col } from 'react-bootstrap';
import { BoxContainer } from 'components/new/pages/inspection/pgm_base/components/data/styled/InspectionPgmBaseData';
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
import {
  filedToCheckContainersFail,
  filedToCheckContainersInfo,
  filedToCheckMonitoring,
  filedToCheckFall,
  filedToCheckFallHardPgm,
} from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/filed_to_check/filedToCheck';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { get } from 'lodash';
import ContainerFormLazy from 'components/new/pages/inspection/container/index';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

type InitialState = {
  selectedInspectPgmBase: InspectPgmBase,
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
  selectedInspectPgmBase: null,
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

const actionSetState = (payload) => ({
    type: CHANGE_STATE,
    payload: {
      ...payload,
    },
  });

const reducer = (state: InitialState, { type, payload }) => {
  switch (type) {
    case SET_INITIAL_STATE: {
      const errors = validate(inspectAutobaeSchema, payload.selectedInspectPgmBase.data, { type: payload.type });

      return {
        ...state,
        selectedInspectPgmBase: payload.selectedInspectPgmBase,
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

  const handleFormHideDutyMissionForm = React.useCallback(
    () => {
      dispatch(
        actionSetState({
          showDutyMissionForm: false,
        }),
      );
    },
    [],
  );

  const selectedPgmBase = props.pgmBaseList.find((elem) => get(props, 'selectedInspectPgmBase.base_id', null) === get(elem, 'id'));
  const selectedPgmBaseTypeIsCombinate = get(selectedPgmBase, 'pgm_stores_type_id', null) === 3 ? true : false;

  return state.selectedInspectPgmBase
    ? (
      <Row>
        <Col md={6} sm={12}>
          <TitleForm>
            <h4>Мониторинг состояния баз хранения ПГМ</h4>
          </TitleForm>
          <BoxContainer>
            <IAVisibleWarning
              onChange={onChangeData}
              data={state.selectedInspectPgmBase.data}
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
              data={state.selectedInspectPgmBase.data}
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
              data={state.selectedInspectPgmBase.data}
              errors={state.errors}
              isPermitted={isPermittedChangeListParams}
              filedToCheck={filedToCheckFallHardPgm}
            />
          </BoxContainer>
        </Col>

        {
          selectedPgmBaseTypeIsCombinate ? (
            <Col md={6} sm={12}>
              <TitleForm>
                <h4>Готовность емкостей для хранения ПГМ</h4>
              </TitleForm>
              <BoxContainer>
                <IAVisibleWarning
                  onChange={onChangeData}
                  data={state.selectedInspectPgmBase.data}
                  errors={state.errors}
                  isPermitted={isPermittedChangeListParams}
                  filedToCheck={filedToCheckContainersInfo}
                />
              </BoxContainer>
              <BoxContainer>
                <h4>
                  Выявленные нарушения
                </h4>
                <IAVisibleWarning
                  onChange={onChangeData}
                  data={state.selectedInspectPgmBase.data}
                  errors={state.errors}
                  isPermitted={isPermittedChangeListParams}
                  filedToCheck={filedToCheckContainersFail}
                />
              </BoxContainer>
              <BoxContainer>
                <h4>
                  Проверка емкостей
                </h4>
                <CheckContainerTable>
                  {
                    [
                      {
                        number: '123123123',
                        updated_at_date: '12.12.2019',
                      },
                      {
                        number: '131231212',
                        updated_at_date: '21.12.2019',
                      },
                      {
                        number: 'sfsdf',
                        updated_at_date: '15.12.2019',
                      },
                    ].map((container) => (
                      <CheckContainerRow>
                        <CheckContainerTd>
                          {container.number}
                        </CheckContainerTd>
                        <CheckContainerTd>
                          На {container.updated_at_date}
                        </CheckContainerTd>
                        <CheckContainerTd>
                          <ButtonBlock>
                            <Button bsSize="small" onClick={() => alert('Редактирование')}>
                              <Glyphicon glyph="pencil" />
                            </Button>
                            <Button bsSize="small" onClick={() => alert('Удаление')}>
                              <Glyphicon glyph="trash" />
                            </Button>
                          </ButtonBlock>
                        </CheckContainerTd>
                      </CheckContainerRow>
                    ))
                  }
                </CheckContainerTable>
                <Button
                  onClick={ () => dispatch(actionSetState({showDutyMissionForm: true, })) }>
                  <Glyphicon glyph="plus"/>&nbsp;Добавить
                </Button> <br/><br/>
                {/* <<< Добавить то что ниже, disable, для редактирования и удаления тоже самое */}
                {/* <Button disabled={!isPermittedChangeListParams}
                  onClick={() => alert('Добавить')}>
                  <Glyphicon glyph="plus"/>&nbsp;Добавить
                </Button> <br/><br/> */}
              </BoxContainer>

              <ContainerFormLazy
                element={state.containerElement}
                onFormHide={handleFormHideDutyMissionForm}
                readOnly={!isPermittedChangeListParams}
                showForm={state.showDutyMissionForm}
              />
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
