import * as React from 'react';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { isString } from 'util';

type ControlItemProps = {
  fieldData: ValuesOf<OneRegistryData['list']['meta']['fields']>;
  onChange: (fieldData: ValuesOf<OneRegistryData['list']['meta']['fields']>) => any;
};

const ControlItem: React.FC<ControlItemProps> = (props) => {
  const handleChange = React.useCallback(
    (event) => {
      props.onChange({
        ...props.fieldData,
        hidden: !event.target.checked,
      });
    },
    [props.onChange, props.fieldData],
  );

  const canRender = React.useMemo(
    () => {
      return isString(props.fieldData.title);
    },
    [props.fieldData.title],
  );

  if (!canRender) {
    return null;
  }

  return (
    <ExtField
      type="boolean"
      label={props.fieldData.title}
      onChange={handleChange}
      value={!props.fieldData.hidden}
      className="checkbox-input flex-reverse"
    />
  );
};

export default ControlItem;
