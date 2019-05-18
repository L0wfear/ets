
import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';
import {
  PropsFieldAssignToWaybillMissionWithCarId, StatePropsFieldAssignToWaybillMissionWithCarId, DispatchPropsPropsFieldAssignToWaybillMissionWithCarId, OwnPropsPropsFieldAssignToWaybillMissionWithCarId,
} from 'components/new/pages/missions/mission/form/main/column_assignment/inside_fields/assign_to_waybill/FieldAssignToWaybillMissionWithCarId.d';
import FieldAssignToWaybillMission from 'components/new/pages/missions/mission/form/main/inside_fields/assign_to_waybill/FieldAssignToWaybillMission';
import { connect } from 'react-redux';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { makeLabelForMissionCarOption } from 'components/new/pages/missions/mission/form/main/inside_fields/car_ids/makeOptions';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const FieldAssignToWaybillMissionWithCarId: React.FC<PropsFieldAssignToWaybillMissionWithCarId> = (props) => {
  const handleChange = React.useCallback(
    (value: string[]) => {
      props.onChange(
        props.index,
        value[0],
      );
    },
    [],
  );

  return (
    <EtsBootstrap.Row>
      <EtsBootstrap.Col md={6}>
        <ExtField
          id={`car-number-${props.index}`}
          label={false}
          type="string"
          value={makeLabelForMissionCarOption(props.carForMissionIndex[props.car_id])}
          readOnly
        />
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={6}>
        <FieldAssignToWaybillMission
          value={props.value}
          label={''}
          onChange={handleChange}
          page={props.page}
        />
      </EtsBootstrap.Col>
    </EtsBootstrap.Row>
  );
};

export default connect<StatePropsFieldAssignToWaybillMissionWithCarId, DispatchPropsPropsFieldAssignToWaybillMissionWithCarId, OwnPropsPropsFieldAssignToWaybillMissionWithCarId, ReduxState>(
  (state) => ({
    carForMissionIndex: getMissionsState(state).missionData.carsIndex,
  }),
)(FieldAssignToWaybillMissionWithCarId);
