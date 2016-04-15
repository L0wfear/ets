import React from 'react';
import EtsSelect from './EtsSelect.jsx';
import DatePicker from './DatePicker.jsx';
import Div from './Div.jsx';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

class Field extends React.Component {

  constructor(props) {
    super(props);
  }

  renderBoolean() {
    const { label = ''} = this.props;
    return <Div hidden={this.props.hidden}>
             <label>{label}</label>
             <Div>
              <input type="checkbox" checked={this.props.value} {...this.props} />
             </Div>
           </Div>
  }

  renderNumber() {
    const { error, label = ''} = this.props;
    const inputClassName = cx({'has-error': error});
    return <Div hidden={this.props.hidden}>
             <Input type="number" className={inputClassName} {...this.props} />
             <Div hidden={!error} className="error">{error}</Div>
           </Div>
  }

  renderDate() {
    const { error, label = '', readOnly = false } = this.props;
    const dateClassName = cx({'has-error': error});
    return  <Div hidden={this.props.hidden}>
      <label>{label}</label>
      <DatePicker {...this.props} className={dateClassName}/>
      <Div hidden={!error} className="error" style={{marginTop: 4}}>{error}</Div>
    </Div>;
  }

  renderSelect() {
    const { error, label = ''} = this.props;
    const selectClassName = cx({'has-error': error});
    return  <Div hidden={this.props.hidden}>
      <label>{label}</label>
      <EtsSelect {...this.props} className={selectClassName}/>
      <Div hidden={!error} className="error" style={{marginTop: 4}}>{error}</Div>
    </Div>;
  }

  renderString() {
    const { error, label = '', readOnly = false } = this.props;
    const inputClassName = cx({'has-error': error});
    return !readOnly ?
           <Div hidden={this.props.hidden}>
             <Input type="text" className={inputClassName} {...this.props} />
             <Div hidden={!error} className="error">{error}</Div>
           </Div>:
           <Div hidden={this.props.hidden}>
             <label style={{paddingTop:5}}>{this.props.label}</label><br/>
             {this.props.value}
           </Div>
  }

  renderFieldByType(type) {
    switch (type) {
      case 'string':
        return this.renderString();
        break;
      case 'select':
        return this.renderSelect();
        break;
      case 'date':
        return this.renderDate();
        break;
      case 'number':
        return this.renderNumber();
        break;
      case 'boolean':
        return this.renderBoolean();
        break;
      default:
        return this.renderString();
        break;
    }
  }

  render() {
    const { type } = this.props;

    return this.renderFieldByType(type);
  }

}

Field.propTypes = {
  type: React.PropTypes.string.isRequired,
};

export default Field;
