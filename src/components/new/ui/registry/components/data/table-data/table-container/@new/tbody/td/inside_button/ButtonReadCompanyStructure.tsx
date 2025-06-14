import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ButtonReadCompanyStructureStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  permissions: OneRegistryData['list']['permissions']['update'];
};
type ButtonReadCompanyStructureDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonReadCompanyStructureOwnProps = {
  registryKey: string;
  rowData: CompanyStructure;
};
type ButtonReadCompanyStructureMergedProps = (
  ButtonReadCompanyStructureStateProps
  & ButtonReadCompanyStructureDispatchProps
  & ButtonReadCompanyStructureOwnProps
) & WithSearchProps;

type ButtonReadCompanyStructureProps = ButtonReadCompanyStructureMergedProps;

const ButtonReadCompanyStructure: React.FC<ButtonReadCompanyStructureProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClickOnRead = React.useCallback(
      async (e) => {
        e.stopPropagation();
        props.setParams({
          [props.uniqKeyForParams]: get(props.rowData, props.uniqKey, null),
        });
      },
      [rowData.id],
    );

    return (
      <EtsBootstrap.Button onClick={handleClickOnRead}>Редактировать</EtsBootstrap.Button>
    );
  },
);

export default compose<ButtonReadCompanyStructureProps, ButtonReadCompanyStructureOwnProps>(
  connect<ButtonReadCompanyStructureStateProps, ButtonReadCompanyStructureDispatchProps, ButtonReadCompanyStructureOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
    }),
  ),
  withRequirePermission(),
  withSearch,
)(ButtonReadCompanyStructure);
