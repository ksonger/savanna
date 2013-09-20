/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 8/15/13
 * Time: 12:59 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationItem', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchLocationItem',

    requires: [
        'Savanna.controller.Factory'
    ],

    layout: 'vbox',

    viewBox: null,
    width: '100%',
    items: [],
    dockedItems: [
        {
            xtype: 'toolbar',
            itemId: 'searchLocationItemDockedItems',
            border: false,
            dock: 'left',
            layout: 'vbox',
            items: [
                {
                    xtype: 'button',
                    itemId: 'zoomToLocation',
                    tooltip: 'Zoom to this location',
                    text: '+'
                }
            ]
        }
    ],

    initComponent: function() {
        this.items = this.setupItems();
        this.callParent(arguments);

        this.on('beforerender', Ext.bind(function() {
            var config = this.initialConfig || {};
            var locationName = config.name || 'NO NAME';
            var locationPlace = config.location || [];
            var locationType = config.locationType || 'NO TYPE';
            var population = config.population || 'NO POP';
            var viewBox = config.viewBox || null;

            this.down('#locationName').text = locationName;
            this.down('#locationPlace').text = 'Loc: ' + locationPlace.slice(1).join(', ');
            this.down('#locationType').text = 'Type: ' + locationType;
            this.down('#locationPopulation').text = 'Pop: ' + population;
            this.viewBox = viewBox;

        }, this));
    },
    setupItems: function() {
        return [
            {
                xtype: 'label',
                itemId: 'locationName',
                text: 'NO NAME'
            },
            {
                xtype: 'label',
                itemId: 'locationPlace',
                text: 'Loc: '
            },
            {
                xtype: 'label',
                itemId: 'locationType',
                text: 'Type: '
            },
            {
                xtype: 'label',
                itemId: 'locationPopulation',
                text: 'Pop: '
            }
        ]
    }
});