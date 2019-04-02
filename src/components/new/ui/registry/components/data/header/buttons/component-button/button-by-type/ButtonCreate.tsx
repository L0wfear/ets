import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type ButtonCreateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type ButtonCreateDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateOwnProps = {
  registryKey: string;
};
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
    <Button id="open-create-form" bsSize="small" onClick={handleClick}>
      <Glyphicon glyph="plus" /> Создать
    </Button>
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
