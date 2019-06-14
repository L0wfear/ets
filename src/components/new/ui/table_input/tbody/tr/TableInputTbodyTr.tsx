import * as React from 'react';
import { get } from 'lodash';

import { TableMeta } from '../../TableInput';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import TableInputTbodyTrTd from './td/TableInputTbodyTrTd';

export type TableInputTbodyTrProps = {
  meta: TableMeta<any>[];
  rowData: any;
  errors: any;
  onChange: any;
  rowIndex: number;
  isSelected: boolean;
  setSelectedRowIndex: (indexRow: number) => any;
  disabled?: boolean;
};

const TableInputTbodyTr: React.FC<TableInputTbodyTrProps> = React.memo(
  (props) => {
    const handleRowClick = React.useCallback(
      () => {
        props.setSelectedRowIndex(props.rowIndex);
      },
      [props.rowIndex, props.setSelectedRowIndex],
    );
    const handleChange = React.useCallback(
      (key, value) => {
        props.onChange(
          props.rowIndex,
          {
            ...props.rowData,
            [key]: value,
          },
        );
      },
      [props.rowData, props.rowIndex, props.onChange],
    );
    return (
      <EtsTrTbody enable selected={props.isSelected} onClick={handleRowClick}>
        {
          props.meta.map((metaData) => (
            <TableInputTbodyTrTd
              meta={props.meta}
              metaData={metaData}
              rowData={props.rowData}
              value={props.rowData[metaData.key]}
              error={get(props.errors, metaData.key, '')}
              onChange={handleChange}
              disabled={props.disabled}
            />
          ))
        }
      </EtsTrTbody>
    );
  },
);

export default TableInputTbodyTr;
