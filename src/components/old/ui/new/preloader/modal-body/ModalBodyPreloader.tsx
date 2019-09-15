import * as React from 'react';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Props } from '../PreloadNew';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

type PropsModalBodyPreloader = {
  typePreloader?: Props['typePreloader'];
} & (
  {
    path?: string;
    page?: string;
  } | {
    meta: LoadingMeta;
  }
);

const ModalBodyPreloader: React.FC<PropsModalBodyPreloader> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.ModalBody {...props}>
        {props.children}
      </EtsBootstrap.ModalBody>
    );
  },
);

export default withPreloader<PropsModalBodyPreloader>({})(ModalBodyPreloader);
