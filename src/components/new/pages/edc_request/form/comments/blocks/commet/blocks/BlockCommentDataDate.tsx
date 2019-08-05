import * as React from 'react';
import styled from 'styled-components';
import { getFormattedDateTime } from 'components/@next/@utils/dates/dates';

const BlockCommentDataDateContainer = styled.div`
  font-weight: 400;
`;

type BlockCommentDataDateProps = {
  date: string;
};

const BlockCommentDataDate: React.FC<BlockCommentDataDateProps> = React.memo(
  (props) => {
    return (
      <BlockCommentDataDateContainer>
        {getFormattedDateTime(props.date)}
      </BlockCommentDataDateContainer>
    );
  },
);

export default BlockCommentDataDate;
