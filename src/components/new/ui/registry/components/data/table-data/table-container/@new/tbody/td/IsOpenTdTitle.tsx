import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';

type Props = CommontTdTiteProps;

const IsOpenTdTitle: React.FC<Props> = React.memo(
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
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
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
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default IsOpenTdTitle;
