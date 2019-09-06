import * as React from 'react';
import FieldSelectMission from './select_mission/FieldSelectMission';
import FieldCreateMission from './button_create_mission/FieldCreateMission';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillMissionsProps = {
  formDataKey: string;
};

const FieldWaybillMissions: React.FC<FieldWaybillMissionsProps> = React.memo(
  (props) => {

    return (
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h4>Задание</h4>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldSelectMission formDataKey={props.formDataKey} />
        </EtsBootstrap.Row>
        <br />
        <EtsBootstrap.Row>
          <FieldCreateMission formDataKey={props.formDataKey} />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillMissions;
