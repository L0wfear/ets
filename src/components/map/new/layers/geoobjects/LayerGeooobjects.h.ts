import { GeozonesDataByIndex } from 'redux/trash-actions/geometry/geometry.h';
import { TypeCompaniesIndex } from 'redux/trash-actions/uniq/promise.h';

export type PropsLayerPlayPoint = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  geoobjects: any;
  SHOW_GEOOBJECTS: boolean;
  companiesIndex: TypeCompaniesIndex;

  monitorPageAddToSelectedGeoobjects: Function;
}

interface TypeGeoObjectDataIndex {
  [id: string]: GeozonesDataByIndex;
}

export type TypeGeoObjectData = {
  show: boolean;
  data?: TypeGeoObjectDataIndex;
  oldData?: TypeGeoObjectDataIndex;
  
}

export type TypeGeoobjects = {
  [serverName: string]: TypeGeoObjectData;
};

export type StateLayerPlayPoint = {
  geoobjects: TypeGeoobjects,
  SHOW_GEOOBJECTS: boolean;
}

export module InjectetLayerProps {
}

export module LayerGeoobjectsUtilsTypes {
  type checkShowTrueFuncThisProps = {
    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
    companiesIndex?: TypeCompaniesIndex;
  }

  type checkShowFalseFuncThisProps = {
    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  }

  type renderGeoobjectsFuncThisProps = checkShowTrueFuncThisProps & checkShowFalseFuncThisProps & {
    getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
    companiesIndex?: TypeCompaniesIndex;
  }

  export type renderGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    diffGeoobjects: TypeGeoobjects,
    thisProps: renderGeoobjectsFuncThisProps,
  ) => void;

  export type checkShowTrueFunc = (
    serverName: string,
    id: string,
    show: boolean,
    geoobj: GeozonesDataByIndex,
    geoobj_old: GeozonesDataByIndex,
    oldFeature: ol.Feature,
    thisProps: checkShowTrueFuncThisProps,
    selected: boolean,
    isManyCompany?: boolean,
  ) => void;

  export type checkShowTrueHasOldFeatureFunc = (
    geoobj: GeozonesDataByIndex,
    geoobj_old: GeozonesDataByIndex,
    oldFeature: ol.Feature,
  ) => void;

  export type checkShowTrueHasNotOldFeatureFunc = (
    serverName: string,
    id: string,
    geoobj: GeozonesDataByIndex,
    thisProps: checkShowTrueFuncThisProps,
    selected: boolean,
    color?: string,
  ) => void;

  export type getMergedGeoobjectsFunc = (
    geoobjects: TypeGeoobjects,
    diffGeoobjects: TypeGeoobjects,
  ) => TypeGeoobjects;

  type DiffAns = {
    hasDiff: boolean,
    changedGeoobjects: TypeGeoobjects,
  }

  export type checkShowStatusFunc = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    stateData: TypeGeoObjectData 
  ) => DiffAns;

  export type checkDataFunc = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    stateData: TypeGeoObjectData 
  ) => DiffAns;

  export type ansCheck = (
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    stateData: TypeGeoObjectData 
  ) => {
    checkShowStatus: DiffAns,
    checkData: DiffAns,
  }

  type DiffAnsForClass = {
    hasDiff: boolean,
    diffGeoobjects: TypeGeoobjects,
  }

  export type diffInputPropsFunc = (
    nextProps: PropsLayerPlayPoint,
    thisState: StateLayerPlayPoint,
  ) => DiffAnsForClass;

  export type mergeRetvalWithCaclDataFunc = (
    retValue: DiffAnsForClass,
    serverName: string,
    data: TypeGeoObjectData,
    show: boolean,
    stateData: TypeGeoObjectData 
  ) => DiffAnsForClass;

  export type checkShowFalseFunc = (
    show: boolean,
    oldFeature: ol.Feature,
    thisProps: checkShowFalseFuncThisProps,
  ) => void;
};
