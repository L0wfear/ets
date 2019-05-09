import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import {
    actionGetAndSetInStoreCarsTravelTime,
    actionResetCarsTravelTime,
} from 'redux-main/reducers/modules/some_uniq/cars_travel_time/actions';
import {
    actionGetAndSetInStoreTracksCaching,
    actionResetTracksCaching,
} from 'redux-main/reducers/modules/some_uniq/tracks_caching/actions';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';

export type CarsTravelTimeModalStateProps = {
    carsTravelTimeList: IStateSomeUniq['carsTravelTimeList'];
    tracksCaching: IStateSomeUniq['tracksCaching'];
};

export type CarsTravelTimeModalDispatchProps = {
    actionGetAndSetInStoreCarsTravelTime: HandleThunkActionCreator<typeof actionGetAndSetInStoreCarsTravelTime>;
    actionResetCarsTravelTime: HandleThunkActionCreator<typeof actionResetCarsTravelTime>;
    actionGetAndSetInStoreTracksCaching: HandleThunkActionCreator<typeof actionGetAndSetInStoreTracksCaching>;
    actionResetTracksCaching: HandleThunkActionCreator<typeof actionResetTracksCaching>;
    loadGeozones: HandleThunkActionCreator<typeof loadGeozones>;
};

export type PropsCarsTravelTimeModal = ({
    onFormHide: () => any;
    date_from: string;
    date_to: string;
    selectedElement: any;
    carsTravelTimeList: IStateSomeUniq['carsTravelTimeList'];
    tracksCaching: IStateSomeUniq['tracksCaching'];
})
    & CarsTravelTimeModalDispatchProps
    & CarsTravelTimeModalStateProps;

export type CarsTravelTimeModalOwnProps = {
};
