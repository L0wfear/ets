import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export type AdditionalFiled = {
  field_name: string;
  field_val: string;
 }

export const validationSchema: SchemaType<
  AdditionalFiled,
  any
> = {
  properties: {
    field_name: {
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    field_val: {
      title: 'Значение',
      type: 'string',
      required: true,
    },
  },
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'field_name',
      displayName: 'Наименование',
      type: 'string',
      cssClassName: 'width200',
    },
    {
      name: 'field_val',
      displayName: 'Значение',
      type: 'string',
      cssClassName: 'width200',
    },
  ],
};

type IPropsAdditionalFiledRenderer = {} & IPropsDataTableInputRenderer;

const FieldNameRenderer: React.FC<IPropsAdditionalFiledRenderer> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
}) => {

  const handleChange = (key, value) => {
    onChange(index, key, value);
  };

  return (
    <ExtField
      type="string"
      label={false}
      value={value}
      error={get(outputListErrors[index], 'field_name', '')}
      onChange={handleChange}
      disabled={!isPermitted}
      boundKeys='field_name'
    />
  );
};

const FieldValueRenderer: React.FC<IPropsAdditionalFiledRenderer> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
}) => {

  const handleChange = (key, value) => {
    onChange(index, key, value);
  };

  return (
    <ExtField
      type="string"
      label={false}
      value={value}
      error={get(outputListErrors[index], 'field_val', '')}
      onChange={handleChange}
      disabled={!isPermitted}
      boundKeys='field_val'
    />
  );
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    field_name: (rowMeta) => (
      <FieldNameRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    field_val: (rowMeta) => (
      <FieldValueRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
  };
};
