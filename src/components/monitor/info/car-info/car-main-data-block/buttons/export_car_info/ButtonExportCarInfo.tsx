import * as React from 'react';

type Props = {};

const FunctionComponent: React.FC<Props> = React.memo(
  (props) => {

    return (
      <div>FunctionComponent</div>
    );
  },
);

export default FunctionComponent;
