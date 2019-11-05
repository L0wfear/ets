import * as React from 'react';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';

import Filters from 'components/new/ui/registry/components/data/filters/Filters';
import { PanelWrap, PanelBodyWrap } from 'components/new/ui/registry/components/data/filters/styled/styled';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  registryKey: string;
};

const FiltersWrap: React.FC<Props> = React.memo(
  (props) => {
    const { registryKey } = props;
    const isOpen = etsUseSelector((state) => getFilterData(state.registry, registryKey).isOpen);
    const has_fields = etsUseSelector((state) => Boolean(getFilterData(state.registry, registryKey).fields.length));

    const [needUpdateFiltersOptions, setNeedUpdateFiltersOptions] = React.useState(() => isOpen);

    const handleToggle = React.useCallback(
      () => {
        //
      },
      [],
    );

    React.useEffect(
      () => {
        if (isOpen) {
          setNeedUpdateFiltersOptions(true);
        }
      },
      [isOpen],
    );

    return has_fields && (
      <PanelWrap expanded={isOpen} onToggle={handleToggle}>
        <EtsBootstrap.PanelCollapse>
          <PanelBodyWrap>
            <Filters registryKey={registryKey} needUpdateFiltersOptions={needUpdateFiltersOptions} />
          </PanelBodyWrap>
        </EtsBootstrap.PanelCollapse>
      </PanelWrap>
    );
  },
);

export default FiltersWrap;
