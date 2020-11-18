import * as React from 'react';
import { compose } from 'recompose';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { useHistory } from 'react-router-dom';

type OwnProps = CommontTdTiteProps;
type Props = OwnProps & WithSearchProps;

const TrTdButtonShowMissionInfo: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const isClosed = rowData.status === 'closed';
    const isActive = rowData.status === 'active';
    const showIcon = isClosed || isActive;
    const date_end = isClosed ? rowData.fact_arrival_date : rowData.plan_arrival_date;
    const date_start = isClosed ? rowData.fact_departure_date : rowData.plan_departure_date;
    const history = useHistory();

    const handleClick = React.useCallback(
      () => {
        history.push(`/monitor/${rowData.gov_number}?date_end=${date_end}&date_start=${date_start}`);
        
      },
      [],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td alignCenter id={props.id}>
        {
          showIcon
            ? (
              <EtsBootstrap.Glyphicon onClick={handleClick} glyph="info-sign" fontSize="32px" />
            )
            : (
              <span>-</span>
            )
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default compose<Props, OwnProps>(
  withRequirePermission({
    permissions: missionPermissions.read,
  }),
  withSearch,
)(TrTdButtonShowMissionInfo);
