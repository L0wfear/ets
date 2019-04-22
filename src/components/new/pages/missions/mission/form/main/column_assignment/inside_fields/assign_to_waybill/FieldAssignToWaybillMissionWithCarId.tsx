
import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';
import {
  PropsFieldAssignToWaybillMissionWithCarId, StatePropsFieldAssignToWaybillMissionWithCarId, DispatchPropsPropsFieldAssignToWaybillMissionWithCarId, OwnPropsPropsFieldAssignToWaybillMissionWithCarId,
} from 'components/new/pages/missions/mission/form/main/column_assignment/inside_fields/assign_to_waybill/FieldAssignToWaybillMissionWithCarId.d';
import FieldAssignToWaybillMission from 'components/new/pages/missions/mission/form/main/inside_fields/assign_to_waybill/FieldAssignToWaybillMission';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import { connect } from 'react-redux';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { makeLabelForMissionCarOption } from 'components/new/pages/missions/mission/form/main/inside_fields/car_ids/makeOptions';

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
    <Row>
      <Col md={6}>
        <ExtField
          id={`car-number-${props.index}`}
          label={false}
          type="string"
          value={makeLabelForMissionCarOption(props.carForMissionIndex[props.car_id])}
          readOnly
        />
      </Col>
      <Col md={6}>
        <FieldAssignToWaybillMission
          value={props.value}
          label={''}
          onChange={handleChange}
          page={props.page}
        />
      </Col>
    </Row>
  );
};

export default connect<StatePropsFieldAssignToWaybillMissionWithCarId, DispatchPropsPropsFieldAssignToWaybillMissionWithCarId, OwnPropsPropsFieldAssignToWaybillMissionWithCarId, ReduxState>(
  (state) => ({
    carForMissionIndex: getMissionsState(state).missionData.carsIndex,
  }),
)(FieldAssignToWaybillMissionWithCarId);
