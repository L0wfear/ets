import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { actionServiceAddFiles, actionServiceRemoveFileById } from 'redux-main/reducers/modules/services/services_actions';
import { FileField } from 'components/ui/input/fields';
import { get } from 'lodash';

type TrTdServiceFilesfStateProps = {
  permissions: string | boolean;
};
type TrTdServiceFilesfDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionServiceAddFiles: HandleThunkActionCreator<typeof actionServiceAddFiles>;
  actionServiceRemoveFileById: HandleThunkActionCreator<typeof actionServiceRemoveFileById>;
};
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

    const handleChange = React.useCallback(
      async (files: any[]) => {

        if (props.isPermitted) {
          const files_old = get(props.rowData, 'files', []);

          if (files.length > files_old.length) {
            await props.actionServiceAddFiles(
              props.rowData.id,
              files.map((fileData) => ({
                ...fileData,
                kind: 'specification',
              })),
              {
                page: props.registryKey,
              },
            );
          } else {
            const file: any = get(files_old.filter(({ id }) => !files.find((fileData) => fileData.id === id)), '0', null);

            if (file) {
              await props.actionServiceRemoveFileById(
                props.rowData.id,
                file.id,
                {
                  page: props.registryKey,
                },
              );
            }
          }
          props.registryLoadDataByKey(props.registryKey);
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
    (dispatch: any) => ({
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionServiceAddFiles: (...arg) => (
        dispatch(
          actionServiceAddFiles(...arg),
        )
      ),
      actionServiceRemoveFileById: (...arg) => (
        dispatch(
          actionServiceRemoveFileById(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(TrTdServiceFilesf);
