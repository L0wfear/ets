import * as React from 'react';
import * as ReactDom from 'react-dom';
import configs from 'config';

import { ImageListContainer } from './styled';
import ImgListHeader from './header/ImgListHeader';
import ImgListBody from './body/ImgListBody';
import ImgListFooter from './footer/ImgListFooter';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';

type ImgListPortalProps = {
  images: any[];
  indexToShow?: number;
  onClose: () => any;
};

const ImgListPortal: React.FC<ImgListPortalProps> = React.memo(
  (props) => {
    const [indexImage, setIndexImage] = React.useState(() => props.indexToShow);

    const countImages = React.useMemo(
      () => props.images.length,
      [],
    );

    const img_url = React.useMemo(
      () => {
        if (props.images && props.images[indexImage] && props.images[indexImage].url) {
          return `${__DEVELOPMENT__ ? configs.url : ''}${props.images[indexImage].url.slice(1)}`;
        }
        if (props.images && props.images[indexImage] && props.images[indexImage].path) {
          return props.images[indexImage].path;
        }

        if (props.images && props.images[indexImage] && props.images[indexImage].base64) {
          return props.images[indexImage].base64;
        }
        return null;
      },
      [props.images, indexImage],
    );

    React.useEffect(
      () => {
        if (!img_url) {
          global.NOTIFICATION_SYSTEM.notify('Ошибка открытия файла', 'error', 'tr');
          props.onClose();
        }
      },
      [img_url, props.onClose],
    );

    useEscapeEvent(props.onClose);

    return Boolean(img_url) && img_url !== '1' && ReactDom.createPortal(
      <ImageListContainer>
        <ImgListHeader
          img_data={props.images[indexImage]}
          indexImage={indexImage}
          countImages={countImages}
          onClose={props.onClose}
        />
        <ImgListBody
          img_url={img_url}
          indexImage={indexImage}
          countImages={countImages}
          setIndexImage={setIndexImage}
        />
        <ImgListFooter img_url={img_url}/>
      </ImageListContainer>,
      document.getElementById('image_container'),
    );
  },
);

export default ImgListPortal;
