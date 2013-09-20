/* global Ext: false, Savanna: false */
Ext.define('Savanna.search.view.searchComponent.SearchBar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchbar',

    requires: [
        'Ext.ux.layout.Center',
        'Ext.form.field.Text',
        'Savanna.controller.Factory',
        'Savanna.search.view.searchComponent.searchBar.SearchForm'
    ],

    border: false,
    frame: false,
    layout: 'ux.center',
    cls: 'search-prime',

    items: [
        {
            xtype: 'panel',
            border: false,
            width: '30%',
            minWidth: 520,
            itemId: 'main_panel',
            items: [
                {
                    xtype: 'searchbar_form',
                    itemId: 'search_form'
                },
                {
                    xtype: 'panel',
                    border: false,
                    bodyPadding: 0,
                    itemId:'search_reset',
                    items: [
                        {
                            xtype: 'button',
                            itemId:'search_reset_button',
                            text: 'Start New Search'
                        }
                    ]
                }
            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
    },

    buildSearchString: function () {
        var searchString,
            advancedBooleanString = '',
            formQueryString,
            form = this.queryById('search_form'),
            formField = form.queryById('form_container');

        Ext.Array.each(formField.query('searchadvanced_textfield'), function (field) {
            var value = field.getValue().trim();

            if (field.xtype === 'searchadvanced_textfield' && value !== '' && value !== undefined) {
                field.setValue(value);

                var joinString = field.configs.join;

                if (advancedBooleanString === '') {
                    joinString = '';
                }

                advancedBooleanString += joinString + field.getBooleanValue();
            }
        });

        formQueryString = form.queryById('search_terms').getValue().trim();
        advancedBooleanString = advancedBooleanString.replace(/\s+/g, ' ');
        searchString = '' + formQueryString;

        if (searchString === '') {
            searchString = advancedBooleanString;
        } else {
            if (advancedBooleanString.trim() !== '') {
                searchString = formQueryString + ' AND ' + advancedBooleanString;
            } else {
                searchString = formQueryString;
            }
        }

        return searchString;
    }
});