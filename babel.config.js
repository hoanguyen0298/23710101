module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@constants': './src/constants',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};