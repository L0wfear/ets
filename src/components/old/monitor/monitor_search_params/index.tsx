import * as React from 'react';
import { compose } from 'recompose';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { carInfoSetGpsNumber, fetchTrack, fetchCarInfo, carInfoToggleForToday } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';
import { getTrackDefaultDateStart, getTrackDefaultDateEnd } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

type Props = WithSearchProps;

export const MonitorSearchParamsDefault: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();

    /****************************** gps_code ******************************/
    const gov_number: Car['gov_number'] = props.match.params.gov_number;
    const gov_number_old = usePrevious(gov_number);

    const carActualGpsNumberIndex = etsUseSelector((state) => getMonitorPageState(state).carActualGpsNumberIndex);
    const carData = React.useMemo(
      () => {
        const carList = Object.values(carActualGpsNumberIndex);
        const data = carList.find((carRow) => carRow.gov_number === gov_number);

        return {
          dataIsLoaded: carList.length,
          data,
        };
      },
      [carActualGpsNumberIndex, gov_number],
    );

    React.useEffect(
      () => {
        if (gov_number) {
          if (carData.dataIsLoaded) {

            if (carData.data) {
              dispatch(carInfoSetGpsNumber(gov_number, carData.data.gps_code));
            } else {
              props.setParamsAndSearch({
                params: {
                  gov_number: null,
                },
                search: {
                  date_start: null,
                  date_end: null,
                },
              });
            }
          }
        } else {
          dispatch(carInfoSetGpsNumber(null, null));
        }
      },
      [gov_number, carData, props.setParams],
    );
    /****************************** end ******************************/
    /****************************** dates ******************************/
    const date_start = props.searchState.date_start;
    const date_end = props.searchState.date_end;

    React.useEffect(
      () => {
        if (gov_number !== gov_number_old) {
          if (gov_number) {
            props.setDataInSearch({
              date_start: createValidDateTime(!gov_number_old && date_start || getTrackDefaultDateStart()),
              date_end: createValidDateTime(!gov_number_old && date_end || getTrackDefaultDateEnd()),
            });
          } else {
            props.setDataInSearch({
              date_start: null,
              date_end: null,
            });
          }
        }
      },
      [gov_number_old, gov_number, date_start, props.setDataInSearch],
    );

    React.useEffect(
      () => {
        if (date_start && date_end && carData.data) {
          const payload = {
            asuods_id: carData.data.asuods_id,
            gps_code: carData.data.gps_code,
            date_start,
            date_end,
          };

          dispatch(fetchTrack(payload));
          dispatch(fetchCarInfo(payload));
        }
      },
      [date_start, date_end, carData],
    );

    /****************************** end ******************************/
    /****************************** for_today ******************************/
    const for_today = etsUseSelector((state) => getMonitorPageState(state).carInfo.forToday);

    React.useEffect(
      () => {
        const intervalId = setInterval(
          () => {
            const datesIsMove = (
              diffDates(getTrackDefaultDateStart(), date_start)
              || diffDates(createValidDateTime(getTrackDefaultDateEnd()), date_end)
            );

            if (carData.data && datesIsMove && for_today) {
              dispatch(
                carInfoToggleForToday(),
              );
            }
          },
          1000,
        );

        return () => {
          clearInterval(intervalId);
        };
      },
      [carData, date_start, date_end, for_today],
    );
    /****************************** end ******************************/

    React.useEffect(
      () => {
        return () => dispatch(carInfoSetGpsNumber(null, null));
      },
      [],
    );

    return null;
  },
);

export const MonitorSearchParams = compose(
  withSearch,
  withShowByProps({
    path: 'monitorPage.geoobjects.odh_mkad.data',
  }),
)(MonitorSearchParamsDefault);
