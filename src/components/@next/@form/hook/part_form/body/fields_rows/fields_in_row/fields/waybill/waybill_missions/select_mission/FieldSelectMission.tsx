import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldSelectMissionProps = {
  formDataKey: string;
};

const FieldSelectMission: React.FC<FieldSelectMissionProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Col md={12}>
        <ExtField
          type="select"
          label={false}
          value={null}
          options={[]}
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldSelectMission;
