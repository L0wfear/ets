import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { techInspectionArchivePermissions } from 'components/new/pages/nsi/autobase/pages/tech_inspection_archive/_config-data/permissions';
import { actionUnselectSelectedRowToShow, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { actionTechInspectionFromArchive } from 'redux-main/reducers/modules/autobase/tech_inspection_archive/actions-tech_inspection_archive';

type OwpProps = CommonTypesForButton & WithRequirePermissionProps & {};
type Props = OwpProps & WithRequirePermissionAddProps & {};

const ButtonTechInspectionFromArchive: React.FC<Props> = React.memo(
  (props) => {
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const dispatch = etsUseDispatch();
    const handleSubmit = React.useCallback(
      async () => {

        try {
          await global.confirmDialog({
            title: 'Внимание',
            body: 'Вы уверены, что хотите перенести из архива выбранную запись о техосмотре?',
            okName: 'Перенести'
          });
        } catch {
          return;
        }

        await dispatch(actionTechInspectionFromArchive(selectedRow[uniqKey], { page: props.registryKey }));

        global.NOTIFICATION_SYSTEM.notify('Выбранная карта техосмотра перенесена из архива');

        dispatch(actionUnselectSelectedRowToShow(props.registryKey, true));
        dispatch(registryLoadDataByKey(props.registryKey));
      },
      [selectedRow, uniqKey],
    );

    const disabled = !selectedRow;

    return (
      <EtsBootstrap.Button id="tech_inspection-from-archive" bsSize="small" onClick={handleSubmit} disabled={disabled}>
        Перенести из архива
      </EtsBootstrap.Button>
    );
  },
);

export default withRequirePermission<OwpProps>({
  permissions: techInspectionArchivePermissions.update,
})(ButtonTechInspectionFromArchive);
