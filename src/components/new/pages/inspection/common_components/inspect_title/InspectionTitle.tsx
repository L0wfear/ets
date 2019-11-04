import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const InspectionTitle: React.FC<{ title: string; }> = (props) => {
  return (
    <EtsBootstrap.Row>
      <EtsBootstrap.Col md={12}>
        <h4>
          {props.title}
        </h4>
      </EtsBootstrap.Col>
    </EtsBootstrap.Row>
  );
};

export default React.memo(InspectionTitle);
