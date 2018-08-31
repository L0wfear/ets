import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';


type PropsOdhNotCoveredByMissionsOfCurrentShiftInfo = {
  infoData: any;
  gotoRoute: any;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

const OdhNotCoveredByMissionsOfCurrentShiftInfo: React.SFC<PropsOdhNotCoveredByMissionsOfCurrentShiftInfo> = ({ infoData, ...props }) => (
  <InfoCard title="Карточка задания" handleClose={props.handleClose}>
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
  infoData: state.dashboard.odh_not_covered_by_missions_of_current_shift.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift(null),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'odh_not_covered_by_missions_of_current_shift', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OdhNotCoveredByMissionsOfCurrentShiftInfo);