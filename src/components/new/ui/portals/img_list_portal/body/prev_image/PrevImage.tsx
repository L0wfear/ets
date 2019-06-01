import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import EtsGlyphicon from 'components/new/ui/@bootstrap/01-glyphicon/EtsGlyphicon';
import { NavigationImageContainer } from '../styled';

type PrevImageProps = {
  indexImage: number;
  countImages: number;
  setIndexImage: (indexImage: number) => any;
  disabled: boolean;
};

const PrevImage: React.FC<PrevImageProps> = React.memo(
  (props) => {
    const disabled = (
      props.disabled
      || !props.indexImage
    );

    const handleClick = React.useCallback(
      () => {
        props.setIndexImage(props.indexImage - 1);
      },
      [props.indexImage],
    );

    return (
      <NavigationImageContainer type="left">
        <EtsBootstrap.Button block onClick={handleClick} themeName="img_view" disabled={disabled}>
          <EtsGlyphicon glyph="chevron-left"/>
        </EtsBootstrap.Button>
      </NavigationImageContainer>
    );
  },
);

export default PrevImage;
