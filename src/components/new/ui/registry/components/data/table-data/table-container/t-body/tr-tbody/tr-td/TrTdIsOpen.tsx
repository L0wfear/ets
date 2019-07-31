import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
              <EtsBootstrap.Glyphicon glyph="triangle-bottom" />
            )
        }
        {
          is_open === false
            && (
              <EtsBootstrap.Glyphicon glyph="triangle-right" />
            )
        }
        {
          props.rowData.parent_id
            && (
              <EtsBootstrap.Glyphicon glyph="minus" />
            )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default TrTdIsOpen;
