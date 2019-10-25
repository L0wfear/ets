import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { LinkToRouteListPermitted } from 'components/new/pages/routes_list/buttons/buttons';
import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhNotCoveredByRoutesInfo } from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-routes/info/OdhNotCoveredByRoutesInfo.h';
import { RightButtonBlockContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

class OdhNotCoveredByRoutesInfo extends React.PureComponent<PropsOdhNotCoveredByRoutesInfo, {}> {
  render() {
    const { infoData, ...props } = this.props;

    return (
      <InfoCard title="Список объектов" handleClose={props.handleClose}>
        <ul>
          {
            infoData.subItems.map((title, index) => (
              <li key={index}>
                <span>{title}</span>
              </li>
            ))
          }
        </ul>
        <RightButtonBlockContainer>
          <LinkToRouteListPermitted to={`/routes-list/?technical_operation_id=${infoData.technical_operation_id}`}>
            <EtsBootstrap.Button>Перейти к маршрутам</EtsBootstrap.Button>
          </LinkToRouteListPermitted>
        </RightButtonBlockContainer>
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'odh_not_covered_by_routes', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).odh_not_covered_by_routes.infoData,
    }),
    (dispatch) => ({
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInOdhNotCoveredByRoutes(null),
        )
      ),
    }),
  ),
)(OdhNotCoveredByRoutesInfo);
