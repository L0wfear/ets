import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
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
import missionTemplatePermissions from 'components/new/pages/missions/mission_template/_config-data/permissions';

import { get } from 'lodash';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCopyMissionTemplateStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCopyMissionTemplateDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCopyMissionTemplateOwnProps = CommonTypesForButton & {};
type ButtonCopyMissionTemplateMergeProps = {};

type ButtonCopyMissionTemplateProps = (
  ButtonCopyMissionTemplateStateProps
  & ButtonCopyMissionTemplateDispatchProps
  & ButtonCopyMissionTemplateOwnProps
  & ButtonCopyMissionTemplateMergeProps
) & WithSearchProps;

const ButtonCopyMissionTemplate: React.FC<ButtonCopyMissionTemplateProps> = (props) => {
  const selectedRow = props.selectedRow;

  const handleClick = React.useCallback(
    async () => {
      props.registrySetSelectedRowToShowInForm(
        props.registryKey,
        {},
      );

      props.setParams({
        [props.uniqKeyForParams]: get(selectedRow, props.uniqKey, null),
        type: buttonsTypes.copy_template,
      });
    },
    [selectedRow, props.match, props.setParams],
  );

  return (
      <EtsBootstrap.Button id={`${props.registryKey}.open-copy_form-form`} bsSize="small" onClick={handleClick} disabled={!selectedRow}>
        <EtsBootstrap.Glyphicon glyph="copy" />  Копировать
      </EtsBootstrap.Button>
  );
};

export default compose<ButtonCopyMissionTemplateProps, ButtonCopyMissionTemplateOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: missionTemplatePermissions.create,
  }),
  connect<ButtonCopyMissionTemplateStateProps, ButtonCopyMissionTemplateDispatchProps, ButtonCopyMissionTemplateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any) => ({
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
    }),
  ),
)(ButtonCopyMissionTemplate);
