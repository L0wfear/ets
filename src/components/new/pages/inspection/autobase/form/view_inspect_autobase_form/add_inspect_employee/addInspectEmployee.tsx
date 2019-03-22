import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { Button, Row, Col, Glyphicon } from 'react-bootstrap';
// import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import { ViewInspectAutobaseOwnProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
// import IAVisibleWarning from 'components/new/pages/inspection/autobase/components/vsible_warning/IAVisibleWarning';
// import { validate } from 'components/ui/form/new/validate';
import {get} from 'lodash';
import { Reducer } from 'redux';
import { ExtField } from 'components/ui/new/field/ExtField';
import { addInspectEmployeeSchema } from './schema';
import { validate } from 'components/ui/form/new/validate';
import {
  ViewAddInspectEmployeeWrapper,
  ShowBlockWrapper,
  FieldWrap,
} from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/add_inspect_employee/styled';
import Div from 'components/ui/Div';

const filedToCheck: any = { // <<< выпилить
  resolveTofiledToCheck: [
    {
      key: 'resolve_to',
      title: 'Срок, до которого необходимо устранить недостатки',
      type: 'date',
    },
  ],
};

export type ViewAddInspectEmployeeProps = {
  type: ViewInspectAutobaseOwnProps['type'];
  isPermitted: boolean;
  canAddMembers: boolean;
  canAddCompanyAgent: boolean;
  canRemoveEmployee: boolean;
};

type MembersInspElem = {
  fio: string;
  position: string;
  // clearable: boolean;
  id: number; // на бек не передавать, Array.length - 1
};

export type ViewAddInspectEmployeeInitialState = {
  resolve_to: any | null; // устранить до? date or string
  commissionMembersList: MembersInspElem[] | null; // члены комиссии
  companyAgentList: MembersInspElem[] | null; // члены комиссии от компании, в данной реализации, можно добавить только 1го
  member_fio: string | null;
  member_position: string | null;
  agent_from_gbu_position: string | null;
  agent_from_gbu_fio: string | null;
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
  commissionMembersList: null,
  companyAgentList: null,
  member_fio: null,
  member_position: null,
  agent_from_gbu_position: null,
  agent_from_gbu_fio: null,
  errors: {
    resolve_to: '',
    member_fio: '',
    member_position: '',
    agent_from_gbu_position: '',
    agent_from_gbu_fio: '',
  },
  canSaveMember: false,
  canSaveAgent: false,
  resolve_to: null,
  showMemberAdd: false,
  showAgentAdd: false,
};

const ADD_DATA_MEMBERS = 'ADD_DATA_MEMBERS';
const REMOVE_DATA_MEMBERS = 'REMOVE_DATA_MEMBERS';
const CHANGE_DATA_RESOLVE_TO = 'CHANGE_DATA_RESOLVE_TO';
const CHANGE_DATA = 'CHANGE_DATA';
const SHOW_MEMBERS_ADD = 'SHOW_MEMBERS_ADD';

const reducer = (state: ViewAddInspectEmployeeInitialState, { type, payload }) => {
  switch (type) {
    case ADD_DATA_MEMBERS: {
      const commissionMembersList =  [
        ...state.commissionMembersList,
      ];

      // fio: string;
      // position: string;
      // id: number; // на бек не передавать, Array.length - 1
      // добавлять объект типа MembersInspElem !!!!!!!

      // const errors = validate(addInspectEmployeeSchema, changedState, { type, payload });
      const errors = {}; // <<< Добавить схему и сделать поля обязательными для заполнения

      return {
        ...state,
        commissionMembersList,
        errors,
        canSaveMember: Object.values(errors).every((error) => !error),
      };
    }
    case SHOW_MEMBERS_ADD: {
      return {
        ...state,
        showMemberAdd: payload.data,
      };
    }
    case REMOVE_DATA_MEMBERS: {
      const memberId = get(payload, 'data.id', null);
      const commissionMembersList = state.commissionMembersList.filter((member) => member.id !== memberId);

      return {
        ...state,
        commissionMembersList,
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
      // tslint:disable-next-line:no-console
      console.log('errors ==== ', {errors});
      return {
        ...changedState,
        errors,
      };
    }
    default: return state;
  }
};

const actionAddMembers = () => ({
  type: ADD_DATA_MEMBERS,
  payload: {},
});
const actionShowMembersAdd = (data: boolean) => ({
  type: SHOW_MEMBERS_ADD,
  payload: {
    data,
  },
});
// const actionRemoveMembers = (data: MembersInspElem) => ({
//   type: REMOVE_DATA_MEMBERS,
//   payload: {
//     data,
//   },
// });

const actionChangeData = (data: any) => ({
  type: CHANGE_DATA,
  payload: {
    data,
  },
});
// tslint:disable-next-line:no-console
console.log('FiledToCheck === ', FiledToCheck);
const ViewAddInspectEmployee: React.FC<ViewAddInspectEmployeeProps> = (props) => {
  const {type} = props;
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

  React.useEffect(
    () => {
      dispatch(
        actionChangeData(null),
      );
    },
    [],
  );

  // tslint:disable-next-line:no-console
  console.log('render into state', { state });

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
          <Row>
            <Col md={12}>
              <h4>Члены комиссии:</h4>
              {
                [
                  { fio: 'Фамилия имя отчество', position: 'должность', clearable: false },
                  { fio: 'Фамилия имя отчество можно удалить', position: 'должность', clearable: true },
                ].map((employeeData) => (
                  <Col md={12}>
                    <span>{employeeData.fio}, {employeeData.position}</span>
                    {
                      employeeData.clearable && isPermittedChangeCloseParams
                        ? (
                          <>
                            &nbsp;<Button disabled={!props.canRemoveEmployee} onClick={() => { alert('удаление'); } }><Glyphicon glyph="remove"/></Button>
                          </>
                        )
                        : (
                          <DivNone />
                        )
                    }
                  </Col>
                ))
              }
              {
                state.showMemberAdd ? (
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
                        <Button disabled={state.canSaveMember} onClick={() => { alert('удаление'); } }>
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
                ) : (
                  <DivNone />
                )
              }
              {
                isPermittedChangeCloseParams
                  ? (
                    <Col md={12}>
                      <Button disabled={!props.canAddMembers || state.showMemberAdd} onClick={ () => dispatch(actionShowMembersAdd(true)) }><Glyphicon glyph="plus"/>&nbsp;Добавить провещяющего</Button>
                    </Col>
                  )
                  : (
                    <DivNone />
                  )
              }
            </Col>
            <Col md={12}>
              <h4>{`От ГБУ "-":`}</h4>
              {
                [
                  { fio: 'Фамилия имя отчество', position: 'должность', clearable: false },
                  { fio: 'Фамилия имя отчество можно удалить', position: 'должность', clearable: true },
                ].map((employeeData) => (
                  <Col md={12}>
                    <span>{employeeData.fio}, {employeeData.position}</span>
                    {
                      employeeData.clearable && isPermittedChangeCloseParams
                        ? (
                          <>
                            &nbsp;<Button disabled={!props.canRemoveEmployee} onClick={() => { alert('удаление'); } }><Glyphicon glyph="remove"/></Button>
                          </>
                        )
                        : (
                          <DivNone />
                        )
                    }
                  </Col>
                ))
              }
              {
                isPermittedChangeCloseParams
                  ? (
                    <Col md={12}>
                      <Button disabled={!props.canAddCompanyAgent} onClick={() => { alert('добавить провещяющего'); } }><Glyphicon glyph="plus"/>&nbsp;Добавить провещяющего</Button>
                    </Col>
                  )
                  : (
                    <DivNone />
                  )
              }
              {
                <Col md={12}>
                  <ExtField
                    type="string"
                    label="Должность"
                    value={state.agent_from_gbu_position}
                    onChange={onChangeData}
                    boundKeys="agent_from_gbu_position"
                    error={state.errors.agent_from_gbu_position}
                  />
                  <ExtField
                    type="string"
                    label="ФИО"
                    value={state.agent_from_gbu_fio}
                    onChange={onChangeData}
                    boundKeys="agent_from_gbu_fio"
                    error={state.errors.agent_from_gbu_fio}
                  />
                </Col>
              }
            </Col>
          </Row>
        </Col>
      </ViewAddInspectEmployeeWrapper>
    )
    : (
      <DivNone />
    );
};

export default ViewAddInspectEmployee;
