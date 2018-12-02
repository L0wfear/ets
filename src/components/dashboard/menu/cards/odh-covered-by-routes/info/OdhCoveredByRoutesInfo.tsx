import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhCoveredByRoutes,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhCoveredByRoutesInfo } from 'components/dashboard/menu/cards/odh-covered-by-routes/info/OdhCoveredByRoutesInfo.h';

const OdhCoveredByRoutesInfo: React.SFC<PropsOdhCoveredByRoutesInfo> = ({ infoData, ...props }) => (
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.odh_covered_by_routes.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInOdhCoveredByRoutes(null),
    )
  ),
});

export default compose(
  withShowByProps({
    path: ['dashboard', 'odh_covered_by_routes', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OdhCoveredByRoutesInfo);
