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
    bubbleEvents: ['search:changeSelectedStore'],
    requires: [
        'Savanna.controller.Factory',
        'Ext.form.Label',
        'Ext.toolbar.Spacer',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineSearchbar'
    ],

    title: 'Search Sources',
    region: 'west',
    headerPosition: 'right',
    collapsedCls : 'light-blue',
    header:{
        ui:'light-blue'
    },
    /*
     NOTE: to be replaced with a class attribute I'm sure - this just
     here to get the panel to display for development.
     */
    width: 220,
    height:'100%',

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

    createDalPanels: function (sources) {

        /*
         remove DALs that have been deselected
         */

        var searchPanelDals = this.findParentByType('search_searchcomponent').down('#searchdals'); // the dal sources in search options

        if (!this.queryById('refinesearch')) {
            this.add(this.createRefineSearchPanel());
        }

        if (!this.queryById('refineterms')) {
            this.add(this.createRefineTermsPanel());
        }

        var facetTabs = this.createFacetsTabPanel();    // always do this...

        if (!this.queryById('resultsfacets')) {

            this.add(facetTabs);    // ...but only add if doesn't exist
        }

/*      this just seems to be trying to delete strings I'm commenting it out in case it is needed.

  this.store.each(function (record) {
            var dalId = record.get('id'),
                checked = searchPanelDals.queryById(dalId).query('checkbox')[0].getValue();
            if (!checked && this.queryById(record.get('id')) !== undefined) {
                this.remove(record.get('id'));
            }
        }, this);*/

        /*
         create any DALs in the list of sources that do not already
         have a corresponding DAL in the panel
         */
        var startingItemsLength = this.items.length; // determine where to insert the dals, above facets

        Ext.each(sources, function (record) {
            var dalId = record.get('id'),
                myPanel,
                exists = this.queryById(dalId);

            if (!exists) {
                myPanel = this.createDalPanel(record);
                myPanel.down('#dalName').setText(record.get('displayName'));

                this.insert(this.items.length - startingItemsLength, myPanel);
            } else {
                this.updateDalStatus(dalId);
            }

        }, this);

    },

    createDalPanel: function (myRecord) {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions', {
            itemId: myRecord.get('id'),
            dalName: myRecord.get('displayName')
        });
    },

    createRefineSearchPanel: function () {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineSearchbar', {
            itemId: 'refinesearch'
        });
    },

    createRefineTermsPanel: function () {
        return Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsRefineTerms', {
            itemId: 'refineterms'
        });
    },

    createFacetsTabPanel: function () {
        var facetTabs;

        if (!this.queryById('resultsfacets')) {
            facetTabs = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets', {
                itemId: 'resultsfacets'
            });

            /*
             hide actual tabs.
             */
            facetTabs.tabBar.hide();
            facetTabs.componentLayout.childrenChanged = true;
            facetTabs.doComponentLayout();

        } else {
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

        if (facets !== null) {
            facets.removeAll();
        }

        Ext.each(this.findParentByType('search_resultscomponent').allResultSets, function (resultset) {
            if (resultset.id === id) {
                if (descriptions.length > 0) {

                    /*
                     loop through the facetDescriptions for each set of results to determine which facets
                     should be rendered when the user selects that DAL's results, and add them to the
                     corresponding tab in the facets tabpanel.

                     raw array loop for better performance
                     */

                    var len = descriptions.length;

                    for (var i = 0; i < len; i++) {
                        var facetElement;

                        facetElement = me.createFacet(descriptions[i], resultset, dalRecord);
                        if (facetElement) {
                            facets.add(facetElement);
                        }
                    }
                }
            }
        });
    },

    createFacet: function (facet, results, dalRecord) {
        var hasValues = results.store.facetValueSummaries[facet.facetId].facetValues.length;
        var isStringFacet = (facet.facetDataType === 'STRING'),
            createdFacet;
        if (!isStringFacet || (isStringFacet && hasValues)) {
            createdFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                facet: facet,
                searchResults: results,
                dal: dalRecord,
                itemId: 'facet_' + dalRecord.get('id') + '_' + facet.facetId
            });
        }
        return createdFacet;
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

        Ext.each(this.findParentByType('search_resultscomponent').allResultSets, function (searchResult) {

            if (searchResult.id === dalId) {
                if (status !== 'fail') {
                    count = searchResult.store.totalCount;
                }

                myDal.down('#dalName').setText(me.store.getById(dalId).get('displayName') + ' ' + '(' + count + ')');
            }
        });
    }
});
