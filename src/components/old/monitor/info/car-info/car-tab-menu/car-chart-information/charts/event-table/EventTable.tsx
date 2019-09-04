import * as React from 'react';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type PropsEventTable = {
  handleEventClick: any;
};

const EventTable: React.FC<PropsEventTable> = React.memo(
  (props) => {
    const front_events_list = etsUseSelector((state) => getMonitorPageState(state).carInfo.trackCaching.front_events_list);

    const handleEventClick = React.useCallback(
      ({ currentTarget: { dataset: { ievent } } }) => {
        props.handleEventClick(front_events_list[ievent], true);
      },
      [props.handleEventClick, front_events_list],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.TableOld id="car_info-event_table">
          <EtsThead>
            <tr>
              <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Дата и время</EtsTheadTh>
              <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Событие</EtsTheadTh>
              <EtsTheadTh width={33} widthUnits={'%'} alignCenter={true}>Объем, л</EtsTheadTh>
            </tr>
          </EtsThead>
          <tbody>
            {
              front_events_list.length
                ? front_events_list.map((row, indexRow) => (
                    <EtsTrTbody enable borderedTd={true} key={indexRow} data-ievent={indexRow} onClick={handleEventClick} registryKey="car_info-event_table">
                      <EtsTbodyTrTd>{row.date}</EtsTbodyTrTd>
                      <EtsTbodyTrTd>{row.type_name}</EtsTbodyTrTd>
                      <EtsTbodyTrTd>{row.value}</EtsTbodyTrTd>
                    </EtsTrTbody>
                  ))
                : (
                  <EtsTrTbody borderedTd={true} registryKey={'car_info-event_table'}>
                    <EtsTbodyTrTd alignCenter={true} colSpan={3}>Нет данных</EtsTbodyTrTd>
                  </EtsTrTbody>
                )
            }
          </tbody>
        </EtsBootstrap.TableOld>
      ),
      [
        front_events_list,
        handleEventClick,
      ],
    );
  },
);

export default withRequirePermissionsNew({
  permissions: 'map.leak_and_refill',
})(EventTable);
