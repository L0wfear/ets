import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import { dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhNotCoveredByMissionsOfCurrentShiftInfo } from 'components/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/info/OdhNotCoveredByMissionsOfCurrentShiftInfo.h';

const OdhNotCoveredByMissionsOfCurrentShiftInfo: React.SFC<PropsOdhNotCoveredByMissionsOfCurrentShiftInfo> = ({ infoData, ...props }) => (
  <InfoCard title="Список объектов / количество недостающих циклов" handleClose={props.handleClose}>
    <ul>
      {
        infoData.sub_items.map((lineData, index) => (
          <li key={index}>
            <span>{`${lineData.name || '---'} ${(lineData.left_passes || 0)}`}</span>
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
