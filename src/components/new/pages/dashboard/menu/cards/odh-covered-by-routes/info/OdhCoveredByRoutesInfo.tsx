import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhCoveredByRoutes,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhCoveredByRoutesInfo } from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/info/OdhCoveredByRoutesInfo.h';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const OdhCoveredByRoutesInfo: React.FC<PropsOdhCoveredByRoutesInfo> = ({ infoData, ...props }) => (
  <InfoCard title={infoData.title} handleClose={props.handleClose}>
    <ul>
      {
        infoData.subItems.map((title, index) => (
          <li key={index}>
            <span>{title}</span>
          </li>
        ))
      }
    </ul>
  </InfoCard>
);

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'odh_covered_by_routes', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).odh_covered_by_routes.infoData,
    }),
    (dispatch) => ({
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInOdhCoveredByRoutes(null),
        )
      ),
    }),
  ),
)(OdhCoveredByRoutesInfo);
