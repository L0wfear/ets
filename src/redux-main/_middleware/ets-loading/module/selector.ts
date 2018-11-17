export const getLoadingCount = (stateLoading, page?, path?) => {
  if (!page) {
    return stateLoading.allCount;
  }

  if (!path) {
    const { [page]: pageCountersNoPath = { allCount: 0 } } = stateLoading.countByPage;
    return pageCountersNoPath.allCount;
  }

  const { [page]: pageCounters = { allCount: 0 } } = stateLoading.countByPage;
  const { [path]: pathCounter = 0 } = pageCounters;
  return pathCounter;
};
