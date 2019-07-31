import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { registryLoadDataByKey, registrySetSelectedRowToShowInForm, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type TrTdButtonCloneTireStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  permissions: string | boolean;
};
type TrTdButtonCloneTireDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
  autobaseCloneTire: HandleThunkActionCreator<typeof autobaseActions.autobaseCloneTire>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type TrTdButtonCloneTireOwnProps = {
  registryKey: string;
  rowData: Tire;
};
type TrTdButtonCloneTireMergedProps = (
  TrTdButtonCloneTireStateProps
  & TrTdButtonCloneTireDispatchProps
  & TrTdButtonCloneTireOwnProps
) & WithSearchProps;

type TrTdButtonCloneTireProps = TrTdButtonCloneTireMergedProps;

const TrTdButtonCloneTire: React.FC<TrTdButtonCloneTireProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClick = React.useCallback(
      async () => {
        try {
          await props.autobaseCloneTire(rowData.id, { page: props.registryKey });
          global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
        } catch (error) {
          //
        }

        props.actionUnselectSelectedRowToShow(props.registryKey, true);
        await props.registryLoadDataByKey(props.registryKey);
      },
      [rowData.id],
    );

    return (
      <EtsTbodyTrTd>
        <EtsBootstrap.Button block onClick={handleClick}>Создать копированием</EtsBootstrap.Button>
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdButtonCloneTireProps, TrTdButtonCloneTireOwnProps>(
  connect<TrTdButtonCloneTireStateProps, TrTdButtonCloneTireDispatchProps, TrTdButtonCloneTireOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      autobaseCloneTire: (...arg) => (
        dispatch(
          autobaseActions.autobaseCloneTire(...arg),
        )
      ),
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(TrTdButtonCloneTire);
