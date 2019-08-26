import * as React from 'react';

import StringField from 'components/@next/@ui/renderFields/StringField/StringField';
import TextAreaField from 'components/@next/@ui/renderFields/TextAreaField/TextAreaField';
import CheckBoxField from 'components/@next/@ui/renderFields/CheckBoxField/CheckBoxField';
import NumberField from 'components/@next/@ui/renderFields/NumberField/NumberField';
import DateField from 'components/@next/@ui/renderFields/DateField/DateField';
import FileField from 'components/@next/@ui/renderFields/FileField/FileField';
import SelectField from 'components/@next/@ui/renderFields/SelectField/SelectField';
import { ExtFieldType } from 'components/old/ui/new/field/ExtField';

const Field: React.FC<ExtFieldType> = React.memo(
  (props) => {
    switch (props.type) {
      case 'string':
        return <StringField {...props} />;
      case 'text':
        return <TextAreaField {...props} />;
      case 'select':
        return <SelectField {...props}/>;
      case 'date':
        return <DateField {...props} />;
      case 'file':
        return <FileField {...props} />;
      case 'number':
        return <NumberField {...props}/>;
      case 'boolean':
        return <CheckBoxField {...props}/>;
      default:
        return null;
    }
  },
);

export default Field;
