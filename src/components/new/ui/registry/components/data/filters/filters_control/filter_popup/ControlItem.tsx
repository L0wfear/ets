import * as React from 'react';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { isString } from 'util';

type ControlItemProps = {
  fieldData: ValuesOf<OneRegistryData['filter']['fields']>;
  onChange: (fieldData: string) => void;
};

const ControlItem: React.FC<ControlItemProps> = ({fieldData, onChange}) => {
  const handleChange = React.useCallback(
    () => {
      onChange(fieldData.valueKey);
    },
    [onChange, fieldData.valueKey],
  );

  const label = React.useMemo(() => {
    return (
      typeof fieldData.title === 'string'
        ? fieldData.title
        : fieldData.title[0].title
    );
  }, [fieldData.title]);

  const canRender = React.useMemo(
    () => {
      return isString(label);
    },
    [label],
  );

  if (!canRender) {
    return null;
  }

  return (
    <ExtField
      type="boolean"
      label={label}
      onChange={handleChange}
      value={!fieldData.hidden}
      className="checkbox-input flex-reverse"
    />
  );
};

export default ControlItem;
