import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import EtsTable from 'components/new/ui/@bootstrap/27-table/EtsTable';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

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
      <EtsTable id="car_info-event_table">
        <EtsThead>
          <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Дата и время</EtsTheadTh>
          <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Событие</EtsTheadTh>
          <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Объем, л</EtsTheadTh>
        </EtsThead>
        <tbody>
          {
            this.props.front_events_list.length
              ? this.props.front_events_list.map((row, indexRow) => (
                <EtsTrTbody borderedTd={true} key={indexRow} data-ievent={indexRow} onClick={this.handleEventClick} registryKey={'car_info-event_table'}>
                  <EtsTbodyTrTd>{row.date}</EtsTbodyTrTd>
                  <EtsTbodyTrTd>{row.type_name}</EtsTbodyTrTd>
                  <EtsTbodyTrTd>{row.value}</EtsTbodyTrTd>
                </EtsTrTbody>
                ))
              : <EtsTrTbody borderedTd={true} registryKey={'car_info-event_table'}>
                  <EtsTbodyTrTd alignCenter={true} colSpan={3}>Нет данных</EtsTbodyTrTd>
                </EtsTrTbody>
          }
        </tbody>
      </EtsTable>
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
