/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsDals', {
    extend: 'Deft.mvc.ViewController',

    views: [
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals'
    ],

    requires: [

    ],

    store: null,

    control: {
        refinesearch: {
            live: true
        },
        results_refineSearch: {
            live: true
        },
        refineterms:    {
            live: true
        },
        resultsfacets:  {
            live: true
        },
        results_refineSearchFacets: {
            live: true
        },
        results_searchSources:  {
            live: true
        }
    },

    constructor: function (options) {

        this.store = Ext.data.StoreManager.lookup('Savanna.search.store.DalSources');

        this.callParent(arguments);
    },



    init: function (app) {

        this.getSearchComponent().on('resultsdals:createpanels', Ext.bind(this.createDalPanels, this, [], true));

        this.getSearchComponent().on('resultsdals:updatestatus', Ext.bind(this.updateDalStatus, this, [], true));

        this.getSearchComponent().on('resultsdals:createfacets', Ext.bind(this.createDalFacets, this, [], true));

        return this.callParent(arguments);
    },

    getSearchComponent: function()  {
        return this.getView().findParentByType('search_searchcomponent');
    },

    getResultsComponent: function()  {
        return this.getView().findParentByType('search_resultscomponent');
    },

    createDalPanels: function (params) {

        /*
         remove DALs that have been deselected
         */

        var searchPanelDals = this.getSearchComponent().down('#searchdals'); // the dal sources in search options

        var resultsSearchSources = Ext.create('Ext.panel.Panel', {
            xtype: 'panel',
            itemId: 'results_searchSources',
            ui: 'simple',
            title: 'search sources',
            layout: 'vbox',
            align: 'left',
            margin: '0 0 10 0'
        });
        /* This panel is hidden until the bug with refine search can be fixed. */
        var resultsRefineSearch = Ext.create('Ext.panel.Panel', {
            itemId: 'results_refineSearch',
            hidden: true,
            bbar: {
                padding: 0,
                margin: '10 0 0 0',
                items: ['->', {
                    text: 'Keyword Reset',
                    itemId: 'resultsFacetsReset',
                    padding: 0,
                    margin: 0
                }]
            }
        });

        var resultsSearchFacets = Ext.create('Ext.container.Container', {
            itemId: 'results_refineSearchFacets',
            cls: 'refineSearchFacets',
            padding: '0 10 10 10'
        });
        this.getView().insert(0, resultsSearchSources);

        if (!this.getRefinesearch()) {

            this.getResults_refineSearch().add(this.createRefineSearchPanel());

            if (!this.getResults_refineSearch()) {
                this.getView().insert(1, resultsRefineSearch);
            }

        }

        if (!this.getRefineterms()) {

            this.getResults_refineSearch().add(this.createRefineTermsPanel());

            if (!this.getResults_refineSearch()) {
                this.getView().insert(1, resultsRefineSearch);
            }

        }

        var facetTabs = this.createFacetsTabPanel();    // always do this...

        if (!this.getResultsfacets()) {

            this.getResults_refineSearchFacets().add(facetTabs);    // ...but only add if doesn't exist

            if (!this.getResults_refineSearchFacets()) {
                this.getView().insert(2, resultsSearchFacets);
            }

        }


        this.store.each(function (record) {
            var dalId = record.get('id'),
                checked = searchPanelDals.queryById(dalId).query('checkbox')[0].getValue();
            if (!checked && this.getView().queryById(record.get('id')) !== undefined) {
                this.getView().remove(record.get('id'));
            }
        }, this);

        /*
         create any DALs in the list of sources that do not already
         have a corresponding DAL in the panel
         */
        var startingItemsLength = this.getView().items.length; // determine where to insert the dals, above facets

        Ext.each(params.sources, function (record) {
            var dalId = record.get('id'),
                myPanel,
                exists = this.getView().queryById(dalId);

            if (!exists) {
                myPanel = this.createDalPanel(record);
                myPanel.setText(record.get('displayName'));

                this.getResults_searchSources().insert(this.getView().items.length - startingItemsLength, myPanel);
            } else {

                this.updateDalStatus({dalId: dalId});
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

        if (!this.getView().queryById('resultsFacets')) {
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
            facetTabs = this.getResultsFacets();
        }

        var searchPanelDals = this.getSearchComponent().down('#searchdals');  // the dal sources in search options

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

    createDalFacets: function (params) {

        var dalRecord = this.store.getById(params.dalId),
            descriptions = dalRecord.get('facetDescriptions'),
            facets = this.getResultsfacets().queryById('tab_' + params.dalId),
            me = this;

        if (facets !== null) {
            facets.removeAll();
        }

        Ext.each(this.getResultsComponent().allResultSets, function (resultset) {
            if (resultset.id === params.dalId) {
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

    updateDalStatus: function (params) {

        /*
         set the status icon - pending, success or fail - as well as the text,
         which is the display name and number of results returned
         */
        var myDal = this.getView().queryById(params.dalId);

        var styleStatus = {
            'success': 'icon-success',
            'fail': 'icon-alert',
            'pending': 'icon-pending',
            'none': 'loadNone'
        };
        myDal.setIconCls(styleStatus[params.status]);

        var me = this,
            count = 0;

        Ext.each(this.getResultsComponent().allResultSets, function (searchResult) {

            if (searchResult.id === params.dalId) {
                if (status !== 'fail') {
                    count = searchResult.store.totalCount;
                }

                myDal.setText(me.store.getById(params.dalId).get('displayName') + ' ' + '(' + count + ')');
            }
        });
    }
});
