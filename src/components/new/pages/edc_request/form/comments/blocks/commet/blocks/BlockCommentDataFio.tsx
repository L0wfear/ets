import * as React from 'react';
import styled from 'styled-components';

const BlockCommentDataFioContainer = styled.div`
  font-weight: 800;
`;

type BlockCommentDataFioProps = {
  fio: string;
};

const BlockCommentDataFio: React.FC<BlockCommentDataFioProps> = React.memo(
  (props) => {
    return (
      <BlockCommentDataFioContainer>
        {props.fio}
      </BlockCommentDataFioContainer>
    );
  },
);

export default BlockCommentDataFio;
