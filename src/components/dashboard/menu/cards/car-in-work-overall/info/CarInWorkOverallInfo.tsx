import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  PropsCarInWorkOverallInfo,
} from 'components/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo.h';

const CarInWorkOverallInfo: React.SFC<PropsCarInWorkOverallInfo> = ({ infoData, infoData: { subItems = [] } , ...props }) => (
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.car_in_work_overall.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInCarInWorkOverall(null),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'car_in_work_overall', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CarInWorkOverallInfo);
