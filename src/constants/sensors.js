const data = {
  0: {
    color: 'rgba(43, 18, 242, 1)',
    ratio: 0.9,
  },
  1: {
    color: 'rgba(130, 18, 242, 1)',
    ratio: 0.8,
  },
  2: {
    color: 'rgba(242, 18, 173, 1)',
    ratio: 0.7,
  },
  3: {
    color: 'rgba(18, 242, 229, 1)',
    ratio: 0.6,
  },
  4: {
    color: 'rgba(242, 240, 18, 1)',
    ratio: 0.5,
  },
};


export const sensorsMapOptions = (index, maxSpeed = 0) => ({
  color: data[index].color,
  value: maxSpeed === 10 ? maxSpeed - (15 * index) : maxSpeed - (10 * index),
});

export const sensorTrackColor = [
  '#607D8B',
  '#FFEB3B',
  '#2196F3',
  '#673AB7',
  '#FF9800',
];

export const getTrackSensorColor = (selectedSensors, trackSensors) => {
  if (trackSensors) {
    const sensorCount = trackSensors.filter(s => selectedSensors.includes(`${s.id}`) && s.val !== 0).length;
    return sensorTrackColor[sensorCount];
  }

  return sensorTrackColor[0];
};
