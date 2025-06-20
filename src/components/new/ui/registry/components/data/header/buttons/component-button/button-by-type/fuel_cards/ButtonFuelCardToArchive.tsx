import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import fuelCardsPermissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { actionFuelCardToArchive } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';

type OwpProps = CommonTypesForButton & WithRequirePermissionProps & {};
type Props = OwpProps & WithRequirePermissionAddProps & {};

const ButtonFuelCardToArchive: React.FC<Props> = React.memo(
  (props) => {
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const dispatch = etsUseDispatch();
    const handleSubmit = React.useCallback(
      async () => {

        try {
          await global.confirmDialog({
            title: 'Внимание',
            body: 'Вы уверены, что хотите перенести в архив выбранную топливную карту?',
          });
        } catch {
          return;
        }

        await dispatch(actionFuelCardToArchive(selectedRow[uniqKey], { page: props.registryKey }));

        global.NOTIFICATION_SYSTEM.notify('Выбранная топливная карта перенесена в архив');

        dispatch(actionUnselectSelectedRowToShow(props.registryKey, true));
        dispatch(registryLoadDataByKey(props.registryKey));
      },
      [selectedRow, uniqKey],
    );

    const disabled = !selectedRow;

    return (
      <EtsBootstrap.Button id="fuel_card-to-archive" bsSize="small" onClick={handleSubmit} disabled={disabled}>
        В архив
      </EtsBootstrap.Button>
    );
  },
);

export default withRequirePermission<OwpProps>({
  permissions: fuelCardsPermissions.update,
})(ButtonFuelCardToArchive);
