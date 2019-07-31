import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type ButtonCreateCompanyStructureStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type ButtonCreateCompanyStructureDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateCompanyStructureOwnProps = {
  registryKey: string;
};
type ButtonCreateCompanyStructureMergeProps = {};

type ButtonCreateCompanyStructureProps = (
  ButtonCreateCompanyStructureStateProps
  & ButtonCreateCompanyStructureDispatchProps
  & ButtonCreateCompanyStructureOwnProps
  & ButtonCreateCompanyStructureMergeProps
) & WithSearchProps;

const ButtonCreateCompanyStructure: React.FC<ButtonCreateCompanyStructureProps> = (props) => {
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
      <EtsBootstrap.Glyphicon glyph="plus" /> Добавить подразделение
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateCompanyStructureProps, ButtonCreateCompanyStructureOwnProps>(
  withSearch,
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonCreateCompanyStructureStateProps, ButtonCreateCompanyStructureDispatchProps, ButtonCreateCompanyStructureOwnProps, ReduxState>(
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
)(ButtonCreateCompanyStructure);
