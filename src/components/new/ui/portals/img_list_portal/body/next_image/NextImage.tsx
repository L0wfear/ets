import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import EtsGlyphicon from 'components/new/ui/@bootstrap/01-glyphicon/EtsGlyphicon';
import { NavigationImageContainer } from '../styled';

type NextImageProps = {
  indexImage: number;
  countImages: number;
  setIndexImage: (indexImage: number) => any;
  disabled: boolean;
};

const NextImage: React.FC<NextImageProps> = React.memo(
  (props) => {
    const disabled = (
      props.disabled
      || (
        props.indexImage === (props.countImages - 1)
      )
    );

    const handleClick = React.useCallback(
      () => {
        props.setIndexImage(props.indexImage + 1);
      },
      [props.indexImage],
    );

    return (
      <NavigationImageContainer type="right">
        <EtsBootstrap.Button block onClick={handleClick} themeName="img_view" disabled={disabled}>
          <EtsGlyphicon glyph="chevron-right"/>
        </EtsBootstrap.Button>
      </NavigationImageContainer>
    );
  },
);

export default NextImage;
