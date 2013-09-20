/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, it: false, expect: false,
          Savanna: false
*/
Ext.require('Savanna.mixin.Storeable');

// set up a test store to use
Ext.define('Savanna.mixin.test.Store', {
    extend: 'Ext.data.JsonStore',
    storeId: 'testStore',
    autoLoad: false,
    constructor: function() {
        this.callParent(arguments);
        this.setProxy({
            type: 'rest',
            url: 'foo',
            reader: {
                type: 'json'
            }
        });
    }
});

describe('Savanna.mixin.Storeable', function() {
    var testMixer = null;

    afterEach(function() {
        testMixer = null;

        var testStore = Ext.data.StoreManager.get('testStore');

        if (testStore) {
            Ext.data.StoreManager.remove(testStore);
        }
    });

    describe('How it should handle error cases', function() {
        var raisedError = false;
        var testMixer = null;

        beforeEach(function() {
            Ext.Error.handle = function() {
                raisedError = true;
                return true;
            };

            Ext.define('Savanna.mixin.test.ContainerThatThrowsError', {
                extend: 'Ext.container.Container',
                mixins: {
                    storeable: 'Savanna.mixin.Storeable'
                },
                initComponent: function() {
                    this.mixins.storeable.initStore.call(this);
                    this.callParent(arguments);
                }
            });

            testMixer = Ext.create('Savanna.mixin.test.ContainerThatThrowsError');
        });

        afterEach(function() {
            Ext.Error.handle = function() {};
            raisedError = false;
        });

        it('should raise an error since we did not specify a store', function() {
            expect(raisedError).toBeTruthy();
        });
    });

    describe('How it should handle valid cases', function() {

        describe('Store lookup/instantation', function() {

            beforeEach(function() {
                Ext.define('Savanna.mixin.test.ContainerNoHandler', {
                    extend: 'Ext.container.Container',
                    mixins: {
                        storeable: 'Savanna.mixin.Storeable'
                    },
                    store: 'Savanna.mixin.test.Store',
                    initComponent: function() {
                        this.mixins.storeable.initStore.call(this);
                        this.callParent(arguments);
                    }
                });
            });

            it('should create an instance of the store if it does not exist', function() {
                var testStore = Ext.data.StoreManager.get('testStore');

                expect(testStore).toBeUndefined();

                testMixer = Ext.create('Savanna.mixin.test.ContainerNoHandler');
                testStore = Ext.data.StoreManager.get('testStore');
                testStore.id = Ext.id();

                expect(testStore).not.toBeUndefined();
                expect(testMixer.store.id).toBe(testStore.id);
            });

            it('should reuse an instance of the store already loaded into the StoreManager', function() {
                var testStore = Ext.create('Savanna.mixin.test.Store');
                testStore.id = Ext.id();

                Ext.data.StoreManager.add(testStore);

                testMixer = Ext.create('Savanna.mixin.test.ContainerNoHandler');

                expect(Ext.data.StoreManager.get('testStore').id).toBe(testStore.id);
            });
        });

        describe('Definition of a handler for store loading', function() {
            var onStoreLoadCalled = false,
                onStoreChangedCalled = false;

            beforeEach(function() {
                Ext.define('Savanna.mixin.test.ContainerWithHandler', {
                    extend: 'Ext.container.Container',
                    mixins: {
                        storeable: 'Savanna.mixin.Storeable'
                    },
                    store: 'Savanna.mixin.test.Store',
                    initComponent: function() {
                        this.mixins.storeable.initStore.call(this);
                        this.callParent(arguments);
                    },
                    onStoreLoad: function() {
                        onStoreLoadCalled = true;
                    },
                    onStoreChanged: function() {
                        onStoreChangedCalled = true;
                    }
                });
            });

            afterEach(function() {
                onStoreLoadCalled = false;
                onStoreChangedCalled = false;
            });

            it('should call the handler when data is loaded in the store', function() {
                testMixer = Ext.create('Savanna.mixin.test.ContainerWithHandler');

                testMixer.store.fireEvent('load');

                expect(onStoreLoadCalled).toBeTruthy();
            });

            it('should call the handler when data is changed in the store', function() {
                testMixer = Ext.create('Savanna.mixin.test.ContainerWithHandler');

                testMixer.store.fireEvent('datachanged');

                expect(onStoreChangedCalled).toBeTruthy();
            });
        });

        describe('Store access', function() {

            beforeEach(function() {
                Ext.define('Savanna.mixin.test.ContainerWithStoreGetter', {
                    extend: 'Ext.container.Container',
                    mixins: {
                        storeable: 'Savanna.mixin.Storeable'
                    },
                    store: 'Savanna.mixin.test.Store',
                    initComponent: function() {
                        this.mixins.storeable.initStore.call(this);
                        this.callParent(arguments);
                    }
                });
            });

            it('should be able to retrieve the store via accessor', function() {
                var testMixer = Ext.create('Savanna.mixin.test.ContainerWithStoreGetter');

                var store = testMixer.getStore();

                expect(store).not.toBeUndefined();
                expect(store instanceof Savanna.mixin.test.Store).toBeTruthy();
            });
        });
    });
});