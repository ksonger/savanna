/**
 * TODO: Document what events we may emit...
 */
Ext.define('Savanna.search.view.searchComponent.SearchBody', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.search_searchbody',

    requires: [
        'Savanna.search.view.searchComponent.searchBody.SearchDals',
        'Savanna.search.view.searchComponent.searchBody.SearchMap',
        'Savanna.search.view.searchComponent.searchBody.ResultsComponent',
        /*
         Why is this needed?  If the controller is listed in the requires for the view,
         the whole app blows up with no error messages.  If this is removed from these
         requires, the console complains that the controller has had to be loaded
         asynchronously.  Maybe because results is in a tab that has not been rendered..?
          */
        //'Savanna.search.controller.ResultsComponent',

        'Savanna.controller.Factory'
    ],

    layout: 'fit',
    tabBar:{
        ui: 'search-prime-tabs'
    },
    items: [
        {
            title: 'Search Options',
            layout: 'card',
            itemId: 'mainsearchoptions',
            tabConfig: {
                ui: 'search-prime-tabs'
            },
            items: [
                {
                    autoScroll: true,
                    cls: 'search-dal',
                    itemId:'searchdals',
                    xtype: 'search_searchdals'
                },
                {
                    itemId: 'searchMap',
                    xtype: 'search_searchmap'
                }
            ],
 
            tbar: {
                ui: 'light-toolbar',
                defaults: {
                    ui: 'toggle',
                    toggleGroup: 'search-options',
                    allowDepress: false
                },
                items: [{
                    text: 'Search Sources',
                    itemId: 'searchDalsButton',
                    width: 92,
                    pressed: true
                }, { 
                    xtype: 'tbseparator' 
                }, {
                    text: 'Location Search',
                    itemId: 'searchMapButton'
                }]},
            bbar: {
                ui: 'dark-toolbar',
                cls: 'toolbar-paddingSmall',
                items: [
                '->', {
                        xtype: 'button',
                        ui: 'commit',
                       
                        scale: 'large',
                        text: 'Search',
                        itemId: 'toolbarsearchbutton'
                    }
            ]}
        }, {
            xtype: 'search_resultscomponent',
            layout: 'border',
            itemId: 'searchresults',
            title: 'Search Results',

            tabConfig: {
                ui: 'search-prime-tabs'
            }
        }
    ]
});
