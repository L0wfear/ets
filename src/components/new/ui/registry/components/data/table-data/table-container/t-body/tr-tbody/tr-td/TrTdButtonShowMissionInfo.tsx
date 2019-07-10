import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { MissionInfoStatusDiv, GlyphiconContainer32, EtsTbodyTrTdMisionData } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { MISSION_STATUS } from 'constants/dictionary';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type TrTdButtonShowMissionInfoStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  permissions: string | boolean;
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type TrTdButtonShowMissionInfoDispatchProps = {
};
type TrTdButtonShowMissionInfoOwnProps = {
  registryKey: string;
  rowData: Mission;
};
type TrTdButtonShowMissionInfoMergedProps = (
  TrTdButtonShowMissionInfoStateProps
  & TrTdButtonShowMissionInfoDispatchProps
  & TrTdButtonShowMissionInfoOwnProps
) & WithSearchProps;

type TrTdButtonShowMissionInfoProps = TrTdButtonShowMissionInfoMergedProps;

const TrTdButtonShowMissionInfo: React.FC<TrTdButtonShowMissionInfoProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const noData = rowData.status === MISSION_STATUS.not_assigned;

    const handleClick = React.useCallback(
      async () => {
        if (!noData) {
          props.setParams(
            {
              [props.uniqKeyForParams]: rowData[props.uniqKey],
              type: 'info',
            },
          );
        }
      },
      [rowData, noData, props.uniqKeyForParams],
    );

    return (
      <EtsTbodyTrTdMisionData>
        <MissionInfoStatusDiv>
          {
            !noData
              ? (
                <GlyphiconContainer32 onClick={handleClick} notFull={Number(rowData.current_percentage) < 100}>
                  <EtsBootstrap.Glyphicon glyph="info-sign" />
                </GlyphiconContainer32>

              )
              : (
                <span>Нет данных</span>
              )
          }
        </MissionInfoStatusDiv>
      </EtsTbodyTrTdMisionData>
    );
  },
);

export default compose<TrTdButtonShowMissionInfoProps, TrTdButtonShowMissionInfoOwnProps>(
  connect<TrTdButtonShowMissionInfoStateProps, TrTdButtonShowMissionInfoDispatchProps, TrTdButtonShowMissionInfoOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      permissions: getListData(state.registry, registryKey).permissions.read, //  прокидывается в следующий компонент
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(TrTdButtonShowMissionInfo);
