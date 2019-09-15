import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type FieldDefaultProps = {
  fieldData: any;
  formDataKey: any;
};

const FieldDefault: React.FC<FieldDefaultProps> = React.memo(
  (props) => (
    <EtsBootstrap.Col md={props.fieldData.md || 12}>
      {props.fieldData.key}
    </EtsBootstrap.Col>
  ),
);

export default FieldDefault;
