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

type ButtonCreateMissionStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type ButtonCreateMissionDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateMissionOwnProps = CommonTypesForButton & {};
type ButtonCreateMissionMergeProps = {};

type ButtonCreateMissionProps = (
  ButtonCreateMissionStateProps
  & ButtonCreateMissionDispatchProps
  & ButtonCreateMissionOwnProps
  & ButtonCreateMissionMergeProps
) & WithSearchProps;

const ButtonCreateMission: React.FC<ButtonCreateMissionProps> = (props) => {
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
    <EtsBootstrap.Button id={`${props.registryKey}.open-create_mission_by_templates-form`} bsSize="small" onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph="plus" /> Создать децентрализованное задание
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateMissionProps, ButtonCreateMissionOwnProps>(
  withSearch,
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonCreateMissionStateProps, ButtonCreateMissionDispatchProps, ButtonCreateMissionOwnProps, ReduxState>(
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
)(ButtonCreateMission);
