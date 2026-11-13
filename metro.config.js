const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const packagePath = path.resolve(__dirname, 'packages/react-native-dropdown-uikit');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [packagePath],
  resolver: {
    extraNodeModules: {
      'react-native-dropdown-uikit': packagePath,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
