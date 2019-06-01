import * as React from 'react';
import { ImgListHeaderContainer, ImgHeaderNumberOfContainer, ImgHeadeButtonCloseContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ImgListHeaderProps = {
  img_data: {
    name: string;
  } & Record<string, any>;
  indexImage: number;
  countImages: number;
  onClose: () => any;
};

const ImgListHeader: React.FC<ImgListHeaderProps> = React.memo(
  (props) => {
    return (
      <ImgListHeaderContainer>
        <ImgHeaderNumberOfContainer>
          {`${props.indexImage + 1} / ${props.countImages}`}
        </ImgHeaderNumberOfContainer>
        <div>
          {props.img_data.name}
        </div>
        <ImgHeadeButtonCloseContainer>
          <EtsBootstrap.Button block themeName="img_view" onClick={props.onClose}>
            <EtsBootstrap.Glyphicon glyph="remove" />
          </EtsBootstrap.Button>
        </ImgHeadeButtonCloseContainer>
      </ImgListHeaderContainer>
    );
  },
);

export default ImgListHeader;
