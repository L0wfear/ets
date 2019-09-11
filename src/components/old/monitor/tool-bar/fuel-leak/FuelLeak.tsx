import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { monitorPageChangeFuelEventsDate, monitorPageToggleFuelEvetnsLeakShow } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { loadFuelEvents } from 'redux-main/trash-actions/geometry/geometry';
import { compose } from 'recompose';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

import {
  MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_DATA,
} from 'components/old/monitor/redux-main/models/monitor-page';

import { diffDates } from 'components/@next/@utils/dates/dates';

import ExtField from 'components/@next/@ui/renderFields/Field';

const getActiveClassName = (activeMain) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !activeMain,
    },
  )
);

class BarShowGeoobjects extends React.Component<any, any> {
  state = {
    isOpen: false,
  };

  componentDidUpdate() {
    if (this.props.show) {
      this.props.loadFuelLeakEvents(this.props);
    }
  }

  toggleShow = (event) => {
    let { show } = this.props;

    show = !show;

    if (show) {
      if (!this.state.isOpen) {
        this.setState({ isOpen: true });
      }
    } else {
      if (this.state.isOpen) {
        this.setState({ isOpen: false });
      }
    }

    this.props.monitorPageToggleFuelEvetnsLeakShow();
    event.stopPropagation();
  }

  toggleIsOpen = () => {
    const isOpen = !this.state.isOpen;

    this.setState({
      isOpen,
    });
  }

  handleChange = (field, date) => {
    const changedDates = {
      date_to: this.props.date_to,
      date_from: this.props.date_from,
      [field]: date,
    };

    if (diffDates(changedDates.date_to, changedDates.date_from) < 0) {
      global.NOTIFICATION_SYSTEM.notify('Дата "С" не должна быть позже даты "По"', 'warning', 'tr');
      return;
    }

    this.props.changeFuelEventDate(field, date);
  }

  render() {
    const {
      show,
    } = this.props;
    const {
      isOpen,
    } = this.state;

    return (
      <span>
        <div className="tool_bar-block">
          <div className="default_cube">
            <div className={getActiveClassName(show)} onClick={this.toggleIsOpen}>
              <input type="checkbox" checked={show} readOnly onClick={this.toggleShow} />
              <span>{`Сливы ${isOpen ? ' \u25BC' : ' \u25BA'}`}</span>
            </div>
            {
              isOpen && (
                <div className="car_block_legend left fuel_leak">
                  <div>
                    <span>C </span>
                    <ExtField
                      type="date"
                      label={false}
                      date={this.props.date_from}
                      boundKeys="date_from"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div>
                    <span>По </span>
                    <ExtField
                      type="date"
                      label={false}
                      date={this.props.date_to}
                      boundKeys="date_to"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  show: state.monitorPage.fuelEvents.leak.show,
  date_from: state.monitorPage.fuelEvents.leak.date_from,
  date_to: state.monitorPage.fuelEvents.leak.date_to,
});

const mapDispatchToProps = (dispatch) => ({
  loadFuelLeakEvents: (dates) => (
    dispatch(
      loadFuelEvents(
        MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_DATA,
        'leak',
        dates,
      ),
    )
  ),
  changeFuelEventDate: (field, date) => (
    dispatch(
      monitorPageChangeFuelEventsDate(
        'leak',
        field,
        date,
      ),
    )
  ),
  monitorPageToggleFuelEvetnsLeakShow: () => (
    dispatch(
      monitorPageToggleFuelEvetnsLeakShow(),
    )
  ),
});

export default compose(
  withRequirePermission({
    permissions: 'map.leak_and_refill',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(BarShowGeoobjects);
