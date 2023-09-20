module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '~': './src',
          '~/*': ['./src/*'],
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanFaces'],
      },
    ],
  ],
};
