export const checkMissionsOnStructureIdCar = (missionsArr, carsIndex) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { structure_id, car_id, number }) => {
      const { company_structure_id: car_structure_id = null } = carsIndex[car_id] || {};

      if (car_structure_id !== structure_id) {
        newArr.push(`<${number}>`);
      }

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      global.NOTIFICATION_SYSTEM.notify(`Подразделение выбранного шаблона задания № ${notPermitedMissionsNumber.join(', ')} не соответствует подразделению транспортного средства. Необходимо скорректировать шаблон задания, либо выбрать другой шаблон.`, 'error');
      return true;
    }
  }

  return false;
};

export const checkMissionsOnStructureIdBrigade = (missionsArr, employeesIndex) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { foreman_id, brigade_employee_id_list = [], structure_id, number }) => {
      brigade_employee_id_list.forEach(({ employee_id }) => {
        const { company_structure_id: employee_structure_id = null } = employeesIndex[employee_id] || {};

        if (employee_structure_id !== structure_id) {
          newArr.push(`<${number}>`);
        }
      });

      const { company_structure_id: foreman_structure_id = null } = employeesIndex[foreman_id] || {};
      if (foreman_structure_id !== structure_id) {
        newArr.push(`<${number}>`);
      }

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      global.NOTIFICATION_SYSTEM.notify(`Подразделение выбранного шаблона наряд-задания № ${notPermitedMissionsNumber.join(', ')} не соответствует подразделению сотрудника. Необходимо скорректировать шаблон наряд-задания, либо выбрать другой шаблон.`, 'error');
      return true;
    }
  }

  return false;
};
