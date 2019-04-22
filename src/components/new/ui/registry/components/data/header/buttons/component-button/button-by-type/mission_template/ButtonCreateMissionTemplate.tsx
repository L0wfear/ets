import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
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
import missionTemplatePermissions from 'components/new/pages/missions/mission_template/_config-data/permissions';

type ButtonCreateMissionTemplateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCreateMissionTemplateDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateMissionTemplateOwnProps = {
  registryKey: string;
};
type ButtonCreateMissionTemplateMergeProps = {};

type ButtonCreateMissionTemplateProps = (
  ButtonCreateMissionTemplateStateProps
  & ButtonCreateMissionTemplateDispatchProps
  & ButtonCreateMissionTemplateOwnProps
  & ButtonCreateMissionTemplateMergeProps
) & WithSearchProps;

const ButtonCreateMissionTemplate: React.FC<ButtonCreateMissionTemplateProps> = (props) => {
  const missionsAsArray = Object.values(props.checkedRows);

  const disabled = (
    !missionsAsArray.length
    || missionsAsArray.some(({ kind_task_ids = [] }) => !kind_task_ids.includes(3))
  );

  const handleClick = React.useCallback(
    async () => {
      props.registrySetSelectedRowToShowInForm(
        props.registryKey,
        {},
      );

      props.setParams({
        [props.uniqKeyForParams]: buttonsTypes.create,
        type: buttonsTypes.missions_by_templates,
      });
    },
    [disabled, missionsAsArray, props.match, props.setParams],
  );

  return (
      <Button id="open-update-form" bsSize="small" onClick={handleClick} disabled={disabled}>
        Сформировать децентрализованное задание
      </Button>
  );
};

export default compose<ButtonCreateMissionTemplateProps, ButtonCreateMissionTemplateOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: missionTemplatePermissions.create,
  }),
  connect<ButtonCreateMissionTemplateStateProps, ButtonCreateMissionTemplateDispatchProps, ButtonCreateMissionTemplateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
    }),
  ),
)(ButtonCreateMissionTemplate);
