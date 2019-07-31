import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types/index';

export const makeOptionFromRouteList = (
  memoize(
    (
      routesList: Route[],
      structure_id: Mission['structure_id'],
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
