import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { actionChangeServiceFiles } from 'redux-main/reducers/modules/services/services_actions';
import { FileField } from 'components/old/ui/input/fields';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type TrTdServiceFilesfStateProps = {
  permissions: string | boolean;
};
type TrTdServiceFilesfDispatchProps = {};
type TrTdServiceFilesfOwnProps = {
  registryKey: string;
  rowData: Service;
};
type TrTdServiceFilesfMergedProps = (
  TrTdServiceFilesfStateProps
  & TrTdServiceFilesfDispatchProps
  & TrTdServiceFilesfOwnProps
) & WithSearchProps & {
  isPermitted: boolean;
};

type TrTdServiceFilesfProps = TrTdServiceFilesfMergedProps;

const TrTdServiceFilesf: React.FC<TrTdServiceFilesfProps> = React.memo(
  (props) => {
    const { rowData } = props;
    const dispatch = etsUseDispatch();

    const handleChange = React.useCallback(
      async (files: any[]) => {

        if (props.isPermitted) {
          try {
            await dispatch(
              actionChangeServiceFiles(
                props.rowData.id,
                files,
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
      <EtsTbodyTrTd>
        <FileField
          id="files"
          label={false}
          multiple
          value={props.rowData.files}
          error={false}
          onChange={handleChange}
          disabled={!props.isPermitted}
          withDateTime
          askBefoeRemove
        />
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdServiceFilesfProps, TrTdServiceFilesfOwnProps>(
  connect<TrTdServiceFilesfStateProps, TrTdServiceFilesfDispatchProps, TrTdServiceFilesfOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(TrTdServiceFilesf);
