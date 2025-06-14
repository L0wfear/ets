import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';

export const makeOptionsByTechnicalOperationRegistryForMissionList = (
  memoize(
    (technicalOperationRegistryForMissionList: Array<TechnicalOperationRegistry>) => (
      technicalOperationRegistryForMissionList
        .map(defaultSelectListMapper)
    ),
  )
);
