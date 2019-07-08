import * as React from 'react';
import { EtsTbodyTrTd, EtsTbodyScrollContainer } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { isString } from 'util';

export type PropsTrTd = {
  registryKey: string;
  rowData: any;
  metaKey: string;
  value: any;
  selected: boolean;

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
                    return (
                      <div key={i}>{text}</div>
                    );
                  }

                  return (
                    <EtsTbodyScrollContainer key={i}>{text}</EtsTbodyScrollContainer>
                  );
                },
              )
          );
        }

        return valueRaw;
      },
      [props.value, showAll, selected],
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
      <EtsTbodyTrTd onClick={handleClick}>{value}</EtsTbodyTrTd>
    );
  },
);

export default TrTd;
