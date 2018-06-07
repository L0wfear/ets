import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';

@autobind
export default class LoginPage extends Component {

  static get contextTypes() {
    return {
      flux: PropTypes.object.isRequired,
      history: PropTypes.object,
      loadData: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
  }

  onSigninClick(e) {
    e.preventDefault();
    const { login, password } = this.state;
    const { flux } = this.context;
    const user = {
      login,
      password,
    };

    flux.getActions('session').login(user).then(({ payload }) => {
      this.context.loadData();
      if (payload.permissions.includes('role.change')) {
        this.context.history.pushState(null, '/change-company');
      } else if (['dispatcher', 'master'].indexOf(payload.role) > -1 && payload.okrug_id === null) {
        this.context.history.pushState(null, '/dashboard');
      } else {
        this.context.history.pushState(null, '/monitor');
      }
    });
  }

  handleChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    this.setState({
      [field]: value,
    });
  }

  render() {
    const { login, password } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <form id="form-login" onSubmit={this.onSigninClick}>
        <div className="form-signin">
          <div className="ets-header">ЕТС</div>
          <div className="form-content">
            <label>Система мониторинга</label>
            <input id="login" type="text" className="form-control" placeholder="Логин" value={login} onChange={this.handleChange.bind(this, 'login')} />
            <input id="password" type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.handleChange.bind(this, 'password')} />
            <button id="submit" role="button" className="btn btn-lg btn-primary btn-block" disabled={disabled} onClick={this.onSigninClick}>Войти</button>
            <div className="tp-messange">
              <span>
              Служба технической поддержки</span>
              <a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
              <a href="tel:84951501193">8(495) 150-11-93</ a>
            </div>
            <hr />
            <div className="dit-logo" />
          </div>
        </div>
      </form>
    );
  }

}
