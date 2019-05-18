import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldCreateMissionProps = {
  formDataKey: string;
};

const FieldCreateMission: React.FC<FieldCreateMissionProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Button>Создать задание</EtsBootstrap.Button>
          </EtsBootstrap.Col>
        );
      },
      [props],
    );
  },
);

export default FieldCreateMission;
