import * as React from 'react';
import { WarningField } from 'components/@next/@ui/renderFields/WarningBlock/styled/WarningField';

import { get } from 'lodash';
import { ExtFieldCommon } from 'components/@next/@ui/renderFields/@types';

type WarningBlockProps = {
  warning: ExtFieldCommon['warning'];
};

const WarningBlock: React.FC<WarningBlockProps> = React.memo(
  (props) => {
    const warningText = get(props, 'warning', '');

    return warningText && (
      <WarningField hidden={!warningText} className="error">
        {warningText}
      </WarningField>
    );
  },
);

export default WarningBlock;
