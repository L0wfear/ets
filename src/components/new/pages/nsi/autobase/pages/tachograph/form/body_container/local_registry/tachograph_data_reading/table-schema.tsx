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
import { getDatePlusSomeMonths } from 'components/@next/@utils/dates/dates';

export const validationSchema: SchemaType<
  ValuesOf<TachographListWithOuterProps['tachograph_data_reading']>,
  any
> = {
  properties: {
    reading_fact_date: {
      title: 'Дата считывания данных (факт)',
      type: 'date',
      required: true,
    },
    reading_plan_date: {
      title: 'Дата считывания данных (план)',
      type: 'date',
      required: true,
    },
  },
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'reading_fact_date',
      displayName: 'Дата считывания данных (факт)',
      type: 'date',
      cssClassName: 'width200',
      filter: {
        type: 'advanced-date',
      }
    },
    {
      name: 'reading_plan_date',
      displayName: 'Дата считывания данных (план)',
      type: 'date',
      cssClassName: 'width200',
      filter: {
        type: 'advanced-date',
      }
    },
  ],
};

const ReadingFactDateRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors = [],
  isPermitted,
}) => {
  const handleChange = React.useCallback(
    (key, reading_fact_date) => {
      const reading_plan_date = getDatePlusSomeMonths(reading_fact_date, 3);
      const changeObj = {
        reading_plan_date,
        reading_fact_date,
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
      error={get(outputListErrors[index], 'reading_fact_date', '')}
      onChange={handleChange}
      boundKeys="reading_fact_date"
      disabled={!isPermitted}
      makeGoodFormat
    />
  );
};

const ReadingPlanDateRenderer: React.FC<IPropsDataTableInputRenderer> = ({
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
      boundKeys="reading_plan_date"
      disabled
      error={get(outputListErrors[index], 'reading_plan_date', '')}
      makeGoodFormat
    />
  );
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    reading_fact_date: (rowMeta) => (
      <ReadingFactDateRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    reading_plan_date: (rowMeta) => (
      <ReadingPlanDateRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
  };
};
