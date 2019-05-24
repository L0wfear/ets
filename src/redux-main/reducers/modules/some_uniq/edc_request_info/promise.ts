import { EdcRequestInfoDetailService } from 'api/Services';
import { get } from 'lodash';
import { Mission } from '../../missions/mission/@types';
import { DutyMission } from '../../missions/duty_mission/@types';

export const promiseGetEdcRequestInfo = async (payload: {id: number, original: boolean}) => {
  let response = null;

  const id = get(payload, 'id', null);
  const original = get(payload, 'original', null);
  try {
    response = await EdcRequestInfoDetailService.path(id).path('info').get({original});
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: (Mission | DutyMission)[] = get(response, 'result.rows', []).map(
    (rowData) => {
      const number = get(rowData, 'number', '');
      const technical_operation_name = get(rowData, 'technical_operation_name', '');
      const gov_number = get(rowData, 'gov_number', '');
      const car_model_name = get(rowData, 'car_model_name', '');
      const car_special_model_name = get(rowData, 'car_special_model_name', '');
      const type_name = get(rowData, 'type_name', '');

      rowData.type_mission = 'current_percentage' in rowData ? 'mission' : 'duty_mission'; // <<< выпилить, когда сделают бек
      rowData.title_name = `№ ${number} (${technical_operation_name})`;
      // Рег. номер [Модель / марка / Тип ТС]
      rowData.transport_name = `${gov_number} [${car_model_name} / ${car_special_model_name} / ${type_name}]`;

      return rowData;
    },
  );

  return {
    data: [
      {
        edc_date: '1',      // Ранее завершенные работы по заявке от <дата создания предыдущей заявки в формате дд.мм.гггг>
        missions: data,
      },
      {
        edc_date: '1',      // Ранее завершенные работы по заявке от <дата создания предыдущей заявки в формате дд.мм.гггг>
        missions: data,
      },
    ],
  };
};
