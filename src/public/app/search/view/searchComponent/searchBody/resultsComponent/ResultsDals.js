/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsdals',
    requires: [
        'Savanna.controller.Factory',
        'Ext.form.Label',
        'Ext.toolbar.Spacer',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets'
    ],

    title: 'Search Sources',
    region: 'west',

    /*
    NOTE: to be replaced with a class attribute I'm sure - this just
    here to get the panel to display for development.
     */
    width: 220,

    layout: 'vbox',
    border: false,
    autoScroll: true,

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    store: 'Savanna.search.store.DalSources',

    initComponent: function () {
        this.mixins.storeable.initStore.call(this);
        this.callParent(arguments);
    },

    createDalPanels: function () {

        var searchPanelDals = this.findParentByType('search_searchcomponent').down('#searchdals'); // the dal sources in search options

        /*
        add a corresponding dal source here for each dal selected in search options
         */
        this.store.each(function (record) {
            var dalId = record.get('id'),
                checked = searchPanelDals.queryById(dalId).query('checkbox')[0].getValue(),
                myPanel;
            if (checked) {
                myPanel = this.createDalPanel(record);
                this.add(myPanel);
            }   else    {
                /*
                has the user deselected this DAL, but we are showing it
                currently in the results panel?  if so, remove it
                 */
                if(this.queryById(record.get('id')) !== undefined)  {
                   this.remove(record.get('id'));
                }
            }
        }, this);

        /*
        create the facets panel that sits below the DALs
         */
        var facetPanel = this.createFacetsTabPanel();
        this.add(facetPanel);
    },

    createDalPanel: function (myRecord) {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions', {
            itemId: myRecord.get('id'),
            dalName: myRecord.get('displayName')
        });
    },

    createFacetsTabPanel: function (recreate) {

        var facetTabs;

        if(this.queryById('resultsfacets') === null || recreate) {
            facetTabs = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets', {
                itemId: 'resultsfacets'
            });

            /*
            make tabs with no... tabs.
             */
            facetTabs.tabBar.hide();
            facetTabs.componentLayout.childrenChanged = true;
            facetTabs.doComponentLayout();

        }   else    {
            facetTabs = this.queryById('resultsfacets');
        }

        var searchPanelDals = this.findParentByType('search_searchcomponent').down('#searchdals');  // the dal sources in search options

        this.store.each(function (record) {

            var dalId = record.get('id'),
                checked = searchPanelDals.queryById(dalId).query('checkbox')[0].getValue();

            var exists = (facetTabs.queryById('tab_' + record.get('id')) !== null);
            if (checked) {
                if (!exists) {
                    /*
                     the user selected this DAL, and a tab of facets doesn't exist yet for it
                     */
                    facetTabs.add({
                        xtype: 'panel',
                        itemId: 'tab_' + record.get('id')
                    });
                }
            } else {
                if (exists) {
                    /*
                     the user deselected this DAL or started a brand new search,
                     but the tab exists, presumably created by the previous search
                     */
                    facetTabs.remove('tab_' + record.get('id'));
                }
            }

        }, this);

        return facetTabs;
    },

    createDalFacets: function (id) {

        var dalRecord = this.store.getById(id),
            descriptions = dalRecord.get('facetDescriptions'),
            facets = this.queryById('resultsfacets').queryById('tab_' + id),
            me = this;



        Ext.each(this.findParentByType('search_resultscomponent').allResultSets, function (resultset) {
            if (descriptions.length > 0) {
                /*
                loop through the facetDescriptions for each set of results to determine which facets
                should be rendered when the user selects that DAL's results, and add them to the
                corresponding tab in the facets tabpanel.

                raw array loop for better performance
                 */

                var len = descriptions.length;

                for(var i=0;i<len;i++)  {
                    if(facets.queryById('facet_' + dalRecord.get('id') + '_' + descriptions[i].facetId) === null)   {
                        var facetElement = me.createFacet(descriptions[i], resultset, dalRecord);
                        facets.add(facetElement);
                    }
                }
            }
        });
    },

    createFacet: function (facet, results, dalRecord) {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
            facet: facet,
            searchResults: results,
            dal: dalRecord,
            itemId: 'facet_' + dalRecord.get('id') + '_' + facet.facetId
        });
    },

    updateDalStatus: function (dalId, status) {
        /*
        set the status icon - pending, success or fail - as well as the text,
        which is the display name and number of results returned
         */
        var myDal = this.queryById(dalId);

        var styleStatus = {
            'success': myDal.dalLoadSuccess,
            'fail': myDal.dalLoadFail,
            'pending': myDal.dalLoadPending,
            'none': myDal.dalLoadNone
        };
        myDal.down('#dalStatusIcon').getEl().setStyle(styleStatus[status]);

        var me = this,
            count = 0;

        Ext.each(this.findParentByType('search_resultscomponent').allResultSets, function(searchResult)  {

            if(searchResult.id === dalId)    {
                if(status !== 'fail')   {
                    count = searchResult.store.totalCount;
                }

                /*
                 nasty bug here - the first DAL element not visually refreshing it's text value or icon.
                 I have tried every form of update() and layout() method I can find/think of to correct it, no luck yet.
                 Assistance appreciated, if anyone has any insight...
                 */

                myDal.down('#dalName').setText(me.store.getById(dalId).get('displayName') + ' ' + '(' + count + ')');
            }
        });
    }
});
