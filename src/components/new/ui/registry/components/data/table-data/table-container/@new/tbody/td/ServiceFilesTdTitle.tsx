import * as React from 'react';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { actionChangeServiceFiles } from 'redux-main/reducers/modules/services/services_actions';
import { FileField } from 'components/old/ui/input/fields';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import servicesPermissions from 'components/new/pages/administration/services/_config-data/permissions';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = CommontTdTiteProps & WithRequirePermissionProps;
type Props = OwnProps & WithRequirePermissionAddProps;

const ServiceFilesTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const dispatch = etsUseDispatch();

    const handleChange = React.useCallback(
      async (key, files: any[]) => {

        if (props.isPermitted) {
          try {
            await dispatch(
              actionChangeServiceFiles(
                props.rowData.id,
                files.map(
                  (file) => {
                    file.kind = 'specification';

                    return file;
                  },
                ),
                {
                  page: props.registryKey,
                },
              ),
            );
          } catch (error) {
            //
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
        <FileField
          id="files"
          label={false}
          multiple
          value={props.rowData.files}
          error={false}
          onChange={handleChange}
          disabled={!props.isPermitted}
          boundKeys="files"
          withDateTime
          askBefoeRemove
        />
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default withRequirePermission<OwnProps>({
  permissions: servicesPermissions.update,
  withIsPermittedProps: true,
})(ServiceFilesTdTitle);
