const path = require("path");
const os = require("os");
const fs = require("fs");

var config = null;
const defaultConfig = {
  downloadPath: path.join(os.homedir(), "sBotics"),
  lang: "pt_BR",
  addons: ["blockeduc"],
};

const SetUserData = (userDataPath) => {
  userData = userDataPath;
};

const LoadConfig = (userData) => {
  const config_path = path.join(userData, "config.json");
  config = defaultConfig;
  if (fs.existsSync(config_path)) {
    config = { ...config, ...JSON.parse(fs.readFileSync(config_path)) };
  }
  fs.writeFileSync(config_path, JSON.stringify(config));
  return config;
};

const SetConfigs = (n_config, userData) => {
  const config_path = path.join(userData, "config.json");
  let new_config = defaultConfig;
  new_config = { ...new_config, ...n_config };
  fs.writeFileSync(config_path, JSON.stringify(new_config));
  config = new_config;
  return config;
};

const GetConfig = (userData, force = false) =>
  config != null && !force ? config : LoadConfig(userData);

exports.GetConfig = GetConfig;
exports.SetConfigs = SetConfigs;
exports.SetUserData = SetUserData;
exports.defaultConfig = defaultConfig;
