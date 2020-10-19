import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';

import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { getDatePlusSomeYears } from 'components/@next/@utils/dates/dates';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

export const validationSchema: SchemaType<
  ValuesOf<TachographListWithOuterProps['tachograph_replacement_skzi']>,
  any
> = {
  properties: {
    replacement_date: {
      title: 'Дата замены',
      type: 'date',
      required: true,
    },
    replacement_reason_id: {
      title: 'Причина замены',
      type: 'number',
      required: true,
    },
    next_replacement_date: {
      title: 'Дата следующей замены (план)',
      type: 'date',
      required: true,
    }
  },
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'replacement_date',
      displayName: 'Дата замены',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'replacement_reason_id',
      displayName: 'Причина замены',
      type: 'select',
      cssClassName: 'width200',
    },
    {
      name: 'next_replacement_date',
      displayName: 'Дата следующей замены (план)',
      type: 'date',
      cssClassName: 'width150',
    },
  ],
};

const ReplacementDateRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors = [],
  isPermitted,
}) => {

  const handleChange = React.useCallback(
    (key, replacement_date) => {
      const next_replacement_date = getDatePlusSomeYears(replacement_date, 3);
      const changeObj = {
        replacement_date,
        next_replacement_date,
      };
      onChange(index, changeObj);
      
    },
    [index]
  );

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      error={get(outputListErrors[index], 'replacement_date', '')}
      onChange={handleChange}
      boundKeys="replacement_date"
      disabled={!isPermitted}
      makeGoodFormat
    />
  );
};

const ReplacementReasonRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
}) => {

  const handleChange = (valueNew, option) => {
    onChange(index, {
      replacement_reason_id: valueNew,
    });
  };
  const tachographReplacementSkziReasonListOptions = etsUseSelector(
    (state) => state.autobase.tachographReplacementSkziReasonList
  ).map((el) => ({ value: el.id, label: el.name }));

  return (
    <ExtField
      type="select"
      label={false}
      options={tachographReplacementSkziReasonListOptions}
      value={value}
      error={get(outputListErrors[index], 'replacement_reason_id', '')}
      onChange={handleChange}
      disabled={!isPermitted}
    />
  );
};

const NextReplacementDateRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors = [],
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index]
  );

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      onChange={handleChange}
      boundKeys="next_replacement_date"
      disabled
      error={get(outputListErrors[index], 'next_replacement_date', '')}
      makeGoodFormat
    />
  );
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    replacement_date: (rowMeta) => (
      <ReplacementDateRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    replacement_reason_id: (rowMeta) => (
      <ReplacementReasonRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    next_replacement_date: (rowMeta) => (
      <NextReplacementDateRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
  };
};
