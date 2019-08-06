import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import { getMonitorPageState } from 'redux-main/reducers/selectors';

type PropsEventTable = {
  front_events_list: any[],
  handleEventClick: any;
};

class EventTable extends React.Component<PropsEventTable, {}> {
  handleEventClick: any = ({ currentTarget: { dataset: { ievent } } }) => {
    this.props.handleEventClick(this.props.front_events_list[ievent], true);
  }
  render() {
    return (
      <table className="car_info-event_table" id="car_info-event_table">
        <thead>
          <tr>
            <td>Дата и время</td>
            <td>Событие</td>
            <td>Объем, л</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.front_events_list.map((row, indexRow) => (
              <tr key={indexRow} data-ievent={indexRow} onClick={this.handleEventClick}>
                <td>{row.date}</td>
                <td>{row.type_name}</td>
                <td>{row.value}</td>
              </tr>
              ))
          }
        </tbody>
      </table>
    );
  }
}

export default compose(
  withRequirePermissionsNew({
    permissions: 'map.leak_and_refill',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      front_events_list: getMonitorPageState(state).carInfo.trackCaching.front_events_list,
    }),
  ),
)(EventTable);
