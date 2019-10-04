import * as React from 'react';
import { TableMeta } from '../TableInput';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type TableInputTheadProps = {
  meta: TableMeta<any>[];
};

const TableInputThead: React.FC<TableInputTheadProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Thead>
        <EtsBootstrap.Grid.GridBootstrapThead.Tr>
          {
            props.meta.map((metaData) => (
              <EtsBootstrap.Grid.GridBootstrapThead.Th
                key={metaData.key}
                canClick={false}
                width={metaData.width}
              >
                {metaData.title}
                {' '}
                {
                  Boolean(metaData.titlePopup) && (
                    <EtsBootstrap.OverlayTrigger
                      trigger={['hover', 'focus']}
                      overlay={(
                        <EtsBootstrap.Popover>
                          {metaData.titlePopup}
                        </EtsBootstrap.Popover>
                      )}
                      placement="top"
                    >
                      <EtsBootstrap.Glyphicon glyph="info-sign"/>
                    </EtsBootstrap.OverlayTrigger>
                  )
                }
              </EtsBootstrap.Grid.GridBootstrapThead.Th>
            ))
          }
        </EtsBootstrap.Grid.GridBootstrapThead.Tr>
      </EtsBootstrap.Grid.GridBootstrapThead.Thead>
    );
  },
);

export default TableInputThead;
