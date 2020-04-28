import { maskStatusPoint } from 'components/new/ui/mission_info_form/utils/constants';

import { get } from 'lodash';

export const makeTitle = ({ mission_data, car_data, }) => {
  const titleArr = [
    `Информация о задании №${mission_data.number}.`,
    `Рег. номер ТС: ${car_data.gov_number}`,
  ];
  if (mission_data.column_id) {
    titleArr.push('.');
    titleArr.push(`Колонна № ${mission_data.column_id}`);
  }
  const reassignText = makeReassignText(mission_data);
  if (reassignText.length) {
    titleArr.push(reassignText);
  }

  return titleArr.join(' ').replace(' .', '.');
};

export const makeReassignText = (mission_data) => {
  return mission_data && mission_data.parent
    ? `(переназначено с  задания №${mission_data.parent.number}. Рег. номер ТС: ${mission_data.parent.gov_number})`
    : '';
};

export const makeEntries = (report_data, element) => {
  const {
    check_unit,
  } = report_data;

  const entries = get(report_data,'entries', [] ); 
  const entries_without_work = get(report_data,'entries_without_work', [] ); 

  const allEntriesList = [...entries, ...entries_without_work.map((elem) => ({...elem, is_without_work: true,}))];

  const newEntries = allEntriesList.length
    ? allEntriesList.map((report, index) => {
      if (check_unit) {
        report.route_check_unit = check_unit;
      }
      report.frontIndex = index + 1;
    
      if (element.route_data.type === 'points') {
        report.state = maskStatusPoint[report.status];
      }
    
      return report;
    })
    : null;

  return newEntries;
};
