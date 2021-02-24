import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { 
  withRequirePermission, 
  WithRequirePermissionAddProps, 
  WithRequirePermissionProps 
} from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { actionInsurancePolicyFromArchive } from 'redux-main/reducers/modules/autobase/insurance_policy/actions-insurance_policy';
import { insurancePolicyArchivePermissions } from 'components/new/pages/nsi/autobase/pages/insurance_policy_archive/_config-data/permissions';

type OwpProps = CommonTypesForButton & WithRequirePermissionProps & {};
type Props = OwpProps & WithRequirePermissionAddProps & {};

const ButtonInsurancePolicyFromArchive: React.FC<Props> = React.memo(
  (props) => {
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const dispatch = etsUseDispatch();
    const handleSubmit = React.useCallback(
      async () => {

        try {
          await global.confirmDialog({
            title: 'Внимание',
            body: 'Вы уверены, что хотите перенести из архива выбранную страховку?',
          });
        } catch {
          return;
        }

        await dispatch(actionInsurancePolicyFromArchive(selectedRow[uniqKey], { page: props.registryKey }));

        global.NOTIFICATION_SYSTEM.notify('Выбранная страховка перенесена из архива');

        dispatch(actionUnselectSelectedRowToShow(props.registryKey, true));
        dispatch(registryLoadDataByKey(props.registryKey));
      },
      [selectedRow, uniqKey],
    );

    const disabled = !selectedRow;

    return (
      <EtsBootstrap.Button id="insurance_policy-from-archive" bsSize="small" onClick={handleSubmit} disabled={disabled}>
        Перенести из архива
      </EtsBootstrap.Button>
    );
  },
);

export default withRequirePermission<OwpProps>({
  permissions: insurancePolicyArchivePermissions.update,
})(ButtonInsurancePolicyFromArchive);
