import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';


type PropsCarInWorkOverallInfo = {
  infoData: any;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

const CarInWorkOverallInfo: React.SFC<PropsCarInWorkOverallInfo> = ({ infoData, infoData: { subItems = [] } , ...props }) => (
  <InfoCard title={infoData.title} handleClose={props.handleClose}>
    <ul>
      {
        subItems.map(({ title }, index) => (
          <li key={index}>
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