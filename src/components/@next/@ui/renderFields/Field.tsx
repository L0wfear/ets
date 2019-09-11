import * as React from 'react';

import StringField from 'components/@next/@ui/renderFields/StringField/StringField';
import TextAreaField from 'components/@next/@ui/renderFields/TextAreaField/TextAreaField';
import CheckBoxField from 'components/@next/@ui/renderFields/CheckBoxField/CheckBoxField';
import NumberField from 'components/@next/@ui/renderFields/NumberField/NumberField';
import DateField from 'components/@next/@ui/renderFields/DateField/DateField';
import FileField from 'components/@next/@ui/renderFields/FileField/FileField';
import SelectField from 'components/@next/@ui/renderFields/SelectField/SelectField';
import { ExtFieldType, ExtFieldTypeByKey } from 'components/old/ui/new/field/ExtField';

const ComponentByType: { [K in keyof ExtFieldTypeByKey]: React.ComponentType<ExtFieldTypeByKey[K]> } = {
  string: StringField,
  text: TextAreaField,
  select: SelectField,
  date: DateField,
  file: FileField,
  number: NumberField,
  boolean: CheckBoxField,
};

const Field: React.FC<ExtFieldType> = React.memo(
  (props) => {
    const Component = ComponentByType[props.type] || ComponentByType.string;

    return (
      <Component {...props as any} />
    );
  },
);

export default Field;
