import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Flex } from 'global-styled/global-styled';

type PropsFieldIsMain = {
  value: boolean;
  disabled: boolean;
  onChange: (obj: { [key: string]: any }) => any;
};

class FieldIsMain extends React.PureComponent<PropsFieldIsMain, {}> {
  handleChange = () => {
    this.props.onChange({
      is_main: !this.props.value,
    });
  }

  render() {
    const { props } = this;

    return (
      <Flex grow={1} shrink={1}>
        <ExtField
          type="boolean"
          label="Основной маршрут"
          value={props.value}
          onChange={this.handleChange}
          disabled={props.disabled}
          className="checkbox-input flex-reverse"
        />
      </Flex>
    );
  }
}

export default FieldIsMain;
