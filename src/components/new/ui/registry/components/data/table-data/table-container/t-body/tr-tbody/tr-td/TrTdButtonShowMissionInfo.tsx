import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { MissionInfoStatusDiv, GlyphiconContainer32, EtsTbodyTrTdMisionData } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { Glyphicon } from 'react-bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import MissionInfoFormWrap from 'components/new/ui/mission_info_form/MissionInfoFormWrap';
import { actionLoadMissionData } from 'redux-main/reducers/modules/missions/mission/actions';
import { MISSION_STATUS } from 'constants/dictionary';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type TrTdButtonShowMissionInfoStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  permissions: string | boolean;
};
type TrTdButtonShowMissionInfoDispatchProps = {
  actionLoadMissionData: HandleThunkActionCreator<typeof actionLoadMissionData>;
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
    const [missionInfoElement, setMissionInfoElement] = React.useState(null);
    const { rowData } = props;

    const noData = rowData.status === MISSION_STATUS.not_assigned;

    const handleClick = React.useCallback(
      async () => {
        if (!noData) {
          const missionData = await props.actionLoadMissionData(
            props.rowData.id,
            {
              page: props.registryKey,
            },
          );
          setMissionInfoElement(missionData);
        }
      },
      [rowData, noData],
    );

    const handleHide = React.useCallback(
      () => {
        setMissionInfoElement(null);
      },
      [],
    );

    /*
    if (rowData.status === 'not_assigned') return <div>Нет данных</div>;
      const className = Number(rowData.current_percentage) < 100 ? 'td-red' : undefined;

      return (
        <div className={className} style={{ width: '100%', heigth: '100%' }}>
          <span onClick={() => props.mapView(data)}>
            <Glyphicon glyph="info-sign" />
          </span>
        </div>
    */

    return (
      <EtsTbodyTrTdMisionData>
        <MissionInfoStatusDiv>
          {
            !noData
              ? (
                <GlyphiconContainer32 onClick={handleClick} notFull={Number(rowData.current_percentage) < 100}>
                  <Glyphicon glyph="info-sign" />
                </GlyphiconContainer32>

              )
              : (
                <span>Нет данных</span>
              )
          }
        </MissionInfoStatusDiv>
        <MissionInfoFormWrap
          onFormHide={handleHide}
          showForm={Boolean(missionInfoElement)}
          element={missionInfoElement}
        />
      </EtsTbodyTrTdMisionData>
    );
  },
);

export default compose<TrTdButtonShowMissionInfoProps, TrTdButtonShowMissionInfoOwnProps>(
  connect<TrTdButtonShowMissionInfoStateProps, TrTdButtonShowMissionInfoDispatchProps, TrTdButtonShowMissionInfoOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      permissions: getListData(state.registry, registryKey).permissions.read, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      actionLoadMissionData: (...arg) => (
        dispatch(
          actionLoadMissionData(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(TrTdButtonShowMissionInfo);
