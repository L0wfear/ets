import * as React from 'react';
import * as BootstrapModal from 'react-bootstrap/lib/Modal';
import * as cx from 'classnames';
import { isNumber } from 'util';

const EtsModal: React.FunctionComponent<
  BootstrapModal.ModalProps & { deepLvl?: number }
> = (props) => {
  const { deepLvl, ...modalProps } = props;

  return (
    <BootstrapModal
      {...modalProps}
      bsClass={cx(
        { [`bs_deep_${deepLvl}`]: isNumber(deepLvl) },
        modalProps.backdropClassName || 'modal',
      )}
      backdropClassName={cx(modalProps.backdropClassName, {
        [`backdrop_deep_${deepLvl}`]: isNumber(deepLvl),
      })}
    />
  );
};

export default EtsModal;
