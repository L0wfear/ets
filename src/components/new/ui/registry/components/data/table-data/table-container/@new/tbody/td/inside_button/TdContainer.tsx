import * as React from 'react';
import { isString } from 'util';

import { EtsTbodyScrollContainer, EtsTbodyTextContainer, EtsTdInnerWrapper } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type TdContainerProps = {
  registryKey: string;
  value: string | number | React.ReactNode;
  isSelected: boolean;
  id: string;
  isHorizontalSticky: boolean;
  max_size_to_scroll: number;
};

const TdContainer: React.FC<TdContainerProps> = React.memo(
  (props) => {
    const [showAll, setShowAll] = React.useState(false);

    const {
      isSelected,
    } = props;

    const value = React.useMemo(
      () => {
        let valueRaw = props.value;

        if (isString(props.value)) {
          valueRaw = (
            props.value
              .split('\n')
              .map(
                (oneLineComment, i) => {
                  let text = oneLineComment;
                  if (!showAll || !isSelected) {
                    const shortTest = (isString(props.value) ? props.value : '').slice(0, 300);
                    if (text.length >= 300) {
                      text = `${shortTest} ...`;
                    }
                  }

                  if (text.length > props.max_size_to_scroll) {
                    return (
                      <EtsTbodyScrollContainer key={i}>{text}</EtsTbodyScrollContainer>
                    );
                  } else {
                    return (
                      <EtsTbodyTextContainer key={i}>{text}</EtsTbodyTextContainer>
                    );
                  }
                },
              )
          );
        }

        return valueRaw;
      },
      [props.value, showAll, isSelected, props.max_size_to_scroll],
    );

    React.useEffect(
      () => {
        if (!isSelected && showAll) {
          setShowAll(false);
        }
      },
      [isSelected, showAll],
    );

    const handleClick = React.useCallback(
      () => {
        if (!isSelected) {
          setShowAll(false);
        } else {
          setShowAll((state) => !state);
        }
      },
      [isSelected],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td onClick={handleClick} id={props.id} isHorizontalSticky={props.isHorizontalSticky} isSelected={isSelected}>
        <EtsTdInnerWrapper>
          {value}
        </EtsTdInnerWrapper>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default TdContainer;
