import React, { Component } from 'react';
import { init } from '../adapter.js';

class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.onLoginChange = this.onLoginChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSigninClick = this.onSigninClick.bind(this);

    this.state = {
      login: '',
      password: '',
      error: false,
      loading: false,
    };

  }

  render() {
  console.log(this.context);
    const { login, password, error } = this.state;
    const disabled = login.length === 0 || password.length === 0;

    return (
      <div style={{ paddingTop: 40 }}>
        <div className="form-signin">
          <label className="sr-only">Имя пользователя</label>
          <input type="text" className="form-control" placeholder="Имя пользователя" value={login} onChange={this.onLoginChange}/>
          <label className="sr-only">Пароль</label>
          <input type="password" className="form-control" placeholder="Пароль" value={password} onChange={this.onPasswordChange}/>

          { error ?
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Неправильное имя пользователя или пароль</div>
          : null }
          <button className="btn btn-lg btn-primary btn-block" disabled={disabled} onClick={this.onSigninClick}>Вход</button>
        </div>
      </div>
    );
  }

  onLoginChange(e) {
    const login = e.target.value;
    const error = false;
    this.setState({ login, error });
  }

  onPasswordChange(e) {
    const password = e.target.value;
    const error = false;
    this.setState({ password, error });
  }

  onSigninClick() {
    const { login, password } = this.state;
    const flux = this.context.flux;

    const user = {
      login, password
    };

    if (!user) {
      this.setState({ error: true });
    } else {
      this.context.setLoading(true);
      flux.getActions('session').login(user).then(() => {
        this.context.loadData();
        this.context.history.pushState(null, '/monitor');
      });
    }

  }

}

LoginPage.contextTypes = {
  flux: React.PropTypes.object.isRequired,
  history: React.PropTypes.object,
  loadData: React.PropTypes.func,
  setLoading: React.PropTypes.func,
}


export default LoginPage;
