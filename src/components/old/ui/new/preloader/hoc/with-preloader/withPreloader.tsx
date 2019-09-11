import * as React from 'react';

import PreloadNew, { Props } from 'components/old/ui/new/preloader/PreloadNew';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getLoadingCount } from 'redux-main/_middleware/ets-loading/module/selector';

type TypeConfig = {
  typePreloader?: Props['typePreloader'];
  page?: string;
  path?: string;
};

type OwnPropsExtends = Partial<TypeConfig> & Record<string, any>;

const withPreloader = <OwnProps extends OwnPropsExtends>(configWithPreloader: TypeConfig) => (Component: React.ComponentType<OwnProps>) => {
  const PreloaderWrap: React.FC<OwnProps> = React.memo(
    (props) => {
      const isLoading = etsUseSelector((state) => getLoadingCount(state.etsLoading, configWithPreloader.page || props.page, configWithPreloader.path || props.path));

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
