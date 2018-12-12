const chartColor = [
  'rgba(43, 18, 242, 1)',
  'rgba(130, 18, 242, 1)',
  'rgba(242, 18, 173, 1)',
  'rgba(18, 242, 229, 1)',
  'rgba(242, 240, 18, 1)',
  '#0B61A4',
  '#E2FA01',
  '#FF2D01',
  '#85004C',
  '#01CC01',
];

const chartColorLength = chartColor.length;

export const dataColorRation = chartColor.map((color, index) => ({
  color,
  ratio: 0.5 + index * (0.4 / (chartColorLength - 1)),
}));

export const sensorsMapOptions = (index, maxSpeed = 0) => ({
  color: dataColorRation[index].color,
  value: maxSpeed === 10 ? maxSpeed - (15 * (index + 1)) : maxSpeed - (10 * (index + 1)),
});

export const sensorTrackColor = [
  '#607D8B',
  '#FFEB3B',
  '#2196F3',
  '#673AB7',
  '#FF9800',
  '#A64800',
  '#AE66D5',
  '#090974',
  '#207C65',
  '#BF9031',
];

export const getTrackSensorColor = (selectedSensors, trackSensors) => {
  if (trackSensors) {
    const sensorCount = trackSensors.filter((s) => selectedSensors.includes(`${s.id}`) && s.val !== 0).length;
    return sensorTrackColor[sensorCount];
  }

  return sensorTrackColor[0];
};
