import * as React from 'react';
import { ImgListFooterContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ImgListFooterProps = {
  img_url: string;
  img_data: {
    name: string;
  } & Record<string, any>;
};

const ImgListFooter: React.FC<ImgListFooterProps> = React.memo(
  (props) => {
    const [disabledBtn, setDisabledBtn] = React.useState(true);

    React.useEffect(() => {
      try {
        const canvasImg: any = document.getElementById('myCanvas');
        // const testImgUrl = 'https://images.unsplash.com/photo-1560406144-1fee5e401b0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=344&q=80';
        const testImgUrl = props.img_url;
        const base_image = new Image();
        let imageHref = '';
        base_image.addEventListener('load', () => {
          canvasImg.width = base_image.width;
          canvasImg.height = base_image.height;
          const canvasContext: any = canvasImg.getContext('2d');
          canvasContext.drawImage(base_image, 0, 0);
          canvasContext.stroke();
          imageHref = canvasImg.toDataURL('image/png');
          download.setAttribute('href', imageHref);
          setDisabledBtn(false);
        }, false);

        // base_image.src = props.img_url;
        base_image.src = testImgUrl;
        base_image.crossOrigin = 'anonymous';

        const download = document.getElementById('download');
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error('error === ', error);
      }
    }, []);

    return (
      <ImgListFooterContainer>
        <a id="download" href={props.img_url} target="_blanc" rel="nofollow" download={props.img_data.name || 'noname.jpg'}>
          <EtsBootstrap.Button themeName="img_view" disabled={disabledBtn}>
            <EtsBootstrap.Glyphicon glyph="download-alt" />
          </EtsBootstrap.Button>
          <canvas id="myCanvas" width="100" height="100" style={{display: 'none', }}>Your browser does not support Canvas.</canvas>
        </a>
      </ImgListFooterContainer>
    );
  },
);

export default ImgListFooter;
