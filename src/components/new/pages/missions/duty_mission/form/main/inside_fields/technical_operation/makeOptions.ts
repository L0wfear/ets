import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';

export const makeOptionsByTechnicalOperationRegistryForMissionList = (
  memoize(
    (technicalOperationRegistryForDutyMissionList: TechnicalOperationRegistry[]) => (
      technicalOperationRegistryForDutyMissionList
        .map(defaultSelectListMapper)
    ),
  )
);
