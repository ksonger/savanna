/**
 * TODO: Document what events we may emit...
 */
Ext.define('Savanna.search.view.searchComponent.SearchBody', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchbody',

    requires: [
        'Ext.tab.Panel',
        'Savanna.search.view.searchComponent.searchBody.SearchDals',
        'Savanna.search.view.searchComponent.searchBody.SearchMap',
        'Savanna.search.view.searchComponent.searchBody.ResultsComponent',
        /*
         Why is this needed?  If the controller is listed in the requires for the view,
         the whole app blows up with no error messages.  If this is removed from these
         requires, the console complains that the controller has had to be loaded
         asynchronously.  Maybe because results is in a tab that has not been rendered..?
          */
        'Savanna.search.controller.ResultsComponent',

        'Savanna.controller.Factory'
    ],

    layout: 'fit',
    border: false,
    currentPanel: 'searchoptions',

    items: [
        {
            xtype: 'panel',
            layout: 'border',
            itemId: 'mainsearchoptions',
            border: false,
            items: [
                {
                    xtype: 'tabpanel',
                    cls: 'flat-tab',
                    border: false,
                    itemId: 'mainsearchtabpanel',
                    activeTab: 0,
                    flex: 3,
                    anchor: '100% 100%',
                    tabPosition: 'top',
                    region: 'center',
                    items: [
                        {
                            title: 'Search Sources',
                            autoScroll: true,
                            cls: 'search-dal',
                            itemId:'searchdals',
                            xtype: 'search_searchdals'
                        },
                        {
                            title: 'Location',
                            itemId: 'searchMap',
                            xtype: 'search_searchmap'
                        }
                    ]
                }
            ]

        },
        {
            xtype: 'search_resultscomponent',
            layout: 'border',
            itemId: 'searchresults'
        }
    ],

    dockedItems: [
        {
            xtype: 'toolbar',
            width: '100%',
            itemId: 'searchbodytoolbar',
            items: [
                {
                    xtype: 'button',
                    text: 'Search Options',
                    itemId: 'optionsbutton'
                },
                {
                    xtype: 'button',
                    text: 'Results',
                    itemId: 'resultsbutton'
                }
            ]
        }
    ],
    bbar: [
        '->',
        {
            xtype: 'button',
            ui: 'commit',
            scale: 'large',
            text: 'Search',
            itemId: 'toolbarsearchbutton'
        }
    ]
});
