import * as React from 'react';

import { compose } from 'recompose';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  PropsCarInWorkOverallInfo,
} from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo.h';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const CarInWorkOverallInfo: React.FC<PropsCarInWorkOverallInfo> = ({ infoData, infoData: { subItems = [] } , ...props }) => (
  <InfoCard title={infoData.title} handleClose={props.handleClose}>
    <ul>
      {
        subItems.map(({ title }) => (
          <li key={title}>
            <span>{title}</span>
          </li>
        ))
      }
    </ul>
  </InfoCard>
);

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'car_in_work_overall', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).car_in_work_overall.infoData,
    }),
    (dispatch: any) => ({
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(null),
        )
      ),
    }),
  ),
)(CarInWorkOverallInfo);
