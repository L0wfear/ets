import * as React from 'react';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { isString } from 'util';
import { useLocation } from 'react-router';

type ControlItemProps = {
  fieldData: ValuesOf<OneRegistryData['filter']['fields']>;
  onChange: (key: string, locationSearch: string) => void;
};

const ControlItem: React.FC<ControlItemProps> = ({fieldData, onChange}) => {
  const locationSearch = useLocation().search;
  const handleChange = React.useCallback(
    () => {
      onChange(fieldData.valueKey, locationSearch);
    },
    [onChange, fieldData.valueKey, locationSearch],
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
