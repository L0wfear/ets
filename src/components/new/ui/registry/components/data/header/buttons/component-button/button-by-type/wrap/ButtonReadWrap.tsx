import * as React from 'react';
import ButtonRead from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonRead';

type Props = {
  registryKey: string;
  onClick: (item: any) => any;
};

const ButtonReadWrap: React.FC<Props> = React.memo(
  (props) => {

    return (
      <ButtonRead onClick={props.onClick} registryKey={props.registryKey} />
    );
  },
);

export default ButtonReadWrap;
