import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { Flex } from 'global-styled/global-styled';

type PropsFieldIsMain = {
  value: string | void;
  error: string;
  onChange: (obj: { [key: string]: any; }) => any;
};

class FieldIsMain extends React.PureComponent<PropsFieldIsMain, {}> {
  handleChange: React.KeyboardEventHandler<HTMLInputElement> = ({ currentTarget: { value } }) => {
    this.props.onChange({
      name: value,
    });
  };

  render() {
    const { props } = this;

    return (
      <Flex grow={1} shrink={1} basis={150}>
        <ExtField
          id="name"
          type="string"
          label="Название маршрута"
          value={props.value}
          error={props.error}
          onChange={this.handleChange}
        />
      </Flex>
    );
  }
}

export default FieldIsMain;
