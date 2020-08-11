import * as React from 'react';
import { compose } from 'recompose';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { carInfoSetGpsNumber, fetchTrack, fetchCarInfo, carInfoChangeDateAndForToday } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { createValidDateTime, diffDates, getStartOfServerToday } from 'components/@next/@utils/dates/dates';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

type Props = WithSearchProps;

export const MonitorSearchParamsDefault: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const [date_start_Moscow, setStartMoscow] = React.useState(null);
    const [date_end_Moscow, setEndMoscow] = React.useState(null);
    const [timeOutNumber, setTimeOutNumber] = React.useState(null);

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
    const refresh = props.searchState.refresh;
    const waybill_id = props.match.params.waybill_id;
    const for_today = etsUseSelector((state) => getMonitorPageState(state).carInfo.forToday);

    React.useEffect(
      () => {
        dispatch(actionLoadTimeMoscow({}, { page: 'mainpage' })).then((time) => {
          setStartMoscow(getStartOfServerToday(createValidDateTime(time.date)));
          setEndMoscow(createValidDateTime(time.date));
          setTimeOutNumber(null);
          setTimeOutNumber((60 - diffDates(time.date, createValidDateTime(time.date))) * 1000);
        });
      },
      [gov_number_old, gov_number,],
    );

    React.useEffect(
      () => {
        let timeOutId, intervalId;
        if(timeOutNumber) {
          timeOutId = setTimeout(() => {
            const dateEnd = new Date(date_end_Moscow);
            dateEnd.setMinutes(dateEnd.getMinutes() + 1);
            setEndMoscow(createValidDateTime(dateEnd));
            intervalId = setInterval(() => {
              dateEnd.setMinutes(dateEnd.getMinutes() + 1);
              setEndMoscow(createValidDateTime(dateEnd));
            }, 60000);
          }, timeOutNumber);
        }
        return () => {
          clearTimeout(timeOutId);
          clearInterval(intervalId);
        };
      },
      [timeOutNumber],
    );

    React.useEffect(
      () => {
        if (date_start && date_end && carData.data && !waybill_id) {
          const payload = {
            asuods_id: carData.data.asuods_id,
            gps_code: carData.data.gps_code,
            date_start,
            date_end,
          };

          dispatch(fetchTrack(payload));
          dispatch(fetchCarInfo(payload, { page: 'mainpage' }));
        }
      },
      [
        date_start,
        date_end,
        carData,
        waybill_id,
      ],
    );

    React.useEffect(
      () => {
        if (refresh && date_start && date_end && carData.data) {
          const payload = {
            asuods_id: carData.data.asuods_id,
            gps_code: carData.data.gps_code,
            date_start,
            date_end,
          };

          dispatch(fetchTrack(payload));
          dispatch(fetchCarInfo(payload, { page: 'mainpage' }));

          if (refresh) {
            props.setDataInSearch({
              refresh: null,
            });
          }
        }
      },
      [
        refresh,
      ],
    );

    /****************************** end ******************************/
    /****************************** for_today ******************************/

    React.useEffect(
      () => {      
        const validDateStartMoscow = createValidDateTime(date_start_Moscow);
        const validDateEndMoscow = createValidDateTime(date_end_Moscow);
        const validSearchStateDateStart = createValidDateTime(date_start);
        const validSearchStateDateEnd = createValidDateTime(date_end);

        const datesIsMove = (
          diffDates(validDateStartMoscow, validSearchStateDateStart)
           || diffDates(validDateEndMoscow, validSearchStateDateEnd)
        );
        const intervalId = setInterval(
          () => {
            if (carData.data && datesIsMove && for_today) {
              dispatch(
                carInfoChangeDateAndForToday(for_today, validDateStartMoscow, validDateEndMoscow),
              );
              props.setDataInSearch({
                date_start: validDateStartMoscow,
                date_end: validDateEndMoscow,
              });
            }
          },
          1000,
        );

        return () => {
          clearInterval(intervalId);
        };
      },
      [carData, date_start, date_end, for_today, date_start_Moscow, date_end_Moscow,],
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
