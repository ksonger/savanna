/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 8/15/13
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationComboBox', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.search_searchlocationcombobox',
    store: null,
    queryParam: 'q',
    matchFieldWidth: false,
    shrinkWrap: 3,
    cls: 'SearchLocationComboBox',

    requires: [
        'Ext.XTemplate',
        'Savanna.search.store.SearchLocation'
    ],

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    emptyText: 'Find Location',

    listConfig: {
        cls: 'SearchLocationComboBox',
        width: 350,
        getInnerTpl: function() {
            return '<table class="searchMapLocationResults">' +
                '<tr valign="top">' +
                '<td width="50">' +
                '<i class="locationButtonI" name="zoomToLocButton"></i></td>' +
                '<td>' +
                '<b>{name}</b> <br />' +
                'Loc: {administrativeNames}  <br />' +
                'Type: {locType}  <br />' +
                'Pop: {population}' +
                '</td>' +
                '</tr>' +
                '</table>';
        },

        listeners: {
            'beforeitemclick': function() {
                this.enableBubble('itemclick');
            }
            ,
            'beforerender': function(c) {
                c.pagingToolbar = Ext.create(Ext.toolbar.Toolbar, {
                    cls: 'searchLocation-results'
                });
            },
            'beforerefresh': function(c, eOpts){
                c.pagingToolbar.removeAll();
                c.pagingToolbar.add('Total Results: ' + this.store.getCount());
            }
        }
    },

    listeners: {
        // prevent collapsing if the same value is selected
        'beforeselect': function (combo, record, index) {
            return false;
        },

        // The combobox boundlist does not bubble itemclick events without knowing target
        // The default bubble itemclicks to the parent and then dispatches this custom event
        'itemclick' : function (list, record, el, index, event, eopts) {
            if (event.target.name == "zoomToLocButton"){
                this.fireEvent('zoomButtonClick', {viewBox: record.data.viewBox, parentComboBox: this});
            }
        }
    },

    initComponent: function () {
        this.store = Ext.create('Savanna.search.store.SearchLocation');
        this.callParent();
    }
});
