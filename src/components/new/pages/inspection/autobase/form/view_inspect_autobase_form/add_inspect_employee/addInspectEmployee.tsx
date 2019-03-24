import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { Button, Row, Col, Glyphicon } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';
import { ViewInspectAutobaseOwnProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import {get} from 'lodash';
import { Reducer } from 'redux';
import { ExtField } from 'components/ui/new/field/ExtField';
import { addInspectEmployeeSchema } from './schema';
import { validate } from 'components/ui/form/new/validate';
import {
  ViewAddInspectEmployeeWrapper,
  ShowBlockWrapper,
  FieldWrap,
  EmpRow,
  EmpInfo,
  ViewInspectSingleBlock,
} from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/add_inspect_employee/styled';
import Div from 'components/ui/Div';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type ViewAddInspectEmployeeProps = {
  type: ViewInspectAutobaseOwnProps['type'];
  isPermitted: boolean;
  canAddMembers: boolean;
  canAddCompanyAgent: boolean;
  canRemoveEmployee: boolean;
  userData: InitialStateSession['userData'];
  selectedInspectAutobase: InspectAutobase;
};

type MembersInspElem = {
  fio: string;
  position: string;
  clearable: boolean;
  id?: number; // на бек не передавать
};

export type ViewAddInspectEmployeeInitialState = {
  resolve_to: any | null; // устранить до? date or string
  commission_members: MembersInspElem[] | null; // члены комиссии
  companyAgentList: MembersInspElem[] | null; // члены комиссии от компании, в данной реализации, можно добавить только 1го
  member_fio: string | null;
  member_position: string | null;
  agent_from_gbu_position: string | null;
  agent_from_gbu_fio: string | null;
  agent_from_gbu: {
    position: string | null;
    fio: string | null;
  },
  errors: {
    resolve_to?: string | null;
    member_fio?: string | null;
    member_position?: string | null;
    agent_from_gbu_position?: string | null;
    agent_from_gbu_fio?: string | null;
  }; // ошибка в заполнении формы ФИО, должность
  canSaveMember: boolean; // возможность сохранить члена комиссии
  canSaveAgent: boolean; // Возможность сохранить члена комиссии от ГБУ
  showMemberAdd: boolean; // Показывать блок с добавлением членов комиссии
  showAgentAdd: boolean; // Показывать блок с добавлением членов гбу
};

const initialState: ViewAddInspectEmployeeInitialState = {
  commission_members: [],
  companyAgentList: null,
  member_fio: null,
  member_position: null,
  agent_from_gbu_position: null,
  agent_from_gbu_fio: null,
  agent_from_gbu: {
    position: null,
    fio: null,
  },
  errors: {
    resolve_to: null,
    member_fio: null,
    member_position: null,
    agent_from_gbu_position: null,
    agent_from_gbu_fio: null,
  },
  canSaveMember: false,
  canSaveAgent: false,
  resolve_to: null,
  showMemberAdd: false,
  showAgentAdd: false,
};

const closedMemberInitState = {
  member_fio: null,
  member_position: null,
  canSaveMember: false,
  showMemberAdd: false,
};

const closedAgentInitState = {
  agent_from_gbu_fio: null,
  agent_from_gbu_position: null,
  canSaveAgent: false,
  showAgentAdd: false,
};

const ADD_DATA_MEMBERS = 'ADD_DATA_MEMBERS';
const REMOVE_DATA_MEMBERS = 'REMOVE_DATA_MEMBERS';
const SHOW_MEMBERS_ADD = 'SHOW_MEMBERS_ADD';

const CHANGE_DATA_RESOLVE_TO = 'CHANGE_DATA_RESOLVE_TO';
const CHANGE_DATA = 'CHANGE_DATA';

const ADD_DATA_AGENT = 'ADD_DATA_AGENT';
const SHOW_AGENT_ADD = 'SHOW_AGENT_ADD';

const reducer = (state: ViewAddInspectEmployeeInitialState, { type, payload }) => {
  switch (type) {
    case ADD_DATA_MEMBERS: {
      const commission_members =  [
        ...state.commission_members,
      ];

      const newMember = {
        ...payload.data,
        id: commission_members.length
          ? commission_members.length
          : 0,
      };

      let memberInitState = null;
      if ( payload.setClosedMemberInitState ) {
        memberInitState = {
          ...closedMemberInitState,
        };
      }

      return {
        ...state,
        ...memberInitState,
        commission_members: [...commission_members, newMember],
      };
    }
    case SHOW_MEMBERS_ADD: {
      const errors = validate(addInspectEmployeeSchema, state, { type, payload });
      return {
        ...state,
        showMemberAdd: payload.data,
        member_fio: null,
        member_position: null,
        errors,
      };
    }
    case REMOVE_DATA_MEMBERS: {
      const memberId = get(payload, 'data.id', null);
      const commission_members = state.commission_members.filter((member) => member.id !== memberId);

      return {
        ...state,
        commission_members,
      };
    }

    case ADD_DATA_AGENT: {
      const agent_from_gbu = {
        fio: state.agent_from_gbu_fio,
        position: state.agent_from_gbu_position,
      };

      return {
        ...state,
        ...closedAgentInitState,
        agent_from_gbu,
      };
    }
    case SHOW_AGENT_ADD: {
      const errors = validate(addInspectEmployeeSchema, state, { type, payload });

      return {
        ...state,
        showAgentAdd: payload.data,
        agent_from_gbu_fio: null,
        agent_from_gbu_position: null,
        errors,
      };
    }

    case CHANGE_DATA_RESOLVE_TO: { // <<< логика описанна на стр 15, п. 11, добавить через схему
      return {
        ...state,
        resolve_to: payload.data,
      };
    }
    case CHANGE_DATA: {
      const changedState = {
        ...state,
        ...payload.data,
      };
      const errors = validate(addInspectEmployeeSchema, changedState, { type, payload });
      const canSaveMember = !errors.member_fio && !errors.member_position;
      const canSaveAgent = !errors.agent_from_gbu_fio && !errors.agent_from_gbu_position;

      // tslint:disable-next-line:no-console
      console.log('errors ==== ', {errors});
      return {
        ...changedState,
        canSaveMember,
        canSaveAgent,
        errors,
      };
    }
    default: return state;
  }
};

// ---- members ----
const actionAddMembers = (data: MembersInspElem, setClosedMemberInitState: boolean) => ({
  type: ADD_DATA_MEMBERS,
  payload: {
    data,
    setClosedMemberInitState,
  },
});
const actionShowMembersAdd = (data: boolean) => ({
  type: SHOW_MEMBERS_ADD,
  payload: {
    data,
  },
});
const actionRemoveMembers = (data: MembersInspElem) => ({
  type: REMOVE_DATA_MEMBERS,
  payload: {
    data,
  },
});

// ---- agent ----
const actionAddAgent = () => ({
  type: ADD_DATA_AGENT,
  payload: {},
});
const actionShowAgentAdd = (data: boolean) => ({
  type: SHOW_AGENT_ADD,
  payload: {
    data,
  },
});

const actionChangeData = (data: any) => ({
  type: CHANGE_DATA,
  payload: {
    data,
  },
});

const ViewAddInspectEmployee: React.FC<ViewAddInspectEmployeeProps> = (props) => {
  const {type, userData} = props;
  const [state, dispatch] = React.useReducer<Reducer<ViewAddInspectEmployeeInitialState, any>>(
    reducer,
    initialState,
  );

  const isPermittedChangeCloseParams = (
    props.isPermitted
    && props.type === INSPECT_AUTOBASE_TYPE_FORM.close
  );

  const onChangeData = React.useCallback(
    (key, valueEvent) => {
      const shemaElemByKey = addInspectEmployeeSchema.properties.find((elem) => elem.key === key);
      let value = null;
      switch (shemaElemByKey.type) {
        case 'boolean':
          value = get(valueEvent, 'target.checked', null);
          break;
        case 'number':
          value = get(valueEvent, 'target.value', null);
          break;
        case 'string':
          value = get(valueEvent, 'target.value', null);
          break;
        default: value = valueEvent;
      }
      const changeObj = {
        [key]: value,
      };
      dispatch(
        actionChangeData(changeObj),
      );
    },
    [
      state.resolve_to,
      state.member_fio,
      state.member_position,
      state.agent_from_gbu_position,
      state.agent_from_gbu_fio,
    ],
  );

  // DidMount
  React.useEffect(
    () => {
      dispatch(
        actionChangeData(null),
      );
      dispatch(
        actionAddMembers({
          fio: userData.fio,
          position: userData.role,
          clearable: false,
          id: 0,
        },
        true),
      );
    },
    [],
  );

  const newMember = {
    fio: state.member_fio,
    position: state.member_position,
    clearable: true,
  };

  const showAgentFromGbu = (state.agent_from_gbu.fio && state.agent_from_gbu.position);

  // tslint:disable-next-line:no-console
  console.log('render into state', { state, props, });

  return type !== INSPECT_AUTOBASE_TYPE_FORM.list
    ? (
      <ViewAddInspectEmployeeWrapper>
        <Col md={6} sm={6}>
          <Row>
            <Col md={12}>
              <ExtField
                type="date"
                label="Срок, до которого необходимо устранить недостатки"
                time={false}
                date={state.resolve_to}
                onChange={onChangeData}
                error={state.errors.resolve_to}
                boundKeys="resolve_to"
              />
            </Col>
          </Row>
          <ViewInspectSingleBlock>
            <Row>
              <Col md={12}>
                <h4>Члены комиссии:</h4>
                {
                  state.commission_members.map((employeeData) => (
                    <Row>
                      <Col md={12}>
                        <EmpRow highlight={employeeData.clearable}>
                          <EmpInfo>{employeeData.fio}, {employeeData.position}</EmpInfo>
                          {
                            employeeData.clearable && isPermittedChangeCloseParams
                              ? (
                                <>
                                  &nbsp;
                                  <Button disabled={!props.canRemoveEmployee} className="close" onClick={() => { dispatch(actionRemoveMembers(employeeData)); } }>
                                    <span aria-hidden="true">
                                      ×
                                    </span>
                                  </Button>
                                </>
                              )
                              : (
                                <DivNone />
                              )
                          }
                        </EmpRow>
                      </Col>
                    </Row>
                  ))
                }
                {
                  state.showMemberAdd ? (
                    <Row>
                      <Col md={12}>
                        <ShowBlockWrapper>
                          <Row>
                            <Col md={6}>
                              <FieldWrap>
                                <ExtField
                                  type="string"
                                  label="Должность"
                                  value={state.member_position}
                                  onChange={onChangeData}
                                  boundKeys="member_position"
                                  error={state.errors.member_position}
                                />
                              </FieldWrap>
                            </Col>
                            <Col md={6}>
                              <FieldWrap>
                                <ExtField
                                  type="string"
                                  label="ФИО"
                                  value={state.member_fio}
                                  onChange={onChangeData}
                                  boundKeys="member_fio"
                                  error={state.errors.member_fio}
                                />
                              </FieldWrap>
                            </Col>
                          </Row>
                          <Div>
                            <Button disabled={!state.canSaveMember} onClick={ () => dispatch(actionAddMembers(newMember, true)) }>
                              Сохранить
                            </Button>
                          </Div>
                          <Button className="close" onClick={ () => dispatch(actionShowMembersAdd(false)) }>
                            <span aria-hidden="true">
                              ×
                            </span>
                          </Button>
                        </ShowBlockWrapper>
                      </Col>
                    </Row>
                  ) : (
                    <DivNone />
                  )
                }
                {
                  isPermittedChangeCloseParams
                    ? (
                      <Row>
                        <Col md={12}>
                          <Button
                            disabled={!props.canAddMembers || state.showMemberAdd}
                            onClick={ () => dispatch(actionShowMembersAdd(true)) }>
                            <Glyphicon glyph="plus"/>&nbsp;Добавить проверяющего
                          </Button>
                        </Col>
                      </Row>
                    )
                    : (
                      <DivNone />
                    )
                }
              </Col>
            </Row>
          </ViewInspectSingleBlock>
          <ViewInspectSingleBlock>
            <Row>
              <Col md={12}>
                <h4>
                  От ГБУ:&nbsp;{`${props.selectedInspectAutobase.company_name}`}
                </h4>
                {
                  <Col md={12}>
                    <EmpRow>
                      <EmpInfo hidden={!showAgentFromGbu}>
                        {state.agent_from_gbu.fio},&nbsp;
                        {state.agent_from_gbu.position}
                      </EmpInfo>
                    </EmpRow>
                  </Col>
                }
                {
                  state.showAgentAdd ? (
                    <Col md={12}>
                      <ShowBlockWrapper>
                        <Row>
                          <Col md={6}>
                            <FieldWrap>
                              <ExtField
                                type="string"
                                label="Должность"
                                value={state.agent_from_gbu_position}
                                onChange={onChangeData}
                                boundKeys="agent_from_gbu_position"
                                error={state.errors.agent_from_gbu_position}
                              />
                            </FieldWrap>
                          </Col>
                          <Col md={6}>
                            <FieldWrap>
                              <ExtField
                                type="string"
                                label="ФИО"
                                value={state.agent_from_gbu_fio}
                                onChange={onChangeData}
                                boundKeys="agent_from_gbu_fio"
                                error={state.errors.agent_from_gbu_fio}
                              />
                            </FieldWrap>
                          </Col>
                        </Row>
                        <Div>
                          <Button disabled={!state.canSaveAgent} onClick={ () => dispatch(actionAddAgent()) }>
                            Сохранить
                          </Button>
                        </Div>
                        <Button className="close" onClick={ () => dispatch(actionShowAgentAdd(false)) }>
                          <span aria-hidden="true">
                            ×
                          </span>
                        </Button>
                      </ShowBlockWrapper>
                    </Col>
                  ) : (
                    <DivNone />
                  )
                }
                {
                  isPermittedChangeCloseParams
                    ? (
                      <Row>
                        <Col md={12}>
                          <Button
                            disabled={!props.canAddCompanyAgent || state.showAgentAdd}
                            onClick={ () => dispatch(actionShowAgentAdd(true)) }>
                            <Glyphicon glyph="plus"/>
                            &nbsp;
                            {
                              state.agent_from_gbu.fio && state.agent_from_gbu.position
                              ? 'Изменить представителя ГБУ'
                              : 'Добавить представителя ГБУ'
                            }
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <DivNone />
                    )
                }
              </Col>
            </Row>
          </ViewInspectSingleBlock>
        </Col>
      </ViewAddInspectEmployeeWrapper>
    )
    : (
      <DivNone />
    );
};

// export default ViewAddInspectEmployee;
export default connect<any, any, any, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(ViewAddInspectEmployee);
