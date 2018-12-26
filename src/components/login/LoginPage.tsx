import * as React from 'react';
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
} from 'components/login/styled/styled';
import SnowStorm from 'react-snowstorm';

class LoginPage extends React.PureComponent<any, any> {
  state = {
    login: '',
    password: '',
  };

  onSigninClick = (e) => {
    e.preventDefault();
    const { login, password } = this.state;
    const user = {
      login,
      password,
    };

    this.props.login(user).then(({ payload }) => {
      this.props.loadData();
      if (payload.permissions.includes('role.change')) {
        this.props.history.push('/change-company');
      } else {
        this.props.history.push(`/${payload.default_path}`);
      }
    })
    .catch(() => {
      //
    });
  }

  handleChangeLogin = ({ target: { value } }) => {
    this.setState({
      login: value,
    });
  }

  handleChangePassword = ({ target: { value } }) => {
    this.setState({
      password: value,
    });
  }

  render() {
    const { login, password } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <LoginPageContainer>
        <SnowStorm followMouse={false} />
        <LoginPageFormWrap>
          <LoginPageForm id="form-login" onSubmit={this.onSigninClick}>
            <LoginPageFormContainer>
              <LoginPageFormHeader>ЕТС</LoginPageFormHeader>
              <LoginPageFormContent>
                <LoginPageFormContentLabel>Система мониторинга</LoginPageFormContentLabel>
                <LoginPageFormContentInput id="login" type="text" className="form-control" placeholder="Логин" value={login} onChange={this.handleChangeLogin} />
                <LoginPageFormContentInput id="password" type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.handleChangePassword} />
                <LoginPageFormContentButton id="submit" disabled={disabled} type="submit">Войти</LoginPageFormContentButton>
                <TpMessangeContainer>
                  <span>
                  Служба технической поддержки
                  </span>
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

export default withRouter(LoginPage);
