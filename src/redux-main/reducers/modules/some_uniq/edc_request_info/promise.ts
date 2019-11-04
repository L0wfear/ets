import { EdcRequestInfoDetailService } from 'api/Services';
import { get } from 'lodash';
// import { Mission } from '../../missions/mission/@types';
// import { DutyMission } from '../../missions/duty_mission/@types';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';

// export type EdcRequestInfoData = (Mission | DutyMission)[];

export const promiseGetEdcRequestInfo = async (payload: {id: number; original: boolean;}) => {
  let response = null;

  const id = get(payload, 'id', null);
  const original = get(payload, 'original', null);
  try {
    response = await EdcRequestInfoDetailService.path(id).path('info').get({original});
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Array<EdcRequestInfo> = get(response, 'result.rows', []).reduce(
    (newData, currentRequest) => {
      const missions = get(currentRequest, 'missions', []).map((mission, index) => {
        const number = get(mission, 'number', '');
        const technical_operation_name = get(mission, 'technical_operation_name', '');
        const front_custom_id = get(mission, 'id', null); // unique key
        const title_name = `№${number} (${technical_operation_name})`;
        let transport_name = '-';

        if ( get(mission, 'type_mission', null) === 'mission' ) {
          const gov_number = get(mission, 'gov_number', '');
          const car_model_name = get(mission, 'car_model_name', '');
          const car_special_model_name = get(mission, 'car_special_model_name', '');
          const type_name = get(mission, 'type_name', '');
          // Рег. номер [Модель / марка / Тип ТС]
          transport_name = `${gov_number} [${car_model_name} / ${car_special_model_name} / ${type_name}]`;
        }

        return {
          ...mission,
          front_custom_id,
          title_name,
          transport_name,
        };
      });

      const edc_date = get(currentRequest, 'edc_date', null);

      return [
        {
          edc_date,
          missions,
        },
        ...newData,
      ];
    }, [],
  );

  return {
    data,
  };
};
