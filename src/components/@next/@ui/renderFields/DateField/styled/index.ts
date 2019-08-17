import styled from 'styled-components';
import DatePicker from 'components/old/ui/input/date-picker/DatePicker';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const DateFieldUi = styled(DatePicker)`
  &&& {
    &.chart-datepicker .rw-widget-picker {
      border-radius: ${UiConstants.borderFieldRadius}!important;
    }
    &.has-error.chart-datepicker .rw-widget-picker {
      border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0 0!important;
    }
  }
`;
