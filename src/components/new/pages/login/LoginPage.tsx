import * as React from 'react';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import {
  LoginPageContainer,
  LoginPageFormWrap,
  LoginPageForm,
  LoginPageFormHeader,
  LoginPageFormContent,
  DitLogo,
  LoginPageFormContentLabel,
  LoginPageFormContentButton,
  HrLine,
  TpMessangeContainer,
} from 'components/new/pages/login/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import FieldLogin from './fields/FieldLogin';
import FieldPassword from './fields/FieldPassword';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { sessionLogin } from 'redux-main/reducers/modules/session/actions-session';

type LoginPageStateProps = {};
type LoginPageDispatchProps = {
  loginUser: HandleThunkActionCreator<typeof sessionLogin>;
};
type LoginPageOwnProps = {};

type LoginPageProps = (
  LoginPageStateProps
  & LoginPageDispatchProps
  & LoginPageOwnProps
  & WithSearchProps
);

const LoginPage: React.FC<LoginPageProps> = React.memo(
  (props) => {
    const [inLoadingStatus, setInLoadingStatus] = React.useState(false);
    const [user, setUser] = React.useState({ login: '', password: '' });

    const handleChange = React.useCallback(
      (objChange) => {
        setUser(
          (oldState) => ({
            ...oldState,
            ...objChange,
          }),
        );
      },
      [],
    );

    const onSigninClick = React.useCallback(
      async (e) => {
        e.preventDefault();
        setInLoadingStatus(true);
        try {
          const userData = await props.loginUser(
            user,
            { page: 'main' },
          );

          if (userData.isGlavControl) {
            props.history.push('/change-company');
          }
        } catch (e) {
          //
        }
        setInLoadingStatus(false);
      },
      [user],
    );

    const disabled = !user.login || !user.password;

    return (
      <LoginPageContainer>
        <LoginPageFormWrap>
          <LoginPageForm id="form-login" onSubmit={onSigninClick}>
            <LoginPageFormHeader>ЕТС</LoginPageFormHeader>
            <LoginPageFormContent>
              <LoginPageFormContentLabel>
                Система мониторинга
              </LoginPageFormContentLabel>
              <FieldLogin
                login={user.login}
                handleChange={handleChange}
                disabled={inLoadingStatus}
              />
              <FieldPassword
                password={user.password}
                handleChange={handleChange}
                disabled={inLoadingStatus}
              />
              <LoginPageFormContentButton
                block
                id="submit"
                disabled={disabled || inLoadingStatus}
                type="submit"
              >
                <span>Войти</span>
              </LoginPageFormContentButton>
              <TpMessangeContainer>
                <span>Служба технической поддержки</span>
                <a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
                <a href="tel:84951501193">8(495) 150-11-93</a>
              </TpMessangeContainer>
              <HrLine />
              <DitLogo />
            </LoginPageFormContent>
          </LoginPageForm>
        </LoginPageFormWrap>
      </LoginPageContainer>
    );
  },
);

export default compose<LoginPageProps, LoginPageOwnProps>(
  connect<LoginPageStateProps, LoginPageDispatchProps, LoginPageOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      loginUser: (...arg) => (
        dispatch(
          sessionLogin(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(LoginPage);
