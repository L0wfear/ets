import * as React from 'react';

import { connectToStores } from 'utils/decorators';
import Field from 'components/ui/Field.jsx';
import CarAvailableIcon from 'assets/images/car_available.png';
import CarNotAvailableIcon from 'assets/images/car_not_available.png';

@connectToStores(['objects'])
class SelectorCars extends React.Component {
  static get propTypes() {
    return {
      formState: React.PropTypes.object,
      formErrors: React.PropTypes.object,
      onChange: React.PropTypes.func,
      carsList: React.PropTypes.arrayOf.object,
      disabled: React.PropTypes.bool,
    };
  }
  getValue() {
    const {
      formState: {
        car_id: value,
      } = {},
    } = this.props;
    return value;
  }
  getError() {
    const {
      formErrors: {
        car_id: error,
      } = {},
    } = this.props;

    return error;
  }
  handleChange = value => this.props.onChange('car_id', value);

  makeCarsOption() {
    const {
      formState: {
        structure_id = null,
      } = {},
      carsList = [],
    } = this.props;

    return carsList
    .reduce((newArr, { asuods_id: value, type_id, gov_number, available, is_common, company_structure_id, special_model_name, model_name }) => {
      if (!(structure_id && !is_common && company_structure_id !== structure_id)) {
        newArr.push({
          value,
          available,
          label: `${gov_number} [${special_model_name || ''}${special_model_name ? '/' : ''}${model_name || ''}]`,
          type_id,
        });
      }
      return newArr;
    }, []);
  }

  renderCarOptions(o) {
    return (
      <div>
        {o.available ?
          <img role="presentation" height="20" src={CarAvailableIcon} style={{ marginRight: 10, marginTop: -2 }} /> :
          <img role="presentation" height="20" src={CarNotAvailableIcon} style={{ marginRight: 10, marginTop: -2 }} />
        }
        {o.label}
      </div>
    );
  }

  render() {
    const {
      disabled = false,
    } = this.props;
    const value = this.getValue();
    const error = this.getError();
    const CARS_OPTIONS = this.makeCarsOption();
    console.log(this.props)
    return (
      <Field
        type="select"
        label="Транспортное средство"
        error={error}
        className="white-space-pre-wrap"
        disabled={disabled}
        options={CARS_OPTIONS}
        optionRenderer={this.renderCarOptions}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

export default SelectorCars;
