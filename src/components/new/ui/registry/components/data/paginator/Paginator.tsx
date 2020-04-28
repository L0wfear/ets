import * as React from 'react';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import ButtonFirst from 'components/new/ui/registry/components/data/paginator/buttons/ButtonFirst';
import ButtonPrev from 'components/new/ui/registry/components/data/paginator/buttons/ButtonPrev';
import ButtonNext from 'components/new/ui/registry/components/data/paginator/buttons/ButtonNext';
import ButtonLast from 'components/new/ui/registry/components/data/paginator/buttons/ButtonLast';

import { EtsPaginatorContainer, EtsPaginatorPages, } from 'components/new/ui/registry/components/data/paginator/styled/styled';

import NumberButtons from './buttons/number_buttons/NumberButtons';
import EtsPaginatorCheckSearch from './EtsPaginatorCheckSearch';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

import PerPageSelector from 'components/new/ui/registry/components/data/paginator/perPageSelector/perPageSelector';

type Props = {
  registryKey: string;
};

const PaginatorNew: React.FC<Props> = React.memo(
  ({ registryKey }) => {
    const total_count = etsUseSelector((state) => getListData(state.registry, registryKey).processed.total_count);
    const currentPage = etsUseSelector((state) => getListData(state.registry, registryKey).paginator.currentPage);
    const perPage = etsUseSelector((state) => getListData(state.registry, registryKey).paginator.perPage);

    const countPages = Math.ceil(total_count / perPage);
    const countButtonsForRender = Math.min(countPages, 11);

    const buttons = React.useMemo(
      () => {
        return Array.from(
          { length: countButtonsForRender },
          (d, index) => {
            const halfButtonCount = Math.ceil(countButtonsForRender / 2);

            let number = index;

            if (currentPage > halfButtonCount) {
              number = index + currentPage + 1 - halfButtonCount;
            }
            if (currentPage >= (countPages - halfButtonCount)) {
              number = index + (countPages - countButtonsForRender);
            }

            return (
              <NumberButtons
                key={number}
                number={number}
                registryKey={registryKey}
              />
            );
          },
        );
      },
      [countButtonsForRender, currentPage, registryKey, countPages],
    );

    return (
      <React.Fragment>
        <EtsPaginatorContainer>
          <EtsPaginatorPages>
            {
              countPages > 1 && (
                <React.Fragment>
                  <ButtonFirst registryKey={registryKey} />
                  <ButtonPrev registryKey={registryKey}/>
                  {
                    buttons
                  }
                  <ButtonNext registryKey={registryKey} />
                  <ButtonLast registryKey={registryKey} />
                </React.Fragment>
              )
            }
          </EtsPaginatorPages>
          <PerPageSelector registryKey={registryKey} />
        </EtsPaginatorContainer>
        <EtsPaginatorCheckSearch registryKey={registryKey} countPages={countPages} />
      </React.Fragment>
    );
  },
);

export default PaginatorNew;
