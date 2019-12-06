export const makeTitle = ({ mission_data, car_data, }) => {
  const titleArr = [
    `Информация о задании №${mission_data.number}.`,
    `Рег. номер ТС: ${car_data.gov_number}`,
  ];
  if (mission_data.column_id) {
    titleArr.push('.');
    titleArr.push(`Колонна № ${mission_data.column_id}`);
  }
  if (mission_data.parent) {
    titleArr.push(`(переназначено с  задания №${mission_data.parent.number}. Рег. номер ТС: ${mission_data.car_gov_number})`);
  }

  return titleArr.join(' ').replace(' .', '.');
};
