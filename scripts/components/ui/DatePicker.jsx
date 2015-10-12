import {Component} from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

export default class DatePicker extends Component {
	constructor(props) {
		super(props);
	}

	render() {
    let DATE_FORMAT = 'yyyy-MM-dd HH:mm';
    let TIME_FORMAT = 'HH:mm';

		return <DateTimePicker onChange={this.props.onChange} 
														format={DATE_FORMAT} 
														timeFormat={TIME_FORMAT} 
														className="chart-datepicker"
									          disabled={this.props.disabled}
									          defaultValue={this.props.default}
									          value={this.props.date}/>
	}
}