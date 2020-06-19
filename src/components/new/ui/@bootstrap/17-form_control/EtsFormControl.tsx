import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';

export type EtsFormControlProps = any;

const EtsFormControl: React.FC<EtsFormControlProps> = React.memo(
  (props) => {
    return (
      <FormControl {...props} />
    );
  },
);

export default EtsFormControl;
