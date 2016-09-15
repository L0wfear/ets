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

  handleChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    this.setState({
      [field]: value,
    });
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
      if (['dispatcher', 'master'].indexOf(data.payload.role) > -1) {
        this.context.history.pushState(null, '/dashboard');
      } else {
        this.context.history.pushState(null, '/monitor');
      }
    });
  }

  render() {
    const { login, password } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <form style={{ paddingTop: 40 }} onSubmit={this.onSigninClick}>
        <div className="form-signin">
          <label className="sr-only">Имя пользователя</label>
          <input type="text" className="form-control" placeholder="Имя пользователя" value={login} onChange={this.handleChange.bind(this, 'login')} />
          <label className="sr-only">Пароль</label>
          <input type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.handleChange.bind(this, 'password')} />
          <button role="button" className="btn btn-lg btn-primary btn-block" disabled={disabled} onClick={this.onSigninClick}>Вход</button>
        </div>
      </form>
    );
  }

}
