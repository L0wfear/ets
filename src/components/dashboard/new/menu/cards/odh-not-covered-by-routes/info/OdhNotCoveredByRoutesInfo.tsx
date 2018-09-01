import * as React from 'react';
import { Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';


type PropsOdhNotCoveredByRoutesInfo = {
  infoData: any;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
  gotoRoute: any;
}

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
    <div className="right_button_block">
      <Button onClick={props.gotoRoute}>Перейти к маршрутам</Button>
    </div>
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