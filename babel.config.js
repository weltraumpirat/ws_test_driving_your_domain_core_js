module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/typescript',
    ['@babel/preset-env',
      {
        targets: { node: '10.15' }
      }]
  ];
  const plugins = [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread'
  ];

  return {
    presets,
    plugins,
    ignore: [
      '**/*.js',
      '**/*.map'
    ],
    sourceMaps: true
  };
};
