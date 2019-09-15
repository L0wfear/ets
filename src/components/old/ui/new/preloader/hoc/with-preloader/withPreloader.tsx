import * as React from 'react';
import { get } from 'lodash';

import PreloadNew, { Props } from 'components/old/ui/new/preloader/PreloadNew';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getLoadingCount } from 'redux-main/_middleware/ets-loading/module/selector';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

type TypeConfig = {
  typePreloader?: Props['typePreloader'];
} & (
  {
    path?: string;
    page?: string;
  } | {
    meta?: LoadingMeta;
  }
);

type OwnPropsExtends = Partial<TypeConfig> & Record<string, any>;

const withPreloader = <OwnProps extends OwnPropsExtends>(configWithPreloader: TypeConfig) => (Component: React.ComponentType<OwnProps>) => {
  const PreloaderWrap: React.FC<OwnProps> = React.memo(
    (props) => {
      const page = (
        get(configWithPreloader, 'page')
        || get(configWithPreloader, 'meta.page')
        || get(props, 'page')
        || get(props, 'meta.page')
      );

      const path = (
        get(configWithPreloader, 'path')
        || get(configWithPreloader, 'meta.path')
        || get(props, 'path')
        || get(props, 'meta.path')
      );

      const isLoading = etsUseSelector((state) => getLoadingCount(state.etsLoading, page, path));

      return (
        <React.Fragment>
            {
              Boolean(isLoading) && (
                <PreloadNew typePreloader={configWithPreloader.typePreloader || props.typePreloader} />
              )
            }
            <Component
              {...props}
            />
          </React.Fragment>
      );
    },
  );

  return PreloaderWrap;
};

export default withPreloader;
