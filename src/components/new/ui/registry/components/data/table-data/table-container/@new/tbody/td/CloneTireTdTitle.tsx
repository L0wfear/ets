import * as React from 'react';
import { compose } from 'recompose';

import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import tirePermissions from 'components/new/pages/nsi/autobase/pages/tire/_config-data/permissions';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { autobaseCloneTire } from 'redux-main/reducers/modules/autobase/actions_by_type/tire/actions';

type OwpProps = CommontTdTiteProps;

type Props = OwpProps & WithSearchProps;

const CloneTireTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;

    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      async () => {
        try {
          await dispatch(
            autobaseCloneTire(rowData.id, { page: props.registryKey }),
          );
          global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
        } catch (error) {
          //
        }

        dispatch(
          actionUnselectSelectedRowToShow(props.registryKey, true),
        );
        await dispatch(
          registryLoadDataByKey(props.registryKey),
        );
      },
      [rowData.id],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        <EtsBootstrap.Button block onClick={handleClick}>Создать копированием</EtsBootstrap.Button>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default compose<Props, OwpProps>(
  withRequirePermission({
    permissions: tirePermissions.create,
  }),
  withSearch,
)(CloneTireTdTitle);
