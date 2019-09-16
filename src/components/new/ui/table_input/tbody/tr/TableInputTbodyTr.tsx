import * as React from 'react';
import { get } from 'lodash';

import { TableMeta } from '../../TableInput';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import TableInputTbodyTrTd from './td/TableInputTbodyTrTd';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

export type TableInputTbodyTrProps = {
  meta: TableMeta<any>[];
  rowData: any;
  errors: any;
  onChange: any;
  rowIndex: number;
  isSelected: boolean;
  setSelectedRowIndex: (indexRow: number) => any;
  disabled?: boolean;

  formDataKey?: FormKeys;
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
      <EtsTrTbody enable isSelected={props.isSelected} onClick={handleRowClick} registryKey="">
        {
          props.meta.map((metaData) => (
            metaData.ReactComponentType
              ? (
                <EtsTbodyTrTd alignCenter={metaData.format === 'boolean'}>
                  <metaData.ReactComponentType key={metaData.key} formDataKey={props.formDataKey} indexRow={props.rowIndex} />
                </EtsTbodyTrTd>
              )
              : (
                <TableInputTbodyTrTd
                  key={metaData.key}
                  meta={props.meta}
                  metaData={metaData}
                  rowData={props.rowData}
                  value={props.rowData[metaData.key]}
                  error={get(props.errors, metaData.key, '')}
                  onChange={handleChange}
                  disabled={props.disabled}
                />
              )
          ))
        }
      </EtsTrTbody>
    );
  },
);

export default TableInputTbodyTr;
