import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import ModalTP from '../../modal_tp/ModalTP';
import { SupportContainer, SupportTextContainer } from './styled';

type SupportStateProps = {
  appConfig: InitialStateSession['appConfig'];
};
type SupportDispatchProps = DispatchProp;
type SupportOwnProps = {};
type SupportMergedProps = (
  SupportStateProps
  & SupportDispatchProps
  & SupportOwnProps
);
type SupportProps = SupportMergedProps;

const Support: React.FC<SupportProps> = React.memo(
  (props) => {
    const [showFormTp, setShowFormTp] = React.useState(false);
    const {
      appConfig: { footer_url },
    } = props;

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
            footer_url
              ? (
                <SupportTextContainer href={footer_url}>
                  {footer_url || '123123123'}
                </SupportTextContainer>
              ) : (
                <DivNone />
              )
          }
        </SupportContainer>
        <ModalTP show={showFormTp} onHide={setShowFormTpOnFalse} />
      </React.Fragment>
    );
  },
);

export default connect<SupportStateProps, SupportDispatchProps, SupportOwnProps, ReduxState>(
  (state) => ({
    appConfig: getSessionState(state).appConfig,
  }),
)(Support);
