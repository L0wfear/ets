import * as React from 'react';
import styled from 'styled-components';
import * as FormControl from 'react-bootstrap/lib/FormControl';

export const FormControlStyled = styled(FormControl)``;

type EtsFormControlProps = any;

const EtsFormControl: React.FC<EtsFormControlProps> = React.memo(
  (props) => {
    return (
      <FormControlStyled {...props} />
    );
  },
);

export default EtsFormControl;
