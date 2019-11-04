import * as React from 'react';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  handleEventClick: any;
} & WithRequirePermissionProps;

type Props = OwnProps & WithRequirePermissionAddProps;

const EventTable: React.FC<Props> = React.memo(
  (props) => {
    const front_events_list = etsUseSelector((state) => getMonitorPageState(state).carInfo.trackCaching.front_events_list);

    const handleEventClick = React.useCallback(
      ({ currentTarget: { dataset: { ievent } } }) => {
        props.handleEventClick(front_events_list[ievent], true);
      },
      [props.handleEventClick, front_events_list],
    );

    return (
      <EtsBootstrap.TableOld id="car_info-event_table">
        <EtsBootstrap.Grid.GridBootstrapThead.Thead>
          <EtsBootstrap.Grid.GridBootstrapThead.Tr>
            <EtsBootstrap.Grid.GridBootstrapThead.Th width={33} widthUnits={'%'} alignCenter={true}>Дата и время</EtsBootstrap.Grid.GridBootstrapThead.Th>
            <EtsBootstrap.Grid.GridBootstrapThead.Th width={33} widthUnits={'%'} alignCenter={true}>Событие</EtsBootstrap.Grid.GridBootstrapThead.Th>
            <EtsBootstrap.Grid.GridBootstrapThead.Th width={33} widthUnits={'%'} alignCenter={true}>Объем, л</EtsBootstrap.Grid.GridBootstrapThead.Th>
          </EtsBootstrap.Grid.GridBootstrapThead.Tr>
        </EtsBootstrap.Grid.GridBootstrapThead.Thead>
        <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
          {
            front_events_list.length
              ? front_events_list.map((row, indexRow) => (
                <EtsBootstrap.Grid.GridBootstrapTbody.Tr enable borderedTd={true} key={indexRow} data-ievent={indexRow} onClick={handleEventClick} registryKey="car_info-event_table">
                  <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.date}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                  <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.type_name}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                  <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.value}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
              ))
              : (
                <EtsBootstrap.Grid.GridBootstrapTbody.Tr borderedTd={true} registryKey={'car_info-event_table'}>
                  <EtsBootstrap.Grid.GridBootstrapTbody.Td alignCenter={true} colSpan={3}>Нет данных</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
              )
          }
        </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
      </EtsBootstrap.TableOld>
    );
  },
);

export default withRequirePermission<OwnProps>({
  permissions: 'map.leak_and_refill',
})(EventTable);
