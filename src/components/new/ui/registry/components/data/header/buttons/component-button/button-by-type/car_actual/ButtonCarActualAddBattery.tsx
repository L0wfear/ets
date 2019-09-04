import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type ButtonCreateDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateOwnProps = CommonTypesForButton & {};
type ButtonCreateMergeProps = {};

type ButtonCreateProps = (
  ButtonCreateStateProps
  & ButtonCreateDispatchProps
  & ButtonCreateOwnProps
  & ButtonCreateMergeProps
) & WithSearchProps;

const ButtonCreate: React.FC<ButtonCreateProps> = (props) => {
  const handleClick = React.useCallback(
    () => {
      props.registrySetSelectedRowToShowInForm({});
      props.setParams({
        [props.uniqKeyForParams]: buttonsTypes.create,
      });
    },
    [],
  );

  return (
    <EtsBootstrap.Button id="open-create-form" bsSize="small" onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph="plus" /> Добавить
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateProps, ButtonCreateOwnProps>(
  withSearch,
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonCreateStateProps, ButtonCreateDispatchProps, ButtonCreateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
    }),
    (dispatch: any, { registryKey }) => ({
      registrySetSelectedRowToShowInForm: () => (
        dispatch(
          registrySetSelectedRowToShowInForm(registryKey),
        )
      ),
    }),
  ),
)(ButtonCreate);
