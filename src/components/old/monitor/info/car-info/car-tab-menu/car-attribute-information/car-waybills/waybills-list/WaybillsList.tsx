import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { getFormattedDateTime } from 'components/@next/@utils/dates/dates';
import { NO_DATA_TEXT } from 'constants/statuses';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ReduxState } from 'redux-main/@types/state';
import { carInfoChangeDateAndForToday } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';

type PropsCarWaybills = {
  waybills: Array<any>;
  forToday: Boolean;
  carInfoChangeDateAndForToday: (for_today: boolean, validDateStartMoscow: string, validDateEndMoscow: string) => void;
} & WithSearchProps;

const WaybillsList: React.FC<PropsCarWaybills> = React.memo(
  (props) => {
    const { 
      waybills: { length }, 
      waybills,
      forToday,
      carInfoChangeDateAndForToday,
      setParamsAndSearch,
    } = props;

    const setDatesInSearch = React.useCallback((date_start, date_end, id) => {
      if (forToday) {
        carInfoChangeDateAndForToday(false, date_start, date_end);
      }
      setParamsAndSearch({params: {waybill_id: id}, search: {date_start, date_end,}});
    }, [forToday, carInfoChangeDateAndForToday, setParamsAndSearch]);
    return (
      <div className="car_info-missions_list_container">
        {
          length === 0
            ? (
              <div className="center-preloader">
                <div>{NO_DATA_TEXT}</div>
              </div>
            )
            :        (
              waybills.map((waybill) => {
                return (
                  <div key={waybill.number} className={'car_info_mission_data_container'}>
                    <div className="car_info_mission_container">
                      <div
                        data-id={waybill.number}
                        className={'mission_title'}
                      >
                        {`№${waybill.number}`}
                      </div>
                      <div className={'mission_vehicle_info'}>{`Статус: ${waybill.status === 'closed' ? 'закрыт' : 'активный'}`}</div>
                      { length >= 1
                        ? ([
                          <div key="date-start" className={'mission_vehicle_info'}>{`Выезд ${waybill.status === 'closed' ? 'факт.' : 'план.'}: ${getFormattedDateTime(waybill.date_start)}`}</div>,
                          <div key="date-end" className={'mission_vehicle_info'}>{`Возвращение ${waybill.status === 'closed' ? 'факт.' : 'план.'}: ${getFormattedDateTime(waybill.date_end)}`}</div>,
                        ])
                        :                    (
                          <div />
                        )
                      }
                    </div>
                    <EtsBootstrap.Glyphicon glyph="info-sign" className="pointer fontSize24" data-id={waybill.id} onClick={() => setDatesInSearch(waybill.date_start, waybill.date_end, waybill.id)} />
                  </div>
                );
              })
            )
        }
      </div>
    );
  }
); 

export default compose<PropsCarWaybills, {}>(
  withSearch,
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'waybillsData', 'waybills'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'waybillsData', 'error'],
  }),
  connect<Pick<PropsCarWaybills, 'forToday'>, Pick<PropsCarWaybills, 'carInfoChangeDateAndForToday'>, {}, ReduxState>(
    (state) => ({
      waybills: state.monitorPage.carInfo.waybillsData.waybills,
      forToday: state.monitorPage.carInfo.forToday,
    }),
    (dispatch) => ({
      carInfoChangeDateAndForToday: (for_today, validDateStartMoscow, validDateEndMoscow) => dispatch(carInfoChangeDateAndForToday(for_today, validDateStartMoscow, validDateEndMoscow)),
    })
  ),
)(WaybillsList);
