/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 7/3/13
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */
/* global Ext: false, Savanna: false */
Ext.define('Savanna.search.view.searchComponent.searchBody.SearchDals', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchdals',

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    store: 'Savanna.search.store.DalSources',

    requires: [
        'Ext.form.Label',
        'Ext.toolbar.Spacer',
        'Savanna.search.view.searchComponent.searchBody.searchDals.SearchOptions'
    ],

    layout: 'vbox',

    border: false,

    settingAllDalCheckBoxes: false,     // currently setting all Dal checkboxes to checked or unchecked

    dockedItems: [
        {
            xtype: 'toolbar',
            cls: 'search-sources-toolbar',
            border: false,
            width: '100%',
            dock: 'top'
        }
    ],

    initComponent: function () {
        this.mixins.storeable.initStore.call(this);
        this.dockedItems = this.setupDockedItems();
        this.callParent(arguments);

        Savanna.controller.Factory.getController('Savanna.search.controller.SearchDals');
    },

    setupDockedItems: function() {
        return [
            {
                xtype: 'toolbar',
                cls: 'search-sources-toolbar',
                border: false,
                width: '100%',
                dock: 'top',
                itemId: 'searchDalDockedItems',
                margin: '-3 0 5 0',
                items: [
                    {
                        xtype: 'label',
                        text: 'Select sources to include in your search.'
                    },
                    {
                        xtype: 'button',
                        itemId: 'selectAllDals',
                        text: 'Select All',
                        tooltip: 'Select/Unselect all sources'
                    },
                    '->',
                    {
                        xtype: 'button',
                        itemId: 'resetAllSearchOptions',
                        text: 'Reset All Search Options'
                    }
                ]
            }
        ];
    },

    onStoreLoad: function() {
        this.createDalPanels();
    },

    createDalPanels: function() {


        this.removeAll();

        this.store.each(function (record) {
            var myPanel = this.createPanel(record);
            this.add(myPanel);
            if(record.data.id === this.store.defaultId)  {
                myPanel.query('checkbox')[0].setValue(true);
            }
        }, this);
    },

    createPanel: function(myRecord) {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.searchDals.SearchOptions', {
            itemId: myRecord.data.id,
            checkboxLabel: myRecord.data.displayName,
            label: myRecord.data.textDescription,
            showButton: (myRecord.getCustomSearchDescription().customSearchGroups().data.length > 0)
        });
    }
});
