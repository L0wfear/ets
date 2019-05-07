import * as React from 'react';
import { connect } from 'react-redux';
import { monitorPageToggleStatusShow } from 'components/monitor/redux-main/models/actions-monitor-page';
import { getFrontStatus } from 'components/monitor/layers/car-markers/utils';

import {
  getActiveClassName,
  getClassNameByType,
} from 'components/monitor/tool-bar/car-data/car-legend-status/utils';
import {
  listStatus,
} from 'components/monitor/tool-bar/car-data/car-legend-status/const';

import {
  PropsCarLegendStatus,
} from 'components/monitor/tool-bar/car-data/car-legend-status/CarLegendStatus.h';

const CarLegendStatus: React.FC<PropsCarLegendStatus> = (props) => (
  <span className="car-toolbar">
    <div className="tool_bar-block">
      <div className="default_cube dark">
        <div className={getActiveClassName(props)} onClick={props.toggleActiveStatus}>
          <div>{`Активно: ${listStatus.slice(0, 3).reduce((summ, { key }) => summ + props.carsByStatus[key], 0)}`}</div>
        </div>
        <div className="car_block_legend">
          {
            listStatus.map((oneStatus) => (
              <div key={oneStatus.key} data-type={oneStatus.storeName} onClick={props.toggleShowStatus} className={getClassNameByType(props, oneStatus.key)}>
                <div className={`car_data-color ${oneStatus.key}`}></div>
                <div>{`${oneStatus.title} (${props.carsByStatus[oneStatus.key]})`}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  </span>
);

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
)
(CarLegendStatus);
