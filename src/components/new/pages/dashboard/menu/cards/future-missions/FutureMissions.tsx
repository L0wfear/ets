import * as React from 'react';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

import ListByTypeFutureMission from 'components/new/pages/dashboard/menu/cards/future-missions/list/ListByTypeFutureMission';

import { dashboardLoadFutureMissions } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { PermittedMissionFormLazy } from 'components/new/pages/missions/mission/buttons/buttons';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

type OwnProps = PropsToDefaultCard;
type Props = OwnProps & WithRequirePermissionAddProps;

const FutureMissions: React.FC<Props> = React.memo(
  () => {
    const [mission, setMission] = React.useState(null);
    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      async (id: number) => {
        let missionData = null;
        try {
          missionData = await dispatch(
            missionsActions.actionGetMissionById(
              id,
              {
                page: 'dashboard',
              },
            ),
          );
        } catch (error) {
          console.error(error); // tslint:disable-line
        }
        if (missionData) {
          setMission(missionData);
        }
      },
      [],
    );

    const handleFormHide = React.useCallback(
      () => {
        setMission(null);
      },
      [],
    );

    return (
      <div>
        <ListByTypeFutureMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={handleClick} />
        <ListByTypeFutureMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={handleClick} />
        {
          mission && (
            <PermittedMissionFormLazy
              showForm
              onFormHide={handleFormHide}
              element={mission}
            />
          )
        }
      </div>
    );
  },
);

export default withDefaultCard<OwnProps>({
  path: 'future_missions',
  loadData: dashboardLoadFutureMissions,
})(FutureMissions);
