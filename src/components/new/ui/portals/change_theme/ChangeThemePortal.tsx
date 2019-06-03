import * as React from 'react';

import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import EtsBootstrap from '../../@bootstrap';
import { EtsThemeContext } from '../../@bootstrap/EtsThemeProvider';
import etsThemes from 'components/new/ui/@bootstrap/@themes/etsThemes';
import { ExtField } from 'components/ui/new/field/ExtField';

type ChangeThemePortalProps = {
  onClose: () => any;
};

const options = Object.keys(etsThemes).map(
  (key) => ({
    value: key,
    label: key,
  }),
);

const ChangeThemePortal: React.FC<ChangeThemePortalProps> = React.memo(
  (props) => {
    const context = React.useContext(EtsThemeContext);

    useEscapeEvent(props.onClose);

    return (
      <EtsBootstrap.ModalContainer id="modal_change_theme" onHide={props.onClose} show>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>
            Выбор темы
          </EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <EtsBootstrap.ModalBody>
          <ExtField
            type="select"
            label="Темы"
            options={options}
            value={context.themeName}
            clearable={false}
            onChange={context.changeThemeName}
          />
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <div>
            <EtsBootstrap.Button onClick={props.onClose}>Закрыть</EtsBootstrap.Button>
          </div>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default ChangeThemePortal;
