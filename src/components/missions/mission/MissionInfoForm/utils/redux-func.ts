import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { loadTrackCaching } from 'redux-main/trash-actions/uniq/promise';
import { loadCarGpsCode } from 'redux-main/trash-actions/car/car';
import { routesLoadRouteById } from 'redux-main/reducers/modules/routes/routes/actions';

export const mapDispatchToProps = (dispatch) => ({
  loadGeozones: (serverName, company_id) => (
    dispatch(
      loadGeozones(
        'none',
        serverName,
        {
          promise: true,
          page: 'any',
          path: 'missionInfoForm',
        },
        company_id,
      ),
    )
  ),
  routesLoadRouteById: (id) => (
    dispatch(
      routesLoadRouteById(
        id,
        {
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
  loadCarGpsCode: ({ asuods_id, date_start }) => (
    dispatch(
      loadCarGpsCode(
        'none',
        {
          asuods_id,
          date_start,
        },
        {
          page: 'any',
          path: 'missionInfoForm',
        },
      ),
    )
  ),
});
