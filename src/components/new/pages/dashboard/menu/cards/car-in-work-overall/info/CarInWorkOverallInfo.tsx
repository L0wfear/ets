import * as React from 'react';
import styled from 'styled-components';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import { dashboardSetInfoDataInCarInWorkOverall } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { getDashboardState } from 'redux-main/reducers/selectors';

import {
  etsUseSelector,
  etsUseDispatch,
} from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {};

const TitleView = styled.div`
  font-weight: 800;
`;

const CarInWorkOverallInfo: React.FC<Props> = React.memo(() => {
  const dispatch = etsUseDispatch();

  const infoData = etsUseSelector(
    (state) => getDashboardState(state).car_in_work_overall.infoData,
  );
  const handleClose = React.useCallback(() => {
    dispatch(dashboardSetInfoDataInCarInWorkOverall(null));
  }, []);

  const hasManySubitems = Boolean(infoData && infoData.subItems.length > 1);

  if (Boolean(infoData)) {
    return (
      <InfoCard title={infoData.title} handleClose={handleClose}>
        {infoData.subItems.map(
          (subItemData) => (
            <React.Fragment key={subItemData.title}>
              {
                hasManySubitems && (
                  <TitleView>{subItemData.title}:</TitleView>
                )
              }
              <ul>
                {subItemData.subItems.map(({ title }) => (
                  <li key={title}>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ),
        )}
      </InfoCard>
    );
  }

  return null;
});

export default CarInWorkOverallInfo;
