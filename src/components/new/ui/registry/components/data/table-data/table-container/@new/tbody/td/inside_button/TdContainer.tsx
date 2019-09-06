import * as React from 'react';
import { isString } from 'util';

import { EtsTbodyScrollContainer, EtsTbodyTextContainer, EtsTdInnerWrapper } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type Props = {
  registryKey: string;
  value: string | number | React.ReactNode;
  isSelected: boolean;
};

const TdContainer: React.FC<Props> = React.memo(
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
                    if (shortTest.length >= 300) {
                      text = `${shortTest} ...`;
                    }

                  }
                  if (text.length > 300) {
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
      [ props.value, showAll, isSelected ],
    );

    const handleClick = React.useCallback(
      () => {
        if ( !isSelected ) {
          setShowAll(false);
        } else {
          setShowAll(!showAll);
        }
      },
      [isSelected, showAll],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td onClick={handleClick}>
        <EtsTdInnerWrapper>
          {value}
        </EtsTdInnerWrapper>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default TdContainer;
