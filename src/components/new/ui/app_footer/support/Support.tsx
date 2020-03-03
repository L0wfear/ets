import * as React from 'react';

import { getSessionState } from 'redux-main/reducers/selectors';
import ModalTP from 'components/new/ui/modal_tp/ModalTP';
import { SupportContainer, SupportTextContainer } from './styled';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
type Props = OwnProps & {};

const Support: React.FC<Props> = React.memo(
  () => {
    const [showFormTp, setShowFormTp] = React.useState(false);
    const appConfig = etsUseSelector((state) => getSessionState(state).appConfig);

    const {
      footer_url,
    } = appConfig;

    const setShowFormTpOnTrue = React.useCallback(
      () => {
        setShowFormTp(true);
      },
      [],
    );
    const setShowFormTpOnFalse = React.useCallback(
      () => {
        setShowFormTp(false);
      },
      [],
    );

    return (
      <React.Fragment>
        <SupportContainer>
          <SupportTextContainer color="red" onClick={setShowFormTpOnTrue}>
            Техническая поддержка
          </SupportTextContainer>
          {
            Boolean(footer_url) && (
              <SupportTextContainer href={footer_url}>
                {footer_url || '123123123'}
              </SupportTextContainer>
            )
          }
        </SupportContainer>
        <ModalTP show={showFormTp} onHide={setShowFormTpOnFalse} />
      </React.Fragment>
    );
  },
);

export default Support;
