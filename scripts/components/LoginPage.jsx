import React, { Component } from 'react';


const users = [

  {
    login: 'mayor',
    password: 'mayor',
    role: 'mayor'
  },

  {
    login: 'prefect_cao',
    password: 'prefect_cao',
    role: 'prefect',
    okrug: 1
  },

  {
    login: 'zhilishnik_tverskoy',
    password: 'zhilishnik_tverskoy',
    role: 'owner',
    owner: 102266340
  }

];


class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.onLoginChange = this.onLoginChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSigninClick = this.onSigninClick.bind(this);

    this.state = {
      login: '',
      password: '',
      error: false
    };

  }

  render() {
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
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Неправльное имя пользователя или пароль</div>
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

    const user = users.filter(u => u.login === login && u.password === password)[0];

    if (!user) {
      this.setState({ error: true });
    } else {
      flux.getActions('login').login(user);
    }

  }

}

LoginPage.contextTypes = {
  flux: React.PropTypes.object.isRequired
}


export default LoginPage;
