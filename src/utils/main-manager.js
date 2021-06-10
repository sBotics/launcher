const StringToBoolean = (string) => {
  if (!string) return false;
  const StringAverible = ['true', 'false'];
  if (typeof string === 'boolean') return string;
  const stringRecive = string.toLowerCase();
  if (StringAverible.indexOf(stringRecive) > -1)
    return stringRecive == 'true' ? true : false;
  return undefined;
};

const SLMP = () => {
  const slmp = StringToBoolean(process.env.SLMP);
  try {
    return slmp != undefined ? slmp : false;
  } catch (error) {
    return false;
  }
};

exports.SLMP = SLMP;
