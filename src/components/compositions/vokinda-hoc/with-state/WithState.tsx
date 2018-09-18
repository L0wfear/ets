import * as React from 'react';

const setGetName = (key: string) => {
  const [firstLetter, ...other] = key.split('');
  return `set${firstLetter.toLocaleLowerCase()}${other.join('')}`;
}

const WithState: any = state => Component =>
  class WithState extends React.Component<any, any> {
    constructor(props) {
      super(props);

      this.state = {
        ...Object.entries(state).reduce((newObj, [key, value]) => ({
          ...newObj,
          [key]: typeof value === 'function' ? (value as any)(props) : value,
        }), {}),
        ...Object.keys(state).reduce((newObj, key) => ({
          ...newObj,
          [setGetName(key)]: value => this.setState({ [key]: value }),
        }), {}),
        multyChange: (obj) => this.setState({ ...obj }),
      };
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state }
        />
      );
    }
  }

export default WithState;
