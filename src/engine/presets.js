const INSTRUMENT_PRESETS = {
  ES: {
    tickSize: 0.25,
    tickValueUsd: 12.5
  },
  MES: {
    tickSize: 0.25,
    tickValueUsd: 1.25
  },
  MNQ: {
    tickSize: 0.25,
    tickValueUsd: 0.5
  },
  NQ: {
    tickSize: 0.25,
    tickValueUsd: 5
  }
};

function getPreset(symbol) {
  return INSTRUMENT_PRESETS[symbol] || null;
}

module.exports = {
  getPreset,
  INSTRUMENT_PRESETS
};

