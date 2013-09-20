/* global Ext: false, Savanna: false */
/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/17/13
 * Time: 11:08 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.SearchComponent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchcomponent',

    requires: [
        'Savanna.search.view.searchComponent.SearchBody',
        'Savanna.search.view.searchComponent.SearchBar',
        'Savanna.search.view.searchComponent.SearchToolbar',
        'Savanna.controller.Factory',
        'Savanna.search.controller.SearchDals'
    ],

    layout: 'border',
    flex:4,
    //todo: uncomment if this component is not in a floating window
//    title: 'Search',
    closable:false,
    border:false,

    firstResultsReturned:false,

    items: [
        {
            xtype: 'search_searchbar',
            itemId: 'searchbar',
            region: 'north'
        },
        {
            xtype: 'search_searchbody',
            itemId: 'searchbody',
            region: 'center'
        }
    ],

    dockedItems: [
        {
            xtype: 'search_searchtoolbar',
            itemId: 'searchtoolbar'
        }
    ],

    initComponent: function () {
        this.callParent(arguments);

        Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');
    }
});