import * as React from 'react';
import { TableMeta } from '../../../TableInput';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { get } from 'lodash';
import { isArray } from 'util';

export type TableInputTbodyTrTdProps = {
  meta: TableMeta<any>[];
  metaData: TableMeta<any>;
  value: any;
  error: string;
  onChange: any;
  rowData: any;
  disabled?: boolean;
};

const TableInputTbodyTrTd: React.FC<TableInputTbodyTrTdProps> = React.memo(
  (props) => {
    const {
      metaData,
    } = props;

    const handleChange = React.useCallback(
      (valueRaw) => {
        let value = get(valueRaw, 'target.value', valueRaw);
        switch (metaData.format) {
          case 'number': {
            value = value ? Number(value) : null;
            break;
          }
        }

        props.onChange(
          metaData.key,
          value,
        );
      },
      [metaData.key, metaData.format, props.onChange],
    );

    const disabled = React.useMemo(
      () => {
        if (isArray(props.metaData.disabledIf)) {
          return props.metaData.disabledIf.some((disabledData) => {
            if (disabledData.type === 'compare_with_value_in_option') {
              const localMetaData = props.meta.find(({ key }) => key === disabledData.path_to_option);
              if (localMetaData) {
                const options = get(localMetaData, 'options', []);
                const selectedItem = options.find(({ value }) => value === get(props.rowData, disabledData.path_to_option, null));
                if (selectedItem) {
                  return get(selectedItem, `rowData.${disabledData.compareItemPath}`, null) === disabledData.match;
                }
              }
            }

            return false;
          });
        }
      },
      [props.metaData.disabledIf, props.rowData, props.meta],
    );

    return (
      <EtsTbodyTrTd>
        {
          metaData.format === 'number'
            && (
              <ExtField
                type="number"
                label={false}
                value={props.value}
                error={props.error}
                onChange={handleChange}
                disabled={disabled || metaData.disabled || props.disabled}
              />
            )
        }
        {
          metaData.format === 'select'
            && (
              <ExtField
                type="select"
                label={false}
                value={props.value}
                error={props.error}
                options={metaData.options}
                onChange={handleChange}
                placeholder={metaData.placeholder}
                disabled={disabled || metaData.disabled || props.disabled}
              />
            )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default TableInputTbodyTrTd;
