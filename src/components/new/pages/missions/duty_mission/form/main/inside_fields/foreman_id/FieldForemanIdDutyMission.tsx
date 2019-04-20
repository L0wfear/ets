import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldForemanIdDutyMission,
  StatePropsFieldForemanIdDutyMission,
  DispatchPropsFieldForemanIdDutyMission,
  OwnPropsFieldForemanIdDutyMission,
  StateFieldForemanIdDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/foreman_id/FieldForemanIdDutyMission.d';
import { getEmployeeState } from 'redux-main/reducers/selectors/index';
import { isPermittedEmployeeForDutyMission, makeOptionsByEmployee } from 'components/new/pages/missions/duty_mission/form/main/utils';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { componentsForSelect } from './styled';

/**
 * Поле "Бригадир" для формы наряд-задания
 * зависит от выбранного подразделения
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldForemanIdDutyMission extends React.PureComponent<PropsFieldForemanIdDutyMission, StateFieldForemanIdDutyMission> {
  state = {
    FOREMANS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldForemanIdDutyMission) {
    const {
      value,
    } = nextProps;

    let FOREMANS = makeOptionsByEmployee(
      nextProps.employeeList,
      nextProps.structure_id,
    );

    const notAvtiveEmployee = value && !FOREMANS.some((employee) => (
      employee.value === value
    ));

    if (notAvtiveEmployee) {
      FOREMANS = [
        ...FOREMANS,
        {
          value,
          label: nextProps.foreman_full_fio,
          rowData: {
            id: value,
            active_for_brigade: !FOREMANS.length,
          },
        },
      ];
    }

    return {
      FOREMANS,
    };
  }

  async componentDidUpdate(prevProps: PropsFieldForemanIdDutyMission) {
    const {
      isPermitted,
      value,
      structure_id,
      employeeIndex,
    } = this.props;

    if (isPermitted) {
      if (structure_id !== prevProps.structure_id && value) {
        if (!isPermittedEmployeeForDutyMission(employeeIndex[value], structure_id)) {
          this.props.onChange({
            foreman_id: null,
            foreman_full_fio: '',
          });
        }
      }
    }
  }

  handleChange = (value, option: DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean }>) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        foreman_fio: (
          get(
            option,
            'label',
            '',
          ).split(' ')
          .filter((string) => (
            Boolean(string)
          ))
          .map((string, index) => (
            index === 0
              ? `${string} `
              : string[0].toLocaleUpperCase()
           )).join('.')
        ),
        foreman_full_fio: get(option, ['label'], ''),
        foreman_id: value,
      });
    }
  }

  render() {
    const {
      props,
    } = this;

    const {
      FOREMANS,
    } = this.state;

    return (
      <ExtField
        id="foreman_id"
        type="select"
        modalKey={props.page}
        label="Бригадир"
        error={props.error}
        disabled={props.disabled}
        components={componentsForSelect}
        options={FOREMANS}
        value={props.value}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldForemanIdDutyMission, DispatchPropsFieldForemanIdDutyMission, OwnPropsFieldForemanIdDutyMission, ReduxState>(
  (state) => ({
    employeeList: getEmployeeState(state).employeeList,
    employeeIndex: getEmployeeState(state).employeeIndex,
  }),
)(FieldForemanIdDutyMission);
