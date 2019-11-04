import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { NavigationImageContainer } from '../styled';

type PrevImageProps = {
  indexImage: number;
  countImages: number;
  setIndexImage: (indexImage: number) => any;
  disabled: boolean;
};

const PrevImage: React.FC<PrevImageProps> = React.memo(
  (props) => {
    const [next, setShowNext] = React.useState(false);

    const disabled = (
      props.disabled
      || !props.indexImage
    );

    const handleClick = React.useCallback(
      () => {
        if (!disabled) {
          props.setIndexImage(props.indexImage - 1);
        }
      },
      [props.indexImage, disabled],
    );

    React.useEffect(() => {
      const escFunction = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setShowNext(true);
        }
      };

      document.addEventListener('keydown', escFunction, false);

      return () => {
        document.removeEventListener('keydown', escFunction, false);
      };
    });

    React.useEffect(
      () => {
        if (next) {
          setShowNext(false);
          handleClick();
        }
      },
      [next, handleClick],
    );

    return (
      <NavigationImageContainer type="left">
        <EtsBootstrap.Button block onClick={handleClick} themeName="img_view" disabled={disabled}>
          <EtsBootstrap.Glyphicon glyph="chevron-left"/>
        </EtsBootstrap.Button>
      </NavigationImageContainer>
    );
  },
);

export default PrevImage;
