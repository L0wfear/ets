import * as React from 'react';
import { get } from 'lodash';
import { isArray } from 'util';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { TableMeta } from 'components/new/ui/table_input/TableInput';

export type TableInputTbodyTrTdProps = {
  meta: Array<TableMeta<any>>;
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
      (valueRaw, option?) => {
        let value = get(valueRaw, 'target.value', valueRaw);

        if( metaData.format === 'number' || metaData.format === 'toFixed3' ) {
          value = value ? Number(value) : null;
        }

        if (metaData.onChange) {
          metaData.onChange(props.onChange)(valueRaw, option);
        } else {
          props.onChange(
            metaData.key,
            value,
          );
        }
      },
      [metaData.onChange, metaData.key, metaData.format, props.onChange],
    );

    React.useEffect(
      () => {
        if (isArray(props.metaData.resetIf)) {
          return props.metaData.resetIf.forEach((resetData) => {
            if (resetData.type === 'compare_with_value_in_option') {
              const localMetaData = props.meta.find(({ key }) => key === resetData.path_to_option);
              if (localMetaData) {
                const options = get(localMetaData, 'options', []);
                const selectedItem = options.find(({ value }) => value === get(props.rowData, resetData.path_to_option, null));
                if (selectedItem) {
                  if (get(selectedItem, `rowData.${resetData.compareItemPath}`, null) === resetData.match && props.value) {
                    handleChange(null);
                  }
                }
              }
            }
          });
        }
      },
      [props.metaData.resetIf, props.rowData, props.meta, handleChange, props.value],
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
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
        {
          metaData.format === 'number' || metaData.format === 'toFixed3'
            && (
              <ExtField
                type="number"
                id={props.metaData.key}
                label={false}
                value={props.value}
                error={props.error}
                onChange={handleChange}
                disabled={disabled || metaData.disabled || props.disabled}
                format={metaData?.format}
              />
            )
        }
        {
          metaData.format === 'select'
            && (
              <ExtField
                type="select"
                id={props.metaData.key}
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
        {
          metaData.format === 'date'
            && (
              <ExtField
                type="date"
                time={metaData.time}
                id={props.metaData.key}
                label={false}
                value={props.value}
                error={props.error}
                onChange={handleChange}
                disabled={disabled || metaData.disabled || props.disabled}
              />
            )
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default TableInputTbodyTrTd;
