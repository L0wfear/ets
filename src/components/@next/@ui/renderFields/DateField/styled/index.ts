import styled from 'styled-components';
import DatePicker from 'components/old/ui/input/date-picker/DatePicker';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const DateFieldUi = styled(DatePicker)`
  &&& {
    &.chart-datepicker .rw-widget-picker {
      border-radius: ${UiConstants.borderFieldRadius}!important;
    }
    .rw-select-bordered:before {
      transition: all .3s ease;
    }
    .rw-widget-input:focus {
      background-color: ${UiConstants.colorBlueLight};
    }
    .rw-select-bordered button {
      top: -1px;
      right: -1px;
    }
    .rw-btn-select {
      font-size: 12px;
    }
    &.rw-state-focus .rw-widget-picker {
      background-color: ${UiConstants.colorBlueLight};
      .rw-btn-select {
        transition: all .2s ease;
        font-size: 14px;
      }
      .rw-btn-select:hover {
        background-color: ${UiConstants.colorBlue};
        color: #fff;
      }
      .rw-select-bordered:before {
        opacity: 0;
      }
    }
    .rw-i-calendar {
      font-size: 12px;
    }
    /* &.has-error.chart-datepicker .rw-widget-picker {
      border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0 0!important;
    } */
  }
`;
