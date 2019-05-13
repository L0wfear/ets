import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import ButtonFirst from 'components/new/ui/registry/components/data/paginator/buttons/ButtonFirst';
import ButtonPrev from 'components/new/ui/registry/components/data/paginator/buttons/ButtonPrev';
import ButtonNext from 'components/new/ui/registry/components/data/paginator/buttons/ButtonNext';
import ButtonLast from 'components/new/ui/registry/components/data/paginator/buttons/ButtonLast';

import { EtsPaginatorContainer } from 'components/new/ui/registry/components/data/paginator/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from '../../../module/registry';
import NumberButtons from './buttons/number_buttons/NumberButtons';
import { compose } from 'recompose';
import EtsPaginatorCheckSearch from './EtsPaginatorCheckSearch';

type PaginatorNewStateProps = {
  perPage: OneRegistryData['list']['paginator']['perPage'];
  currentPage: OneRegistryData['list']['paginator']['currentPage'];
  total_count: OneRegistryData['list']['processed']['total_count'];
};
type PaginatorNewDispatchProps = DispatchProp;
type PaginatorNewOwnProps = {
  registryKey: string;
};
type PaginatorNewProps = (
  PaginatorNewStateProps
  & PaginatorNewDispatchProps
  & PaginatorNewOwnProps
);

const PaginatorNew: React.FC<PaginatorNewProps> = React.memo(
  (props) => {
    const { registryKey } = props;

    const countPages = Math.ceil(props.total_count / props.perPage);
    const countButtonsForRender = Math.min(countPages, 11);

    const buttons = React.useMemo(
      () => {
        return Array.from(
          { length: countButtonsForRender },
          (d, index) => {
            const halfButtonCount = Math.ceil(countButtonsForRender / 2);

            let number = index;

            if (props.currentPage > halfButtonCount) {
              number = index + props.currentPage + 1 - halfButtonCount;
            }
            if (props.currentPage >= (countPages - halfButtonCount)) {
              number = index + (countPages - countButtonsForRender);
            }

            return (
              <NumberButtons
                key={number}
                number={number}
                registryKey={props.registryKey}
              />
            );
          },
        );
      },
      [countButtonsForRender, props.currentPage, props.registryKey, countPages],
    );

    return (
      <React.Fragment>
        {
          countPages > 1
            && (
              <EtsPaginatorContainer>
                <ButtonFirst registryKey={registryKey} />
                <ButtonPrev registryKey={registryKey}/>
                {
                  buttons
                }
                <ButtonNext registryKey={registryKey} />
                <ButtonLast registryKey={registryKey} />
              </EtsPaginatorContainer>
            )
        }
        <EtsPaginatorCheckSearch registryKey={registryKey} countPages={countPages} />
      </React.Fragment>
    );
  },
);

export default compose<PaginatorNewProps, PaginatorNewOwnProps>(
  connect<PaginatorNewStateProps, PaginatorNewDispatchProps, PaginatorNewOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      total_count: getListData(state.registry, registryKey).processed.total_count,
      currentPage: getListData(state.registry, registryKey).paginator.currentPage,
      perPage: getListData(state.registry, registryKey).paginator.perPage,
    }),
  ),
)(PaginatorNew);
