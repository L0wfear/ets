import * as React from 'react';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { getDashboardState } from 'redux-main/reducers/selectors';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type Props = {};

const CarInWorkOverallInfo: React.FC<Props> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    const infoData = etsUseSelector((state) => getDashboardState(state).car_in_work_overall.infoData);
    const handleClose = React.useCallback(
      () => {
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(null),
        );
      },
      [],
    );

    return Boolean(infoData) && (
      <InfoCard title={infoData.title} handleClose={handleClose}>
        <ul>
          {
            infoData.subItems.map(({ title }) => (
              <li key={title}>
                <span>{title}</span>
              </li>
            ))
          }
        </ul>
      </InfoCard>
    );
  },
);

export default CarInWorkOverallInfo;
