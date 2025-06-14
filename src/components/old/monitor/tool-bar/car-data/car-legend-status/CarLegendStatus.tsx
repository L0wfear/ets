import * as React from 'react';
import { connect } from 'react-redux';
import { monitorPageToggleStatusShow } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { getFrontStatus } from 'components/old/monitor/layers/car-markers/utils';

import styled from 'styled-components';

const ActiveItemText = styled.div`
  margin-left: 5px!important;
`;

import {
  getActiveClassName,
  getClassNameByType,
} from 'components/old/monitor/tool-bar/car-data/car-legend-status/utils';
import {
  listStatus,
} from 'components/old/monitor/tool-bar/car-data/car-legend-status/const';

import {
  PropsCarLegendStatus,
} from 'components/old/monitor/tool-bar/car-data/car-legend-status/CarLegendStatus.h';
import { NotInMapItem } from './NotInMapItem';

const CarLegendStatus: React.FC<PropsCarLegendStatus> = (props) => {
  
  return (<span className="car-toolbar">
    <div className="tool_bar-block">
      <div className="default_cube">
        <ActiveItemText className={getActiveClassName(props)} onClick={props.toggleActiveStatus}>
          <div>{`Активно: ${listStatus.slice(0, 3).reduce((summ, { key }) => summ + props.carsByStatus[key], 0)}`}</div>
        </ActiveItemText>
        <div className="car_block_legend">
          {listStatus.map((oneStatus) => (<div key={oneStatus.key} data-type={oneStatus.storeName} onClick={props.toggleShowStatus} className={getClassNameByType(props, oneStatus.key)}>
            <div className={`car_data-color ${oneStatus.key}`}></div>
            <div>{`${oneStatus.title} (${props.carsByStatus[oneStatus.key]})`}</div>
          </div>))}
          <NotInMapItem />
        </div>
      </div>
    </div>
  </span>);
};

const mapStateToProps = (state) => ({
  statusTC: state.monitorPage.carInfo.status,
  carsByStatus: state.monitorPage.carsByStatus,
  ...state.monitorPage.status,
});

const mapDispatchToProps = (dispatch) => ({
  toggleShowStatus: ({ currentTarget: { dataset: { type } } }) => (
    dispatch(
      monitorPageToggleStatusShow([type]),
    )
  ),
  dispatch,
});

const mergeProps = ({ statusTC, carsByStatus, ...stateProps}, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  carsByStatus: Object.entries(carsByStatus).reduce((newObj, [key, count]) => ({
    ...newObj,
    [key]: stateProps[key] ? count : statusTC && getFrontStatus(statusTC).slug === key ? 1 : 0,
  }), {}),
  toggleActiveStatus: () => {
    const activeStatus = listStatus.slice(0, 3).map(({ storeName }) => storeName);

    const isNotActiveList = activeStatus.filter((storeName) => !stateProps[storeName]);

    if (isNotActiveList.length) {
      dispatchProps.dispatch(
        monitorPageToggleStatusShow(isNotActiveList),
      );
    } else {
      dispatchProps.dispatch(
        monitorPageToggleStatusShow(activeStatus),
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CarLegendStatus);
