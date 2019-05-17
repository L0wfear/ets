import * as React from 'react';
import { Col, Button } from 'react-bootstrap';

type FieldCreateMissionProps = {
  formDataKey: string;
};

const FieldCreateMission: React.FC<FieldCreateMissionProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={12}>
            <Button>Создать задание</Button>
          </Col>
        );
      },
      [props],
    );
  },
);

export default FieldCreateMission;
