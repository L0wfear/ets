import { EdcRequestInfoDetailService } from 'api/Services';
import { get } from 'lodash';
import { Mission } from '../../missions/mission/@types';
import { DutyMission } from '../../missions/duty_mission/@types';

export const promiseGetEdcRequestInfo = async (payload: {id: number, original: boolean}) => {
  let response = null;

  const id = get(payload, 'id', null);
  const original = get(payload, 'original', null);
  try {
    // через path перекинуть id
    // формат /edc/request/<id>/info/?original=true
    response = await EdcRequestInfoDetailService.path(id).path('info').get({original});
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: (Mission | DutyMission)[] = get(response, 'result.rows', []).map(
    (rowData) => {
      rowData.type_mission = 'current_percentage' in rowData ? 'mission' : 'duty_mission';

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
