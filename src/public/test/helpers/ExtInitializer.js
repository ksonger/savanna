/* global Ext: false, console: false */
Ext.Loader.setConfig({
    enabled: true,
    syncModeEnabled: true,
    disableCaching: false // NOTE: A great example of a confusing option "disableCaching is false when we do not want to prevent caching...":)
});
Ext.application({
    name: 'Savanna',
    autoCreateViewport: false,
    paths: { Savanna: '../app' }
});