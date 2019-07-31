import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { ExtField } from 'components/old/ui/new/field/ExtField';

type ControlItemStateProps = {
};
type ControlItemDispatchProps = {
};
type ControlItemOwnProps = {
  fieldData: ValuesOf<OneRegistryData['list']['meta']['fields']>;
  onChange: (fieldData: ValuesOf<OneRegistryData['list']['meta']['fields']>) => any;
};
type ControlItemMergedProps = (
  ControlItemStateProps
  & ControlItemDispatchProps
  & ControlItemOwnProps
);
type ControlItemProps = ControlItemMergedProps;

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

export default connect<ControlItemStateProps, ControlItemDispatchProps, ControlItemOwnProps, ReduxState>(
  null,
)(ControlItem);
