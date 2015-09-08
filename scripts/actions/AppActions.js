import * as types from '../constants/ActionTypes';


export function enableTrackingMode(){
  return {
    type: types.ENABLE_TRACKING_MODE
  }
}

export function disableTrackingMode(){
  return {
    type: types.DISABLE_TRACKING_MODE
  }
}


export function showPlates(){
  return {
    type: types.SHOW_PLATES
  }
}
