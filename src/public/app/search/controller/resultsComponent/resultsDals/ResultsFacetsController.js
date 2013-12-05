/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsFacetsController',
    {
        extend: 'Deft.mvc.ViewController',

        control: {
            //the close button
            showHideFacets: {
                click: 'onHideShowFacetsClick'
            }
        },


        onHideShowFacetsClick: function (btn) {
            Ext.each(btn.up('#resultsfacets').getActiveTab().query('panel[cls=results-facet]'), function (facet) {
                if (facet) {
                    if (!btn.facetsExpanded) {
                        btn.setText('Hide All');
                        facet.expand();
                    } else {
                        facet.collapse();
                        btn.setText('Show All');
                    }
                }
            });
            btn.facetsExpanded = !btn.facetsExpanded;
        },

        init: function () {
            return this.callParent(arguments);
        }

    }
);