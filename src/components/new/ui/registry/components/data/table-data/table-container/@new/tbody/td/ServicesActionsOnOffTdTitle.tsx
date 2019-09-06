import * as React from 'react';

import { ButtonGreenActive, ButtonRedActive } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/buttons';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { ButtonGroupWrapperMargin } from 'global-styled/global-styled';
import { actionChangeServiceActiveStatus } from 'redux-main/reducers/modules/services/services_actions';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import servicesPermissions from 'components/new/pages/administration/services/_config-data/permissions';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = CommontTdTiteProps & WithRequirePermissionProps;
type Props = OwnProps & WithRequirePermissionAddProps;

const ServicesActionsOnOffTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const dispatch = etsUseDispatch();

    const handleClickOn = React.useCallback(
      async () => {
        if (!props.rowData.is_active && props.isPermitted) {
          try {
            await dispatch(
              actionChangeServiceActiveStatus(
                props.rowData.slug,
                true,
                {
                  page: props.registryKey,
                },
              ),
            );
          } catch (error) {
            console.error('error'); // tslint:disable-line
          }

          dispatch(
            registryLoadDataByKey(props.registryKey),
          );
        }
      },
      [rowData, props.isPermitted],
    );
    const handleClickOff = React.useCallback(
      async () => {
        if (props.rowData.is_active && props.isPermitted) {
          try {
            await dispatch(
              actionChangeServiceActiveStatus(
                props.rowData.slug,
                false,
                {
                  page: props.registryKey,
                },
              ),
            );
          } catch (error) {
            console.error('error'); // tslint:disable-line
          }
          dispatch(
            registryLoadDataByKey(props.registryKey),
          );
        }
      },
      [rowData, props.isPermitted],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        <ButtonGroupWrapperMargin>
          <ButtonGreenActive active={props.rowData.is_active} onClick={handleClickOn}>Вкл</ButtonGreenActive>
          <ButtonRedActive active={!props.rowData.is_active} onClick={handleClickOff}>Выкл</ButtonRedActive>
        </ButtonGroupWrapperMargin>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default withRequirePermission<OwnProps>({
  permissions: servicesPermissions.update,
  withIsPermittedProps: true,
})(ServicesActionsOnOffTdTitle);
