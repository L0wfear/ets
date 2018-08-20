import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { monitorPageToggleStatusShow } from 'components/monitor/new/redux/models/actions-monitor-page';
import { getFrontStatus } from 'components/map/new/layers/car-markers/utils';
import CarFilters from 'components/monitor/new/tool-bar/car-data/car-filters/CarFilters';

const listStatus = [
  {
    key: 'in_move',
    status: 1,
    title: 'В движении:',
    storeName: 'SHOW_CAR_IN_MOVE',
  },
  {
    key: 'stop',
    status: 2,
    title: 'Остановка:',
    storeName: 'SHOW_CAR_STOP',
  },
  {
    key: 'parking',
    status: 3,
    title: 'Стоянка:',
    storeName: 'SHOW_CAR_PARKING',
  },
  {
    key: 'not_in_touch',
    status: 4,
    title: 'Не на связи:',
    storeName: 'SHOW_CAR_NOT_IN_TOUCH',
  },
];

const getActiveClassName = (props) => (
  cx(
    'legen_option',
    'car_legend-active',
    {
      off: !props.SHOW_CAR_IN_MOVE && !props.SHOW_CAR_STOP && !props.SHOW_CAR_PARKING,
    }
  )
);

const getClassNameByType = (props, type) => {
  return (
  cx(
    'legen_option',
    {
      off: !props[type],
    }
  )
)
}

class BarCarData extends React.Component<any, any> {
  render() {
    return (
      <span className="car-toolbar">
        <div className="tool_bar-block">
          <div className="default_cube">
            <div className={getActiveClassName(this.props)} onClick={this.props.toggleActiveStatus}>
              <div>{`Активно: ${listStatus.slice(0,3).reduce((summ, { key }) => summ + this.props[key], 0)}`}</div>
            </div>
            <div className="car_block_legend">
              {
                listStatus.map((oneStatus) => (
                  <div key={oneStatus.key} data-type={oneStatus.storeName} onClick={this.props.toggleShowStatus} className={getClassNameByType(this.props, oneStatus.storeName)}>
                    <div className={`car_data-color ${oneStatus.key}`}></div>
                    <div>{`${oneStatus.title} (${this.props[oneStatus.key]})`}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <CarFilters />
      </span>
    );
  }
}

const mapStateToProps = state => ({
  statusTC: state.monitorPage.carInfo.status,
  carsByStatus: state.monitorPage.carsByStatus,
  SHOW_CAR_IN_MOVE: state.monitorPage.status.SHOW_CAR_IN_MOVE,
  SHOW_CAR_STOP: state.monitorPage.status.SHOW_CAR_STOP,
  SHOW_CAR_PARKING: state.monitorPage.status.SHOW_CAR_PARKING,
  SHOW_CAR_NOT_IN_TOUCH: state.monitorPage.status.SHOW_CAR_NOT_IN_TOUCH,
});

const mapDispatchToProps = dispatch => ({
  toggleShowStatus: ({ currentTarget: { dataset: { type } } }) => (
    dispatch(
      monitorPageToggleStatusShow([type]),
    )
  ),
  dispatch,
});

const mergeProps = ({ statusTC, ...stateProps}, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  ...Object.entries(stateProps.carsByStatus).reduce((newObj, [key, count]) => ({
    ...newObj,
    [key]: stateProps[`SHOW_CAR_${key.toUpperCase()}`] ? count : getFrontStatus(statusTC).slug === key ? 1 : 0,
  }), {}),
  toggleActiveStatus: () => {
    const activeStatus = listStatus.slice(0,3).map(({ storeName }) => storeName);

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
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)
(BarCarData);
