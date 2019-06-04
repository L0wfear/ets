import * as React from 'react';
import { FlexContainer } from 'global-styled/global-styled';
import BlockCommentDataDate from './blocks/BlockCommentDataDate';
import BlockCommentDataFio from './blocks/BlockCommentDataFio';
import { BlockCommentDataFirstLine } from './styled';
import BlockCommentDataComments from './blocks/BlockCommentDataComments';

type BlockCommentDataProps = {
  date: string;
  fio: string;

  comment: string;
};

const BlockCommentData: React.FC<BlockCommentDataProps> = React.memo(
  (props) => {
    return (
      <FlexContainer direction="column">
        <BlockCommentDataFirstLine>
          <BlockCommentDataDate date={props.date} />
          <BlockCommentDataFio fio={props.fio} />
        </BlockCommentDataFirstLine>
        <BlockCommentDataComments comment={props.comment} />
      </FlexContainer>
    );
  },
);

export default BlockCommentData;
