import * as React from 'react';
import { get } from 'lodash';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { carInfoSetGpsNumber } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { getMonitorPageState } from 'redux-main/reducers/selectors';

type Props = WithSearchProps;

export const MonitorSearchParamsDefault: React.FC<Props> = React.memo(
  (props) => {
    const gov_number: Car['gov_number'] = props.match.params.gov_number;

    const dispatch = etsUseDispatch();
    const carActualGpsNumberIndex = etsUseSelector((state) => getMonitorPageState(state).carActualGpsNumberIndex);

    const carRecordData = React.useMemo(
      () => {
        const carList = Object.values(carActualGpsNumberIndex);
        return {
          hasData: Boolean(carList.length),
          record: carList.reduce((newObj, carData) => {
            newObj[carData.gov_number] = carData;

            return newObj;
          }, {}),
        };
      },
      [carActualGpsNumberIndex],
    );

    React.useEffect(
      () => {
        if (gov_number) {
          if (carRecordData.hasData) {
            const gps_code = get(carRecordData.record[gov_number], 'gps_code');
            if (gps_code) {
              dispatch(carInfoSetGpsNumber(gov_number, gps_code));
            } else {
              props.setParams({
                gov_number: null,
              });
            }
          }
        } else {
          dispatch(carInfoSetGpsNumber(null, null));
        }
      },
      [gov_number, carRecordData, props.setParams],
    );

    React.useEffect(
      () => {
        return () => dispatch(carInfoSetGpsNumber(null, null));
      },
      [],
    );

    return null;
  },
);

export const MonitorSearchParams = withSearch(MonitorSearchParamsDefault);
