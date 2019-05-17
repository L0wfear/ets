import * as React from 'react';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';

type FieldSelectMissionProps = {
  formDataKey: string;
};

const FieldSelectMission: React.FC<FieldSelectMissionProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={12}>
            <ExtField
              type="select"
              label={false}
              value={null}
              options={[]}
            />
          </Col>
        );
      },
      [props],
    );
  },
);

export default FieldSelectMission;
