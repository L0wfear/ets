import * as React from 'react';
import { ImgListFooterContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ImgListFooterProps = {
  img_url: string;
};

const ImgListFooter: React.FC<ImgListFooterProps> = React.memo(
  (props) => {
    return (
      <ImgListFooterContainer>
        <a href={props.img_url} target="_blanc">
          <EtsBootstrap.Button themeName="img_view">
            <EtsBootstrap.Glyphicon glyph="download-alt" />
          </EtsBootstrap.Button>
        </a>
      </ImgListFooterContainer>
    );
  },
);

export default ImgListFooter;
