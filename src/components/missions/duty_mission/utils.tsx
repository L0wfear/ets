import * as React from 'react';
import { Label } from 'react-bootstrap';
import { uniqBy, get } from 'lodash';
import { getPermittetEmployeeForBrigade } from 'components/missions/utils/utils';

import { DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import createFio from 'utils/create-fio';

export const FormTitle: React.FunctionComponent<{ number?: string | number, status: string }> = (props) => (
  <div>
    {`Наряд-задание № ${props.number || ''}`}
    <Label bsStyle="default" style={{ marginLeft: 10 }}>{DUTY_MISSION_STATUS_LABELS[props.status]}</Label>
  </div>
);

export const makeRoutesForDutyMissionForm = ({ selectedRoute: route, routesList = [] }, { formState: state }) => {
  const routes = routesList.filter((r) => (
    (!state.structure_id || r.structure_id === state.structure_id)
  ));

  const filteredRoutes = (
    route !== null &&
    route.id !== undefined &&
    routes.find((item) => item.value === route.id) === undefined
  ) ? routes.concat([route]) : routes;

  return uniqBy(
    filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
    'value',
  );
};

export const getEmployeeFormDutyMission = ({ formState: { structure_id, foreman_id, brigade_employee_id_list, brigadeEmployeeIdIndex, foreman_full_fio } , employeesList, employeesIndex }) => {
  const EMPLOYEES = getPermittetEmployeeForBrigade(employeesList, structure_id);

  let hasNotActiveEmployees = false;

  const FOREMANS = [...EMPLOYEES];
  if (foreman_id && !FOREMANS.some(({ value }) => value === foreman_id)) {
    const employee = employeesIndex[foreman_id] || {};
    if (employee || foreman_full_fio) {
      FOREMANS.push({
        value: foreman_id,
        label: `${foreman_full_fio || createFio(employee, true)} (Неактивный сотрудник)`,
        active: false,
        company_structure_id: employee ? employee.company_structure_id : -1,
      });
      hasNotActiveEmployees = true;
    }
  }

  const BRIGADES = [...EMPLOYEES];
  brigade_employee_id_list.forEach((key) => {
    if (!BRIGADES.some(({ value }) => value === key)) { // если сотрудника из бригады нет в списке сотрудников
      const employee = employeesIndex[key] || {};
      if (employee || brigadeEmployeeIdIndex[key]) {
        BRIGADES.push({
          value: key,
          label: `${get(brigadeEmployeeIdIndex, [key, 'employee_fio'], createFio(employee, true))} (Неактивный сотрудник)`,
          active: false,
          company_structure_id: employee ? employee.company_structure_id : -1,
        });
        hasNotActiveEmployees = true;
      }
    }
  });

  return {
    FOREMANS,
    BRIGADES,
    hasNotActiveEmployees,
  };
};

export const hasNotActiveEmployeeForDutyMission = (selectedEmployeeList) => (
  selectedEmployeeList.filter(({ active }) => active)
);
