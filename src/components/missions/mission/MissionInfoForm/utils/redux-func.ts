import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { loadRouteDataById } from 'redux-main/trash-actions/route/route';
import { loadTrackCaching } from 'redux-main/trash-actions/uniq/promise';

export const mapDispatchToProps = (dispatch) => ({
  loadGeozones: (serverName) => (
    dispatch(
      loadGeozones(
        '',
        serverName,
        {
          promise: true,
          page: 'any',
          path: 'missionInfoForm',
        }
      ),
    )
  ),
  loadRouteDataById: (id) => (
    dispatch(
      loadRouteDataById(
        '',
        id,
        {
          promise: true,
          page: 'any',
          path: 'missionInfoForm',
        },
      ),
    )
  ),
  loadTrackCaching: (props) => (
    dispatch({
      type: '',
      payload: loadTrackCaching(props),
      meta: {
        page: 'any',
        path: 'missionInfoForm',
      },
    })
  ),
})