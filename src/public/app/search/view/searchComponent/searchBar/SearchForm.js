/* global Ext: false */
Ext.define('Savanna.search.view.searchComponent.searchBar.SearchForm', {
        extend: 'Ext.panel.Panel',
        alias:'widget.searchbar_form',

        requires:   [
            'Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield',
            'ThetusUikit.ux.form.SearchField'
        ],

        border: false,
        hideAdvancedLink: false,

        initComponent:function()    {
            this.callParent(arguments);
            if(this.hideAdvancedLink){
               this.down('#searchadvanced_btn').destroy();
            }
        },

        items:  [
            {
                xtype: 'panel',
                bodyPadding: 15,
                floating: true,
                border: false,
                itemId: 'searchadvanced_menu',
                minWidth: 400,
                items: [
                    {
                        xtype:'panel',
                        layout:{
                            type: 'hbox'
                        },
                        width:'100%',
                        items:[
                            {
                                xtype: 'box',
                                html: '<p class="align_top">Enter advanced keyword searches.</p>' +
                                    '<p class="italic"> Note: Not all search sources may support all advanced options.</p>'
                            }, {
                                xtype: 'button',
                                border: false,
                                text: 'Close',
                                itemId: 'close_panel'
                            }]
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId:'form_container',
                        items: [
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'All of these words:',
                                name: 'all_words',
                                cls: ['align_top', 'align_bottom'],
                                itemId: 'all_words',
                                tabIndex: 1,
                                configs:{ join: '', booleanType: 'all' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'This exact phrase:',
                                name: 'exact_phrase',
                                cls: ['align_top', 'align_bottom'],
                                itemId: 'exact_phrase',
                                tabIndex: 2,
                                configs:{ join: ' AND ', booleanType: 'exact' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'Any of these words:',
                                name: 'any_words',
                                cls: ['align_top', 'align_bottom'],
                                itemId: 'any_words',
                                tabIndex: 3,
                                configs:{ join: ' AND ', booleanType: 'any' }
                            },
                            {
                                xtype: 'searchadvanced_textfield',
                                fieldLabel: 'None of these words:',
                                name: 'none_words',
                                cls: ['align_top', 'align_bottom'],
                                itemId: 'none_words',
                                tabIndex: 4,
                                configs:{ join: '', booleanType: 'none' } // join member is not used for this type
                            },
                            {
                                xtype: 'panel',
                                width: 380,
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
                                        x: 300,
                                        tabIndex: 5
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

    tbar: {
        ui: 'search-prime',
        items: [{
            xtype: 'thetus-searchfield',
            width: 400,
            fieldLabel: '',
            name: 'search_terms',
            itemId: 'search_terms',
            enableKeyEvents: true,
            emptyText: 'Search'
        },
            {
                text: 'Advanced',
                itemId: 'searchadvanced_btn',
                ui: 'white'
            }]
    }
});