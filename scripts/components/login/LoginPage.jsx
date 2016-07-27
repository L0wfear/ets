import React, { Component, PropTypes } from 'react';

export default class LoginPage extends Component {

  static get contextTypes() {
    return {
      flux: PropTypes.object.isRequired,
      history: PropTypes.object,
      loadData: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: ''
    };
  }

  render() {
    const { login, password } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <div style={{ paddingTop: 40 }}>
        <div className="form-signin">
          <label className="sr-only">Имя пользователя</label>
          <input type="text" className="form-control" placeholder="Имя пользователя" value={login} onChange={this.handleChange.bind(this, 'login')}/>
          <label className="sr-only">Пароль</label>
          <input type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.handleChange.bind(this, 'password')}/>
          <button className="btn btn-lg btn-primary btn-block" disabled={disabled} onClick={this.onSigninClick.bind(this)}>Вход</button>
        </div>
      </div>
    );
  }

  handleChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    this.setState({
      [field]: value
    });
  }

  onSigninClick() {
    const { login, password } = this.state;
    const { flux } = this.context;
    const user = {
      login,
      password
    };

    flux.getActions('session').login(user).then(() => {
      this.context.loadData();
      this.context.history.pushState(null, '/dashboard');
    });
  }

}
