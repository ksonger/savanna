/**
 * Created with IntelliJ IDEA.
 * User: thille
 * Date: 7/30/13
 * Time: 1:33 PM
 * To change this template use File | Settings | File Templates.
 */
/* global Ext: false */
/**
 * Savanna.mixin.Storeable
 *
 * A mixin to create Ext.data.Store backed containers
 *
 * General Usage:
 *
 * // In your class definition
 * Ext.define('Savanna.someView.Foo', {
 *      extend: 'Some.subclass.of.Ext.container.AbstractContainer',
 *      mixins: {
 *          storeable: 'Savanna.mixin.Storeable'
 *      },
 *      store: 'Savanna.some.Store',
 *      initComponent: function() {
 *          this.callParent(arguments);
 *          this.mixins.storeable.initStore.call(this);
 *      }
 * });
 */
Ext.define('Savanna.mixin.Storeable', {
    /**
     * initializes the store
     *
     * This should be called in initComponent()
     */
    initStore: function () {
        if (!this.store) {
            Ext.Error.raise({ msg: 'No "store" defined' });
            return;
        }

        // Look up the configured Store. If none configured, use the fieldless, empty Store defined in Ext.data.Store.
        var tmpStore = Ext.data.StoreManager.get(this.store);

        if (!tmpStore) {
            tmpStore = Ext.create(this.store);

            Ext.data.StoreManager.add(this.store, tmpStore);
        }

        this.store = tmpStore;

        if (this.onStoreLoad) {
            this.mon(this.store, 'load', this.onStoreLoad, this);
        }

        // Method added to handle a store sync action
        if (this.onStoreChanged) {
            this.mon(this.store, 'datachanged', this.onStoreChanged, this);
        }
    },

    /**
     * Returns the store associated with this Panel.
     * @return {Ext.data.Store} The store
     */
    getStore: function() {
        return this.store;
    }
});
