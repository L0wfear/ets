import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';

type BlockCommentDataCommentsProps = {
  comment: string;
};

const BlockCommentDataComments: React.FC<BlockCommentDataCommentsProps> = React.memo(
  (props) => {
    return (
      <ExtField
        type="text"
        label={false}
        rows={2}
        disabled
        value={props.comment}
      />
    );
  },
);

export default BlockCommentDataComments;
