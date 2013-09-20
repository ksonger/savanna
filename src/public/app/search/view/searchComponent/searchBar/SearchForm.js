/* global Ext: false */
Ext.define('Savanna.search.view.searchComponent.searchBar.SearchForm', {
    extend: 'Ext.toolbar.Toolbar',
    alias:'widget.searchbar_form',

    requires:   [
        'Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield'
    ],

    border: false,

    items: [
        {
            xtype: 'textfield',
            width: 400,
            fieldLabel: '',
            name: 'search_terms',
            itemId: 'search_terms',
            enableKeyEvents: true,
            emptyText: 'Search'
        },
        {
            xtype: 'button',
            itemId: 'search_clear',
            glyph: 61731
        },
        {
            xtype: 'button',
            itemId: 'search_submit',
            glyph: 61808
        },
        {
            text: 'Advanced',
            itemId: 'searchadvanced_btn',
            menu: {
                xtype: 'panel',
                cls: 'advanced-search-panel',
                floating: true,
                plain: true,
                border: false,
                itemId: 'searchadvanced_menu',
                minWidth: 400,
                enableKeyNav:false,
                items: [
                    {
                        xtype: 'button',
                        border: false,
                        text: 'Close',
                        ui: 'link-toolbar',
                        itemId: 'close_panel'
                    },
                    {
                        xtype: 'box',
                        html: '<p class="instructions">Enter advanced keyword searches.</p>' +
                              '<p class="instructions italic"> Note: Not all search sources may support all advanced options.</p>'
                    },
                    {
                        xtype: 'container',
                        itemId:'form_container',
                        items: [
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'All of these words:',
                                name: 'all_words',
                                itemId: 'all_words',
                                tabIndex: 1,
                                configs:{ join: '', booleanType: 'all' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'This exact phrase:',
                                name: 'exact_phrase',
                                itemId: 'exact_phrase',
                                tabIndex: 2,
                                configs:{ join: ' AND ', booleanType: 'exact' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'Any of these words:',
                                name: 'any_words',
                                itemId: 'any_words',
                                tabIndex: 3,
                                configs:{ join: ' AND ', booleanType: 'any' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'None of these words:',
                                name: 'none_words',
                                itemId: 'none_words',
                                tabIndex: 4,
                                configs:{ join: ' NOT ', booleanType: 'none' }
                            },
                            {
                                xtype: 'panel',
                                width: 355,
                                height: 30,
                                layout: 'absolute',
                                itemId: 'submit_panel',
                                border: false,
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'commit',
                                        itemId: 'advancedsearch_submit',
                                        text: 'Search',
                                        width: 80,
                                        x: 275,
                                        tabIndex: 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
});