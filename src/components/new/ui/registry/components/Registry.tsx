import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';
import { getRootRegistry } from '../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';

import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

type OwnProps = {
  registryKey: string;
};

type Props = OwnProps & {};

const Registry: React.FC<Props> =  React.memo(
  (props) => {
    const hasData = etsUseSelector((state) => Boolean(getRootRegistry(getRegistryState(state), props.registryKey, true)));

    return (
      <React.Fragment>
        {
          hasData
            ? (
              <Data registryKey={props.registryKey} />
            )
            : (
              <TemplateRegistry/>
            )
        }
        {props.children}
      </React.Fragment>
    );
  },
);

export default withPreloader<OwnProps>({
  typePreloader: 'mainpage',
})(Registry);
