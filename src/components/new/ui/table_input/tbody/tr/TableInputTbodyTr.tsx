import * as React from 'react';
import { get } from 'lodash';

import TableInputTbodyTrTd from './td/TableInputTbodyTrTd';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TableMeta } from 'components/new/ui/table_input/TableInput';
import { isObject } from 'util';

export type TableInputTbodyTrProps = {
  meta: Array<TableMeta<any>>;
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
        if (isObject(key)) {
          props.onChange(
            props.rowIndex,
            {
              ...props.rowData,
              ...key,
            },
          );
        } else {
          props.onChange(
            props.rowIndex,
            {
              ...props.rowData,
              [key]: value,
            },
          );
        }
      },
      [props.rowData, props.rowIndex, props.onChange],
    );
    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Tr enable isSelected={props.isSelected} onClick={handleRowClick} registryKey="">
        {
          props.meta.map((metaData) => (
            metaData.ReactComponentType
              ? (
                <EtsBootstrap.Grid.GridBootstrapTbody.Td key={metaData.key} alignCenter={metaData.format === 'boolean'}>
                  <metaData.ReactComponentType key={metaData.key} formDataKey={props.formDataKey} indexRow={props.rowIndex} />
                </EtsBootstrap.Grid.GridBootstrapTbody.Td>
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
      </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
    );
  },
);

export default TableInputTbodyTr;
