import * as React from 'react';
import { connect } from 'react-redux';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldBrigadeEmployeeIdListDutyMission,
  StatePropsFieldBrigadeEmployeeIdListDutyMission,
  DispatchPropsFieldBrigadeEmployeeIdListDutyMission,
  OwnPropsFieldBrigadeEmployeeIdListDutyMission,
  StateFieldBrigadeEmployeeIdListDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/brigade_employee_id_list/FieldBrigadeEmployeeIdListDutyMission.d';
import { getEmployeeState } from 'redux-main/reducers/selectors/index';
import { makeOptionsByEmployee, isPermittedEmployeeForDutyMission } from 'components/new/pages/missions/duty_mission/form/main/utils';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { componentsForSelect } from './styled';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

/**
 * Поле "Бригада" для формы наряд-задания
 * зависит от выбранного подразделения и выбранного бригадира (берётся последняя бригада)
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldBrigadeEmployeeIdListDutyMission extends React.PureComponent<PropsFieldBrigadeEmployeeIdListDutyMission, StateFieldBrigadeEmployeeIdListDutyMission> {
  state = {
    BRIGADE: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldBrigadeEmployeeIdListDutyMission) {
    let BRIGADE = makeOptionsByEmployee(
      nextProps.employeeList,
      nextProps.structure_id,
    );

    const notAvtiveEmployee = nextProps.brigade_employee_id_list.reduce<StateFieldBrigadeEmployeeIdListDutyMission['BRIGADE']>((newArr, employee) => {
      if (!BRIGADE.find((empl) => empl.value === employee.employee_id)) {
        newArr.push({
          value: employee.employee_id,
          label: employee.employee_fio,
          rowData: {
            ...employee,
            active_for_brigade: !BRIGADE.length,
          },
        });
      }

      return newArr;
    }, []);

    if (notAvtiveEmployee.length) {
      BRIGADE = [
        ...BRIGADE,
        ...notAvtiveEmployee,
      ];
    }

    return {
      BRIGADE,
    };
  }

  async componentDidUpdate(prevProps: PropsFieldBrigadeEmployeeIdListDutyMission) {
    const {
      foreman_id,
      structure_id,
      page,
      path,
      isPermitted,
    } = this.props;

    if (isPermitted) {
      if (foreman_id && foreman_id !== prevProps.foreman_id) {
        const lastBrigade = await this.props.actionLoadLastBrigade(
          { id: foreman_id },
          { page, path },
        );

        this.props.onChange({
          brigade_employee_id_list: lastBrigade.last_brigade.map((id, index) => ({
            employee_id: id,
            employee_fio: lastBrigade.last_brigade_fios[index],
          })),
          brigade_employee_id_list_id: lastBrigade.last_brigade,
          brigade_employee_id_list_fio: lastBrigade.last_brigade_fios,
        });
      }

      if (structure_id !== prevProps.structure_id) {
        const {
          brigade_employee_id_list,
          employeeIndex,
        } = this.props;
        const sortedBrigadeByStructureId = brigade_employee_id_list.reduce((newArr, employeeInBrigade) => {
          if (isPermittedEmployeeForDutyMission(employeeIndex[employeeInBrigade.employee_id], structure_id)) {
            newArr.push(employeeInBrigade);
          }
          return newArr;
        }, []);

        if (sortedBrigadeByStructureId.length !== brigade_employee_id_list.length) {
          this.props.onChange({
            brigade_employee_id_list: sortedBrigadeByStructureId,
            brigade_employee_id_list_id: sortedBrigadeByStructureId.map(({ employee_id }) => employee_id),
            brigade_employee_id_list_fio: sortedBrigadeByStructureId.map(({ employee_fio }) => employee_fio),
          });
        }
      }
    }
  }

  handleChange = (value: DutyMission['brigade_employee_id_list_id'], options: StateFieldBrigadeEmployeeIdListDutyMission['BRIGADE']) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        brigade_employee_id_list: options.map((oneEmployeeOption) => ({
          employee_id: oneEmployeeOption.value,
          employee_fio: oneEmployeeOption.label,
        })),
        brigade_employee_id_list_id: value,
        brigade_employee_id_list_fio: options.map((oneEmployeeOption) => oneEmployeeOption.label),
      });
    }
  }

  render() {
    const {
      BRIGADE,
    } = this.state;

    return (
      <ExtField
        id="brigade_employee_id_list"
        modalKey={this.props.page}
        type="select"
        multi
        label="Бригада"
        error={this.props.error}
        disabled={this.props.disabled}
        components={componentsForSelect}
        options={BRIGADE}
        value={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldBrigadeEmployeeIdListDutyMission, DispatchPropsFieldBrigadeEmployeeIdListDutyMission, OwnPropsFieldBrigadeEmployeeIdListDutyMission, ReduxState>(
  (state) => ({
    employeeList: getEmployeeState(state).employeeList,
    employeeIndex: getEmployeeState(state).employeeIndex,
  }),
  (dispatch: any) => ({
    actionLoadLastBrigade: (...arg) => (
      dispatch(
        employeeActions.actionLoadLastBrigade(...arg),
      )
    ),
  }),
)(FieldBrigadeEmployeeIdListDutyMission);
