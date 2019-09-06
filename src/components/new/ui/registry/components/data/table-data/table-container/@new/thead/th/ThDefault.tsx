import * as React from 'react';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export const getGlyphName = <F extends any>(key: ValuesOf<ValuesOf<OneRegistryData<F>['list']['meta']['fieldsInDeepArr']>>['key'], sort: OneRegistryData<F>['list']['processed']['sort']) => {
  if (key === sort.field) {
    return sort.reverse ? 'sort-by-attributes-alt' : 'sort-by-attributes';
  }

  return null;
};

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
};

const ThDefault: React.FC<Props> = React.memo(
  (props) => {
    const {
      metaField,
    } = props;

    const sort = etsUseSelector((state) => getListData(state.registry, props.registryKey).processed.sort);

    return (
      <React.Fragment>
        {metaField.title} <EtsBootstrap.Glyphicon glyph={getGlyphName(metaField.key, sort)} />
      </React.Fragment>
    );
  },
);

export default ThDefault;
