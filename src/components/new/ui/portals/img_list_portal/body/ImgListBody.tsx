import * as React from 'react';
import { ImgListBodyContainer, ImgContainer, ImgBackground } from './styled';
import PrevImage from './prev_image/PrevImage';
import NextImage from './next_image/NextImage';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

type ImgListBodyProps = {
  img_url: string;
  indexImage: number;
  countImages: number;
  setIndexImage: (indexImage: number) => any;
  onClose: () => any;
};

const ImgListBody: React.FC<ImgListBodyProps> = React.memo(
  (props) => {
    const [img, setImg] = React.useState(null);

    React.useEffect(
      () => {
        const imgNew = new Image();
        imgNew.onload = () => setImg(imgNew);
        imgNew.onerror = () => {
          props.onClose();
          return global.NOTIFICATION_SYSTEM.notify('Файл не найден', 'error', 'tr');
        };
        imgNew.src = props.img_url;
      },
      [props.img_url],
    );

    return (
      <ImgListBodyContainer>
        <PrevImage
          indexImage={props.indexImage}
          countImages={props.countImages}
          setIndexImage={props.setIndexImage}
          disabled={false}
        />
        <ImgContainer>
          {
            img
              ? (
                <ImgBackground src={img.src} />
              )
              : (
                <PreloadNew typePreloader="mainpage" />
              )
          }
        </ImgContainer>
        <NextImage
          indexImage={props.indexImage}
          countImages={props.countImages}
          setIndexImage={props.setIndexImage}
          disabled={false}
        />
      </ImgListBodyContainer>
    );
  },
);

export default ImgListBody;
