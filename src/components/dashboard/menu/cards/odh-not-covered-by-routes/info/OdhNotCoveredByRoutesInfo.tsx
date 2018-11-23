import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { LinkToRouteListPermitted } from 'components/route_new/buttons/buttons';
import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhNotCoveredByRoutesInfo } from 'components/dashboard/menu/cards/odh-not-covered-by-routes/info/OdhNotCoveredByRoutesInfo.h';
import { RightButtonBlockContainer } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

const OdhNotCoveredByRoutesInfo: React.SFC<PropsOdhNotCoveredByRoutesInfo> = ({ infoData, ...props }) => (
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
        <Button>Перейти к маршрутам</Button>
      </LinkToRouteListPermitted>
    </RightButtonBlockContainer>
  </InfoCard>
);

const mapStateToProps = (state, { history }) => ({
  infoData: state.dashboard.odh_not_covered_by_routes.infoData,
  gotoRoute: () => (
    history.pushState(null, `/routes-list/?technical_operation_id=${state.dashboard.odh_not_covered_by_missions_of_current_shift.infoData.technical_operation_id}`)
  ),
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInOdhNotCoveredByRoutes(null),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'odh_not_covered_by_routes', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OdhNotCoveredByRoutesInfo);
