/* global Ext: false*/
Ext.define('Savanna.search.view.searchComponent.SearchBar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchbar',

    requires: [
        'Ext.layout.container.HBox',
        'Ext.form.field.Text',
        'Savanna.controller.Factory',
        'Savanna.search.view.searchComponent.searchBar.SearchForm'
    ],

    border: false,
    frame: false,
    layout: {
        type: 'hbox',
        align: 'bottom',
        pack: 'center'
    },
    height: 60,
    width: '100%',
    ui: 'search-prime',

    items: [
        {
            xtype: 'container',
            border: false,
            width: '20%',
            minWidth: 520,
            itemId: 'main_panel',
            height: 50,
            layout: {
                type: 'vbox',
                align: 'left'
            },
            items: [
                {
                    xtype: 'searchbar_form',
                    itemId: 'search_form',
                    width: '100%',
                    height: 28
                },
                {
                    xtype: 'button',
                    itemId:'search_reset_button',
                    ui: 'white',
                    text: 'Start new search'
                }
            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
    },

    buildSearchString: function () {
        var advancedBooleanString = '',
            formQueryString,
            form = this.queryById('search_form'),
            formContainer = form.queryById('searchadvanced_menu').queryById('form_container');

        Ext.Array.each(formContainer.query('searchadvanced_textfield'), function (field) {
            var value = field.getValue().trim();

            if (field.xtype === 'searchadvanced_textfield' && value !== '' && value !== undefined) {
                field.setValue(value);

                var joinString = field.configs.join;

                if (advancedBooleanString === '' || field.configs.booleanType === 'none') {
                    joinString = '';
                }

                advancedBooleanString += joinString + field.getBooleanValue();
            }
        });

        formQueryString = form.queryById('search_terms').getValue().trim();
        advancedBooleanString = advancedBooleanString.replace(/\s+/g, ' ').trim();

        if (advancedBooleanString !== '') {
            return advancedBooleanString;
        } else {
            return '' + formQueryString;
        }

    }
});