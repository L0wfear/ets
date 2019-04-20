import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types/index';

export const makeOptionFromRouteList = (
  memoize(
    (
      routesList: Route[],
      structure_id: DutyMission['structure_id'],
    ) => (
      routesList.reduce((newArr, route) => {
        const triggerOnAdRoutetoShow = (
          !structure_id
          || (route.structure_id === structure_id)
        );

        if (triggerOnAdRoutetoShow) {
          newArr.push(defaultSelectListMapper(route));
        }

        return newArr;
      }, [])
    ),
  )
);
