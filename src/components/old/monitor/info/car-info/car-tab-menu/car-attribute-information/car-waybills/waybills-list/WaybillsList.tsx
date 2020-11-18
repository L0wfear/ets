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
import { FlexContainer } from 'global-styled/global-styled';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import * as queryString from 'query-string';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

export const FlexContainerStyled = styled(FlexContainer as any)`
  justify-content: space-between;
`;

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
    const location = useLocation();
    const popoverHoverFocus = (
      <EtsBootstrap.Popover id="popover-trigger-hover">
        {'Обновление информации на карте и в карточке ТС в соответствии с периодом действия ПЛ'}
      </EtsBootstrap.Popover>
    );
    const setShowWaybill = React.useCallback((date_start, date_end, id) => {
      setParamsAndSearch({
        params: {
          waybill_id: id
        },
        search: {
          date_start, date_end
        }
      });
    }, [setParamsAndSearch]);

    const setDatesInSearch = React.useCallback((date_start, date_end) => {
      const searchParams = queryString.parse(location.search);
      if (forToday) {
        carInfoChangeDateAndForToday(false, date_start, date_end);
      }
      if (searchParams.date_start !== date_start || searchParams.date_end !== date_end) {
        setParamsAndSearch({
          params: {
            waybill_id: null
          },
          search: {
            date_start, date_end
          }
        });
      }
    }, [forToday, carInfoChangeDateAndForToday, setParamsAndSearch, location]);

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
                    <FlexContainerStyled direction="column" alignItems="center">
                      <EtsBootstrap.Glyphicon glyph="info-sign" className="pointer fontSize24"
                        onClick={() => setShowWaybill(waybill.date_start, waybill.date_end, waybill.id)} />
                      <EtsButtonsContainer>
                        <EtsBootstrap.OverlayTrigger
                          trigger={['hover']}
                          placement="top"
                          overlay={popoverHoverFocus}
                        >
                          <EtsBootstrap.Button
                            id="refresh"
                            data-id={waybill.id}
                            onClick={() =>
                              setDatesInSearch(waybill.date_start, waybill.date_end)
                            }
                          >
                            <EtsBootstrap.Glyphicon glyph="refresh" />
                          </EtsBootstrap.Button>
                        </EtsBootstrap.OverlayTrigger>
                      </EtsButtonsContainer>
                    </FlexContainerStyled>
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
    path: ['monitorPage', 'carInfo', 'missionsAndWaybillsData', 'waybills'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'missionsAndWaybillsData', 'error'],
  }),
  connect<Pick<PropsCarWaybills, 'forToday'>, Pick<PropsCarWaybills, 'carInfoChangeDateAndForToday'>, {}, ReduxState>(
    (state) => ({
      waybills: state.monitorPage.carInfo.missionsAndWaybillsData.waybills,
      forToday: state.monitorPage.carInfo.forToday,
    }),
    (dispatch) => ({
      carInfoChangeDateAndForToday: (for_today, validDateStartMoscow, validDateEndMoscow) => dispatch(carInfoChangeDateAndForToday(for_today, validDateStartMoscow, validDateEndMoscow)),
    })
  ),
)(WaybillsList);
