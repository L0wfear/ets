import * as React from 'react';
import { isString } from 'util';

import { EtsTbodyTrTd, EtsTbodyScrollContainer, EtsTbodyTextContainer, EtsTdInnerWrapper } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ExtFieldType } from 'components/old/ui/new/field/ExtField';
import ExtFieldTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/ExtFieldTdTitle';

export type PropsTrTd = {
  registryKey: string;
  metaKey: string;
  value: any;
  selected: boolean;
  renderParams?: ExtFieldType;
  style?: any; // not use
};

const TrTd: React.FC<PropsTrTd> = React.memo(
  (props) => {
    const [showAll, setShowAll] = React.useState(false);

    const {
      selected,
    } = props;

    const value = React.useMemo(
      () => {
        let valueRaw = props.value;
        if (props.renderParams && selected) {
          return (
            <ExtFieldTdTitle
              renderParams={props.renderParams}
              registryKey={props.registryKey}
              metaKey={props.metaKey}
            />
          );
        }

        if (isString(valueRaw)) {
          valueRaw = (
            valueRaw
              .split('\n')
              .map(
                (oneLineComment, i) => {
                  let text = oneLineComment;

                  if (!showAll || !selected) {
                    const shortTest = valueRaw.slice(0, 300);
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
      [ props.value, showAll, selected ],
    );

    const handleClick = React.useCallback(
      () => {
        if ( !selected ) {
          setShowAll(false);
        } else {
          setShowAll(!showAll);
        }
      },
      [selected, showAll],
    );

    return (
      <EtsTbodyTrTd onClick={handleClick}>
        <EtsTdInnerWrapper>
          {value}
        </EtsTdInnerWrapper>
      </EtsTbodyTrTd>
    );
  },
);

export default TrTd;
