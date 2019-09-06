import * as React from 'react';
import { compose } from 'recompose';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

type OwnProps = CommontTdTiteProps;
type Props = OwnProps & WithSearchProps;

const TrTdButtonShowMissionInfo: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;

    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqValue = rowData[uniqKey] || null;

    const noData = rowData.status === MISSION_STATUS.not_assigned;

    const handleClick = React.useCallback(
      async () => {
        if (!noData) {
          props.setParams(
            {
              [uniqKeyForParams]: uniqValue,
              type: 'info',
            },
          );
        }
      },
      [rowData, noData, uniqKeyForParams, uniqValue],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td alignCenter>
        {
          !noData
            ? (
              <EtsBootstrap.Glyphicon onClick={handleClick} glyph="info-sign" fontSize="32px" color={Number(rowData.current_percentage) < 100 ? UiConstants.colorError : null}/>
            )
            : (
              <span>Нет данных</span>
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
