import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';
import { getRootRegistry, getHeaderData } from '../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';

import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  registryKey: string;
};

type Props = OwnProps & {};

const Registry: React.FC<Props> =  React.memo(
  (props) => {
    const hasData = etsUseSelector((state) => Boolean(getRootRegistry(getRegistryState(state), props.registryKey, true)));
    const title = etsUseSelector((state) => getHeaderData(getRegistryState(state), props.registryKey).title);

    React.useLayoutEffect(
      () => {
        const meta = document.querySelector('meta[property="og:title"]');
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        const new_title = `${etsName} ${title}`;

        if (document) {
          document.title = new_title;
        }
        if (meta) {
          meta.setAttribute('content', new_title);
        }

        return () => {
          const metaNew = document.querySelector('meta[property="og:title"]');
          if (document) {
            document.title = etsName;
          }
          if (metaNew) {
            metaNew.setAttribute('content', etsName);
          }
        };
      },
    );
    return (
      hasData
        ? (
          <Data registryKey={props.registryKey} />
        )
        : (
          <TemplateRegistry/>
        )
    );
  },
);

export default Registry;
