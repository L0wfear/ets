import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { Button } from 'react-bootstrap';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { registryLoadDataByKey, registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type TrTdButtonCloneTireStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  permissions: string | boolean;
};
type TrTdButtonCloneTireDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
  autobaseCloneTire: HandleThunkActionCreator<typeof autobaseActions.autobaseCloneTire>;
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
        let response = null;
        try {
          response = await props.autobaseCloneTire(rowData.id, { page: props.registryKey });
          global.NOTIFICATION_SYSTEM.notify('Запись успешно добавлена', 'success');
        } catch (error) {
          return;
        }

        if (response) {
          props.setParams({
            [props.uniqKeyForParams]: get(response, props.uniqKey, null),
          });
        }
        props.registrySetSelectedRowToShowInForm(props.registryKey);
        props.registryLoadDataByKey(props.registryKey);
      },
      [rowData.id],
    );

    return (
      <EtsTbodyTrTd>
        <Button block onClick={handleClick}>Создать копированием</Button>
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
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(TrTdButtonCloneTire);
