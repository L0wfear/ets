import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { get } from 'lodash';
import { DivNone } from 'global-styled/global-styled';
import MissionRejectForm from './form/MissionRejectForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { createValidDateTime } from 'utils/dates';

type ButtonFailMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonFailMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonFailMissionOwnProps = {
  registryKey: string;
};
type ButtonFailMissionMergeProps = {};

type ButtonFailMissionProps = (
  ButtonFailMissionStateProps
  & ButtonFailMissionDispatchProps
  & ButtonFailMissionOwnProps
  & ButtonFailMissionMergeProps
);

const ButtonFailMission: React.FC<ButtonFailMissionProps> = (props) => {
  const [showForm, setShowForm] = React.useState(false);

  const handleClickFail = React.useCallback(
    async () => {
      setShowForm(true);
    },
    [props.selectedRow, props.checkedRows],
  );

  const handleReject = React.useCallback(
    (needUpdate) => {
      if (needUpdate) {
        props.registryLoadDataByKey(props.registryKey);
      }
      setShowForm(false);
    },
    [],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((mission: Mission) => !mission.can_be_closed);
  } else {
    const can_be_closed = get(props.selectedRow, 'can_be_closed', false);
    disabled = !can_be_closed;
  }

  return (
    <>
      <EtsBootstrap.Button id="duty_mission-reject" bsSize="small" onClick={handleClickFail} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="ban-circle" /> Отметка о невыполнении
      </EtsBootstrap.Button>
      {
        showForm
          ? (
            <MissionRejectForm
              show={true}
              onReject={handleReject}
              mission={props.selectedRow}
              missions={props.checkedRows}
              action_at={createValidDateTime(new Date())}
            />
          )
          : (
            <DivNone />
          )
      }
    </>
  );
};

export default compose<ButtonFailMissionProps, ButtonFailMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonFailMissionStateProps, ButtonFailMissionDispatchProps, ButtonFailMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
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
)(ButtonFailMission);
