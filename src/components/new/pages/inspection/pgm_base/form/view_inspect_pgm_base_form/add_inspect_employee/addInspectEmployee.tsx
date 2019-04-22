import * as React from 'react';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import { Button, Row, Col, Glyphicon } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';
import { ViewInspectPgmBaseOwnProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
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
} from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/add_inspect_employee/styled';
import Div from 'components/ui/Div';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export type ViewAddInspectEmployeeProps = {
  type: ViewInspectPgmBaseOwnProps['type'];
  isPermitted: boolean;
  canAddMembers: boolean;
  canAddCompanyAgent: boolean;
  canRemoveEmployee: boolean;
  userData: InitialStateSession['userData'];
  selectedInspectPgmBase: InspectPgmBase;
  setComissionAndMembers: (
    agents_from_gbu: ViewAddInspectEmployeeInitialState['agents_from_gbu'],
    commission_members: ViewAddInspectEmployeeInitialState['commission_members'],
    resolve_to: ViewAddInspectEmployeeInitialState['resolve_to'],
  ) => any;
};

type MembersComissionInspElem = {
  fio: string;
  position: string;
  clearable: boolean;
  id?: number; // на бек не передавать
};

export type ViewAddInspectEmployeeInitialState = {
  resolve_to: any | null; // устранить до? date or string
  commission_members: MembersComissionInspElem[] | null; // члены комиссии
  member_fio: string | null;
  member_position: string | null;
  agent_from_gbu_position: string | null;
  agent_from_gbu_fio: string | null;
  agents_from_gbu: MembersComissionInspElem[] | null,
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

export const viewAddInspectEmployeeInitialState: ViewAddInspectEmployeeInitialState = {
  commission_members: [],
  member_fio: null,
  member_position: null,
  agent_from_gbu_position: null,
  agent_from_gbu_fio: null,
  agents_from_gbu: [],
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
const REMOVE_DATA_AGENT = 'REMOVE_DATA_AGENT';
const SHOW_AGENT_ADD = 'SHOW_AGENT_ADD';

const reducer = (state: ViewAddInspectEmployeeInitialState, { type, payload }) => {
  switch (type) {
    case ADD_DATA_MEMBERS: {
      const commission_members =  [
        ...state.commission_members,
      ];
      const newId = Math.max.apply(Math, commission_members.map((o) => o.id)) + 1; // воизбежание коллизий
      const newMember = {
        ...payload.data,
        id: commission_members.length
          ? newId
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
      const errors = validate(addInspectEmployeeSchema, state, { type, payload }, state);
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
    case REMOVE_DATA_AGENT: {
      const agentId = get(payload, 'data.id', null);
      const agents_from_gbu = state.agents_from_gbu.filter((agent) => agent.id !== agentId);

      return {
        ...state,
        agents_from_gbu,
      };
    }
    case ADD_DATA_AGENT: {
      const agents_from_gbu =  [
        ...state.agents_from_gbu,
      ];

      const newAgent = {
        ...payload.data,
        id: agents_from_gbu.length
          ? agents_from_gbu.length
          : 0,
      };

      let agentInitState = null;
      if ( payload.setClosedAgentInitState ) {
        agentInitState = {
          ...closedAgentInitState,
        };
      }

      return {
        ...state,
        ...agentInitState,
        agents_from_gbu: [...agents_from_gbu, newAgent],
      };
    }
    case SHOW_AGENT_ADD: {
      const errors = validate(addInspectEmployeeSchema, state, { type, payload }, state);

      return {
        ...state,
        showAgentAdd: payload.data,
        agent_from_gbu_fio: null,
        agent_from_gbu_position: null,
        errors,
      };
    }

    case CHANGE_DATA_RESOLVE_TO: {
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
      const errors = validate(addInspectEmployeeSchema, changedState, { type, payload }, changedState);
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
const actionAddMembers = (data: MembersComissionInspElem, setClosedMemberInitState: boolean) => ({
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
const actionRemoveMembers = (data: MembersComissionInspElem) => ({
  type: REMOVE_DATA_MEMBERS,
  payload: {
    data,
  },
});

// ---- agent ----
const actionAddAgent = (data: MembersComissionInspElem, setClosedAgentInitState: boolean) => ({
  type: ADD_DATA_AGENT,
  payload: {
    data,
    setClosedAgentInitState,
  },
});
const actionShowAgentAdd = (data: boolean) => ({
  type: SHOW_AGENT_ADD,
  payload: {
    data,
  },
});
const actionRemoveAgents = (data: MembersComissionInspElem) => ({
  type: REMOVE_DATA_AGENT,
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
    viewAddInspectEmployeeInitialState,
  );

  const isPermittedChangeCloseParams = (
    props.isPermitted
    && props.type === INSPECT_PGM_BASE_TYPE_FORM.close
  );

  const onChangeData = React.useCallback(
    (key, valueEvent) => {
      const shemaElemByKey = addInspectEmployeeSchema.properties[key];
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

      const closeEmployeeFio = props.selectedInspectPgmBase.close_employee_fio
      ? props.selectedInspectPgmBase.close_employee_fio
      : userData.fio;
      const closeEmployeePosition = props.selectedInspectPgmBase.close_employee_position
        ? props.selectedInspectPgmBase.close_employee_position
        : '-';
      const userMember = {
        fio: closeEmployeeFio,
        position: closeEmployeePosition,
        clearable: false,
        id: 0,
      };

      dispatch(
        actionAddMembers(
          userMember,
          true,
        ),
      );

      const commission_members = props.selectedInspectPgmBase.commission_members
        ? [...props.selectedInspectPgmBase.commission_members, userMember]
        : [userMember];

      if ( props.type === INSPECT_PGM_BASE_TYPE_FORM.closed || props.type === INSPECT_PGM_BASE_TYPE_FORM.list ) {
        dispatch(
          actionChangeData({
            resolve_to: props.selectedInspectPgmBase.resolve_to,
            commission_members,
            agents_from_gbu: props.selectedInspectPgmBase.agents_from_gbu,
          }),
        );
      }
    },
    [],
  );

  // Для синхронизации с родительским компонентом
  React.useEffect(
    () => {
      const {
        agents_from_gbu,
        commission_members,
        resolve_to,
      } = state;
      props.setComissionAndMembers(
        agents_from_gbu,
        commission_members,
        resolve_to,
      );
    },
    [state.agents_from_gbu, state.commission_members, state.resolve_to],
  );

  const newMember = {
    fio: state.member_fio,
    position: state.member_position,
    clearable: true,
  };

  const newAgent = {
    fio: state.agent_from_gbu_fio,
    position: state.agent_from_gbu_position,
    clearable: true,
  };

  // const showAgentFromGbu = (state.agents_from_gbu.fio && state.agents_from_gbu.position);
  const resolveToIsDisabled = (type === INSPECT_PGM_BASE_TYPE_FORM.closed);

  // tslint:disable-next-line:no-console
  console.log('render into state', { state, props, });

  return type !== INSPECT_PGM_BASE_TYPE_FORM.list
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
                disabled={resolveToIsDisabled}
              />
            </Col>
          </Row>
          <ViewInspectSingleBlock>
            <Row>
              <Col md={12}>
                <h4>Члены комиссии:</h4>
                {
                  state.commission_members.map((employeeData, index) => (
                    <Row key={index}>
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
                  От ГБУ:&nbsp;{`${props.selectedInspectPgmBase.company_name}`}
                </h4>
                {
                  state.agents_from_gbu.map((employeeData, index) => (
                    <Row key={index}>
                      <Col md={12}>
                        <EmpRow highlight={employeeData.clearable}>
                          <EmpInfo>{employeeData.fio}, {employeeData.position}</EmpInfo>
                          {
                            employeeData.clearable && isPermittedChangeCloseParams
                              ? (
                                <>
                                  &nbsp;
                                  <Button disabled={!props.canRemoveEmployee} className="close" onClick={() => { dispatch(actionRemoveAgents(employeeData)); } }>
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
                  state.showAgentAdd ? (
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
                        <Button disabled={!state.canSaveAgent} onClick={ () => dispatch(actionAddAgent(newAgent, true)) }>
                          Сохранить
                        </Button>
                      </Div>
                      <Button className="close" onClick={ () => dispatch(actionShowAgentAdd(false)) }>
                        <span aria-hidden="true">
                          ×
                        </span>
                      </Button>
                    </ShowBlockWrapper>
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
                            Добавить представителя ГБУ
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
