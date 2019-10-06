import * as React from 'react';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

import { get } from 'lodash';
import { ExtFieldCommon } from 'components/@next/@ui/renderFields/@types';

// ErrorsBlock

type ErrorsBlockProps = {
  showError?: boolean;
  error: ExtFieldCommon['error'];
  hidden?: boolean;
};

const ErrorsBlock: React.FC<ErrorsBlockProps> = React.memo(
  (props) => {
    const errorText = get(props, 'error', '');
    const showError = get(props, 'showError', errorText ? true : false);
    const hidden = get(props, 'hidden', false);
    const showErrorBlock = !hidden && showError;

    return showErrorBlock && (
      <ErrorField hidden={!errorText} className="error">
        {errorText}
      </ErrorField>
    );
  },
);

export default ErrorsBlock;
