import * as React from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import {
  LoginPageContainer,
  LoginPageFormWrap,
  LoginPageForm,
  LoginPageFormContainer,
  LoginPageFormHeader,
  LoginPageFormContent,
  DitLogo,
  LoginPageFormContentLabel,
  LoginPageFormContentInput,
  LoginPageFormContentButton,
  HrLine,
  TpMessangeContainer,
} from 'components/new/pages/login/styled/styled';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { sessionLogin } from 'redux-main/reducers/modules/session/actions-session';

class LoginPage extends React.PureComponent<any, any> {
  state = {
    login: '',
    password: '',
  };

  onSigninClick = async (e) => {
    e.preventDefault();
    const { login, password } = this.state;
    const user = {
      login,
      password,
    };

    try {
      const { userData } = await this.props.sessionLogin(user);

      if (userData.isGlavControl) {
        this.props.history.push('/change-company');
      }
    } catch (e) {
      //
    }
  };

  handleChangeLogin = (event) => {
    this.setState({
      login: get(event, ['target', 'value'], event),
    });
  };

  handleChangePassword = (event) => {
    this.setState({
      password: get(event, ['target', 'value'], event),
    });
  };

  render() {
    const { login, password } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <LoginPageContainer>
        <LoginPageFormWrap>
          <LoginPageForm id="form-login" onSubmit={this.onSigninClick}>
            <LoginPageFormContainer>
              <LoginPageFormHeader>ЕТС</LoginPageFormHeader>
              <LoginPageFormContent>
                <LoginPageFormContentLabel>
                  Система мониторинга
                </LoginPageFormContentLabel>
                <LoginPageFormContentInput
                  id="login"
                  type="text"
                  className="form-control"
                  placeholder="Логин"
                  value={login}
                  onChange={this.handleChangeLogin}
                />
                <LoginPageFormContentInput
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Пароль"
                  value={password}
                  onChange={this.handleChangePassword}
                />
                <LoginPageFormContentButton
                  id="submit"
                  disabled={disabled}
                  type="submit">
                  Войти
                </LoginPageFormContentButton>
                <TpMessangeContainer>
                  <span>Служба технической поддержки</span>
                  <a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
                  <a href="tel:84951501193">8(495) 150-11-93</a>
                </TpMessangeContainer>
                <HrLine />
                <DitLogo />
              </LoginPageFormContent>
            </LoginPageFormContainer>
          </LoginPageForm>
        </LoginPageFormWrap>
      </LoginPageContainer>
    );
  }
}

export default compose<any, any>(
  withRouter,
  connect<any, any, any, ReduxState>(
    null,
    (dispatch) => ({
      sessionLogin: (user) => dispatch(sessionLogin(user, { page: 'any' })),
    }),
  ),
)(LoginPage);
