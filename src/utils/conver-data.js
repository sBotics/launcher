const StringToBoolean = (string) => {
  if (!string) return false;
  const StringAverible = ['true', 'false'];
  if (typeof string === 'boolean') return string;
  const stringRecive = string.toLowerCase();
  if (StringAverible.indexOf(stringRecive) > -1)
    return stringRecive == 'true' ? true : false;
  return undefined;
};

export { StringToBoolean };
