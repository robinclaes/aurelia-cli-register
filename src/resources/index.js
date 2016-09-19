export function configure(config) {
  config.globalResources([
    './value-converters/euro',
    './value-converters/object-keys'
  ]);
}
