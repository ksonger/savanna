Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsDals_resultsoptions',

    requires: [
        'Ext.form.field.Checkbox',
        'Ext.draw.Text'
    ],

    header: false,

    width: '100%',

    itemId: 'dalResultOptions',

    bodyPadding:5,

    cls: 'results-dal',



    /*
    temporary, to be replaced by design team.  This approach was requested by Joel
    as the easiest path for them to update with final styles.  Values are just utility,
    to line up text and icons, and leave room for the facets panel below the DALs.
     */

    dalLoadNone: {
        backgroundColor:'white',
        width:'20px',
        height:'20px',
        'float':'right',
        'margin-right':'10px'
    },
    dalLoadPending: {
        backgroundColor:'yellow',
        width:'20px',
        height:'20px',
        'float':'right',
        'margin-right':'10px'
    },
    dalLoadFail: {
        backgroundColor:'red',
        width:'20px',
        height:'20px',
        'float':'right',
        'margin-right':'10px'
    },
    dalLoadSuccess: {
        backgroundColor:'green',
        width:'20px',
        height:'20px',
        'float':'right',
        'margin-right':'10px'
    },

    initComponent: function () {
        this.items = this.setupItems();

        this.callParent(arguments);
    },

    setupItems: function () {

        return [
            {
                xtype:'text',
                itemId: 'dalName',
                height:20,
                /*
                 NOTE: to be replaced with a class attribute I'm sure - this just
                 here to get the panel to display for development.
                 */
                width:'65%'
            },
            {
                xtype: 'box',
                itemId: 'dalStatusIcon',
                style:  this.dalLoadNone
            }
        ];
    }
});