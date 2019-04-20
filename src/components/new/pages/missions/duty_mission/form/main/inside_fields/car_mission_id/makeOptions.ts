import memoize from 'memoize-one';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export const makeOptionsMissionsForCarMissionId = (
  memoize(
    (availableMissionsToBind: Mission[]) => (
      availableMissionsToBind
        .map<DefaultSelectOption<Mission['id'], string, Mission>>((mission) => ({
          value: mission.id,
          label: `№${mission.number} (${mission.technical_operation_name})`,
          rowData: mission,
        }))
    ),
  )
);
