import * as React from 'react';

import { compose } from 'recompose';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import { dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { PropsOdhNotCoveredByMissionsOfCurrentShiftInfo } from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/info/OdhNotCoveredByMissionsOfCurrentShiftInfo.h';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const OdhNotCoveredByMissionsOfCurrentShiftInfo: React.FC<PropsOdhNotCoveredByMissionsOfCurrentShiftInfo> = ({ infoData, ...props }) => (
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

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'odh_not_covered_by_missions_of_current_shift', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).odh_not_covered_by_missions_of_current_shift.infoData,
    }),
    (dispatch) => ({
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift(null),
        )
      ),
    }),
  ),
)(OdhNotCoveredByMissionsOfCurrentShiftInfo);
