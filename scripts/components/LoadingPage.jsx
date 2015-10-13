import { Component } from 'react';
import Preloader from './ui/Preloader.jsx';

export default class LoadingPage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <Preloader type="mainpage" visible={this.props.loaded}/>
  }
}
