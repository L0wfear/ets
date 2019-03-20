import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export const makeOptionFromRouteList = memoize(
  (routesList: Route[], structure_id: MissionTemplate['structure_id']) =>
    routesList.reduce((newArr, route) => {
      const triggerOnAdRoutetoShow =
        !structure_id || route.structure_id === structure_id;

      if (triggerOnAdRoutetoShow) {
        newArr.push(defaultSelectListMapper(route));
      }

      return newArr;
    }, []),
);
