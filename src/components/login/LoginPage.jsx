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

    flux.getActions('session').login(user).then((data) => {
      this.context.loadData();
      if (['dispatcher', 'master'].indexOf(data.payload.role) > -1 && data.payload.okrug_id === null) {
        this.context.history.pushState(null, '/dashboard');
      } else {
        this.context.history.pushState(null, '/monitor/showFormRule');
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
      <form onSubmit={this.onSigninClick}>
        <div className="form-signin">
          <div className="ets-header">ЕТС</div>
          <div className="form-content">
            <label>Система мониторинга</label>
            <input type="text" className="form-control" placeholder="Логин" value={login} onChange={this.handleChange.bind(this, 'login')} />
            <input type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.handleChange.bind(this, 'password')} />
            <button role="button" className="btn btn-lg btn-primary btn-block" disabled={disabled} onClick={this.onSigninClick}>Войти</button>
            <hr />
            <div className="dit-logo" />
          </div>
        </div>
      </form>
    );
  }

}
