import * as React from 'react';
import { ImgListBodyContainer, ImgContainer, ImgBackground } from './styled';
import PrevImage from './prev_image/PrevImage';
import NextImage from './next_image/NextImage';

type ImgListBodyProps = {
  img_url: string;
  indexImage: number;
  countImages: number;
  setIndexImage: (indexImage: number) => any;
};

const ImgListBody: React.FC<ImgListBodyProps> = React.memo(
  (props) => {
    return (
      <ImgListBodyContainer>
        <PrevImage
          indexImage={props.indexImage}
          countImages={props.countImages}
          setIndexImage={props.setIndexImage}
          disabled={false}
        />
        <ImgContainer>
          <ImgBackground src={props.img_url} />
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
