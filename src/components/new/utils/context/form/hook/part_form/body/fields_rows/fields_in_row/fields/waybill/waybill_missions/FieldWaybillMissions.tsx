import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FieldDataWaybillMissions } from 'components/new/utils/context/form/@types/fields/waybill';
import FieldSelectMission from './select_mission/FieldSelectMission';
import FieldCreateMission from './button_create_mission/FieldCreateMission';

type FieldWaybillMissionsProps = {
  fieldData: FieldDataWaybillMissions;
  formDataKey: string;
};

const FieldWaybillMissions: React.FC<FieldWaybillMissionsProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={12}>
            <Row>
              <Col md={12}>
                <h4>Задание</h4>
              </Col>
            </Row>
            <Row>
              <FieldSelectMission formDataKey={props.formDataKey} />
            </Row>
            <br />
            <Row>
              <FieldCreateMission formDataKey={props.formDataKey} />
            </Row>
          </Col>
        );
      },
      [props],
    );
  },
);

export default FieldWaybillMissions;
