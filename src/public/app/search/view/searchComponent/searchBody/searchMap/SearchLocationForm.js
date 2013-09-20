/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 8/15/13
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchLocationForm',

    requires: [
        'Savanna.controller.Factory',
        'Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationItem',
        'Savanna.search.store.SearchLocation'
    ],

    mixins: {
        storeable: 'Savanna.mixin.Storeable',
        floating:  'Ext.util.Floating'
    },

    focusOnToFront: true, // from Ext.util.Floating mixin

    store: 'Savanna.search.store.SearchLocation',

    layout: 'vbox',
    height: 400,
    width: 200,
    items: [],
    dockedItems: [
        {
            xtype: 'toolbar',
            itemId: 'searchLocationDockedItems',
            border: false,
            width: '100%',
            dock: 'top',
            layout: 'vbox',
            items: [
                {
                    xtype: 'label',
                    itemId: 'numResults',
                    text: ''
                }
            ]
        }
    ],

    initComponent: function () {
        this.mixins.storeable.initStore.call(this);
        this.mixins.floating.constructor.call(this);
        this.callParent(arguments);
    },

    onStoreLoad: function() {
        this.createSearchLocationItems();
    },

    createSearchLocationItems: function() {
        this.removeAll();
        this.query('#numResults')[0].setText(this.store.totalCount + ' Results');
        this.store.each(function (record) {
            var myPanel = this.createSearchLocationItemPanel(record);
            this.add(myPanel);
        }, this);

    },

    createSearchLocationItemPanel: function(myRecord) {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationItem', {
            name: myRecord.data.name,
            location: myRecord.data.administrativeNames,
            locationType: myRecord.data.locType,
            population: myRecord.data.population,
            viewBox: myRecord.data.viewBox
        });
    }


});