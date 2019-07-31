// snippet function_component
import * as React from 'react';

// Простые названия, если не нужен экспорт
type Props = {};

const FunctionComponent: React.FC<Props> = React.memo(
  (props) => {
    return (
      <div>FunctionComponent</div>
    );
  },
);

export default FunctionComponent;
