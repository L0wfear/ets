import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { MissionReassignationUpdate } from 'redux-main/reducers/modules/missions/mission/@types';

type Props = {
  missionData: ValuesOf<MissionReassignationUpdate['missions']>;
  onChange: (
    mission_id: ValuesOf<MissionReassignationUpdate['missions']>['id'],
    field: keyof ValuesOf<MissionReassignationUpdate['missions']>,
    value: ValuesOf<MissionReassignationUpdate['missions']>[keyof ValuesOf<MissionReassignationUpdate['missions']>],
  ) => any;
};

const MissionLine: React.FC<Props> = React.memo(
  (props) => {
    const { missionData } = props;

    const handleChange = React.useCallback(
      (boundKey, value) => {
        props.onChange(missionData.id, boundKey, value);
      },
      [missionData, props.onChange],
    );

    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={12}>
          <FieldLabel title={missionData.technical_operation_name}>
            {`№: ${missionData.number} (${missionData.technical_operation_name})`}
          </FieldLabel>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={missionData.date_start}
            date_start_time={true}

            date_end_id="date_end"
            date_end_value={missionData.date_end}
            date_end_time={true}
            label={false}
            onChange={handleChange}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  },
);

export default MissionLine;
