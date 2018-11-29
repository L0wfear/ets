
import * as React from 'react';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

import ButtonExport from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonExport';
import ButtonToggleFilter from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonToggleFilter';
import ButtonRead from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonRead';

type PropsComponentButton = {
  type: string;
  data: any;
  registryKey: string;
};

class ComponentButton extends React.Component<PropsComponentButton, {}> {
  render() {
    const { type } = this.props;

    if (type === buttonsTypes.export) {
      return (
        <ButtonExport registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.filter) {
      return (
        <ButtonToggleFilter registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.read) {
      return (
        <ButtonRead registryKey={this.props.registryKey} />
      );
    }
    return <div>none_type</div>;

  }
}

export default ComponentButton;
