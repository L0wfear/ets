import * as React from 'react';
import { get } from 'lodash';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';

type SingleUiElementWrapperProps = {
  hidden?: boolean;
  [key: string]: any;
};

const SingleUiElementWrapper: React.FC<SingleUiElementWrapperProps> = React.memo(
  (props) => {
    const hidden = get(props, 'hidden', false);

    return !hidden && (
      <SingleUiElementWrapperStyled {...props}>
        {props.children}
      </SingleUiElementWrapperStyled>
    );
  },
);

export default SingleUiElementWrapper;
