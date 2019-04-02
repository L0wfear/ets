import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import missionPermissions from 'components/missions/mission/config-data/permissions';
import { get } from 'lodash';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';

type ButtonCloseEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCloseEdcRequestDispatchProps = {
  actionCloseEdcRequestById: HandleThunkActionCreator<typeof edcRequestActions.actionCloseEdcRequestById>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonCloseEdcRequestOwnProps = {
  registryKey: string;
};
type ButtonCloseEdcRequestMergeProps = {};

type ButtonCloseEdcRequestProps = (
  ButtonCloseEdcRequestStateProps
  & ButtonCloseEdcRequestDispatchProps
  & ButtonCloseEdcRequestOwnProps
  & ButtonCloseEdcRequestMergeProps
);

const ButtonCloseEdcRequest: React.FC<ButtonCloseEdcRequestProps> = (props) => {
  const handleClick = React.useCallback(
    async () => {
      const id = get(props.selectedRow, props.uniqKey, null);

      if (id) {
        try {
          await props.actionCloseEdcRequestById(
            id,
            { page: props.registryKey },
          );
        } catch (error) {
          console.error(error); // tslint:disable-line
          return;
        }

        props.registryLoadDataByKey(props.registryKey);
      }
    },
    [props.selectedRow],
  );

  const can_resolved = get(props.selectedRow, 'can_resolved', false);

  return (
    <Button id="open-cancel_edc_close--form" bsSize="small" onClick={handleClick} disabled={!can_resolved}>
      Решена
    </Button>
  );
};

export default compose<ButtonCloseEdcRequestProps, ButtonCloseEdcRequestOwnProps>(
  withRequirePermissionsNew({
    permissions: missionPermissions.update,
  }),
  connect<ButtonCloseEdcRequestStateProps, ButtonCloseEdcRequestDispatchProps, ButtonCloseEdcRequestOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any) => ({
      actionCloseEdcRequestById: (...arg) => (
        dispatch(
          edcRequestActions.actionCloseEdcRequestById(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(
            ...arg,
          ),
        )
      ),
    }),
  ),
)(ButtonCloseEdcRequest);
