import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { get } from 'lodash';
import { Glyphicon } from 'react-bootstrap';

type PropsTrTdIsOpen = {
  rowData: ValuesOf<OneRegistryData['list']['processed']['processedArray']>;
};

const TrTdIsOpen: React.FC<PropsTrTdIsOpen> = React.memo(
  (props) => {
    const is_open = React.useMemo(
      () => {
        const children = get(props.rowData, 'children', null);

        if (!children || !children.length) {
          return null;
        }

        return Boolean(props.rowData.is_open);
      },
      [props.rowData],
    );

    return (
      <EtsTbodyTrTd>
        {
          is_open === true
            && (
              <Glyphicon glyph="triangle-bottom" />
            )
        }
        {
          is_open === false
            && (
              <Glyphicon glyph="triangle-right" />
            )
        }
        {
          props.rowData.parent_id
            && (
              <Glyphicon glyph="minus" />
            )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default TrTdIsOpen;
