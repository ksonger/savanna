/* global
 Ext: false,
 describe: false, beforeEach: false, afterEach: false, it: false, expect: false, spyOn: false, sinon: false,
 ThetusTestHelpers: false,
 Savanna: false
 */
Ext.require('Savanna.Config');
Ext.require('Savanna.search.controller.SearchComponent');
Ext.require('Savanna.search.model.SearchRequest');
Ext.require('Savanna.search.model.SearchResult');
Ext.require('Savanna.search.view.SearchComponent');
Ext.require('Savanna.search.view.searchComponent.searchBody.ResultsComponent');
Ext.require('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanel');
Ext.require('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelGrid');
Ext.require('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar');
Ext.require('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals');

describe('Search Results', function () {

    var dalFixtures;

    beforeEach(function () {

        dalFixtures = Ext.clone(ThetusTestHelpers.Fixtures.DalSources);

        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function () {
        dalFixtures = null;

        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('View', function () {

        var searchComponent = null;

        var resultsComponent = null;

        var resultsController = null;

        var searchController = null;

        beforeEach(function () {
            // create a SearchResults store for results tests
            searchComponent = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

            resultsComponent = searchComponent.down('#searchresults');

            resultsController = Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');

            searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');
        });

        afterEach(function () {
            if (resultsComponent) {
                resultsComponent.destroy();
                resultsComponent = null;
            }
            if (searchComponent) {
                searchComponent.destroy();
                searchComponent = null;
            }

            resultsController = null;
            searchController = null;
        });

        it('should have a sources panel instance', function () {
            expect(resultsComponent.queryById('resultsdals') instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsDals).toBeTruthy();
        });

        it('should have a main results panel instance', function () {
            expect(resultsComponent.queryById('resultspanel') instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanel).toBeTruthy();
        });

        describe('Results Toolbar subview', function () {
            it('should apply a select handler to the "Sort By" combobox', function () {
                var combo = resultsComponent.down('#resultsSortByCombobox');

                combo.removeListener('select');

                resultsController.init();

                expect(combo.hasListener('select')).toBeTruthy();
            });

            it('should apply a select handler to the "Results Per Page" combobox', function () {
                var combo = resultsComponent.down('#resultsPageSizeCombobox');

                combo.removeListener('select');

                resultsController.init();

                expect(combo.hasListener('select')).toBeTruthy();
            });
        });

        describe('Results Sources subview', function () {

            var view = null,
                store = null,
                server = null;

            beforeEach(function () {
                //noinspection JSValidateTypes

                store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources', { autoLoad: false });

                // now set up server to get store data
                server = new ThetusTestHelpers.FakeServer(sinon);

                var readMethod = 'GET',
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, dalFixtures.allDals);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });


                spyOn(Savanna.controller.Factory, 'getController');
                view = searchComponent.down('#resultsdals');
            });

            afterEach(function () {

                view = null;

                server = null;
                store = null;
            });

            describe('createDalPanels', function () {


                afterEach(function () {

                    view = null;
                    server.restore();

                    server = null;
                    store = null;
                });


                it('should create a Panel for every record in the store', function () {
                    //noinspection JSValidateTypes
                    spyOn(view, 'add');

                    searchComponent.down('#searchdals').store = store;
                    searchComponent.down('#searchdals').createDalPanels();

                    view.store = store;

                    searchComponent.down('#searchdals').store.each(function (record) {
                        var dalId = record.data.id;
                        searchComponent.down('#searchdals').queryById(dalId).query('checkbox')[0].setValue(true);
                    });


                    view.createDalPanels();
                    // checking against (view.add.callCount - 1) because of the facets panel, which also triggers an 'add' event
                    expect(view.add.callCount - 1).toBe(store.count());
                });
            });


            describe('createDalPanel', function () {
                it('should create an instance of the ResultsOptions panel', function () {

                    var panelView = view.createDalPanel(store.getAt(0));

                    expect(panelView instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsOptions).toBeTruthy();
                });
            });

            describe('createFacetsTabPanel', function () {
                it('should create an instance of the ResultsFacets panel', function () {

                    searchComponent.down('#searchdals').store = store;
                    searchComponent.down('#searchdals').createDalPanels();

                    searchComponent.down('#resultsdals').store = store;
                    searchComponent.down('#resultsdals').createDalPanels();

                    var panelView = view.createFacetsTabPanel();

                    expect(panelView instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacets).toBeTruthy();
                });
            });

            describe('createDalFacets', function () {

                var fixtures, server, searchStore, dalFixtures, facets, resultsDals, searchDals;

                beforeEach(function () {

                    /*
                     fixtures for both results and sources needed for facets
                     */
                    fixtures = Ext.clone(ThetusTestHelpers.Fixtures.SearchResults);
                    dalFixtures = Ext.clone(ThetusTestHelpers.Fixtures.DalSources);

                    /*
                     ...and DAL panels in search and results
                     */
                    searchDals = searchComponent.down('#searchdals');
                    resultsDals = searchComponent.down('#resultsdals');


                    /*
                     search results store
                     */
                    searchStore = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.SearchResults', { autoLoad: false });

                    // now set up server to get store data
                    server = new ThetusTestHelpers.FakeServer(sinon);

                    var readMethod = 'POST',
                        testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(searchStore.getProxy(), 'read', readMethod);

                    server.respondWith(readMethod, testUrl, fixtures.searchResults);

                    searchStore.load();

                    server.respond({
                        errorOnInvalidRequest: true
                    });

                    /*
                     set up the DAL panels now that we have a sources store
                     */
                    searchDals.store = store;
                    searchDals.createDalPanels();

                    resultsDals.store = store;
                    resultsDals.createDalPanels();


                    /*
                     create facets panel and line up the last few things needed for createDalFacets method
                     */

                    resultsDals.createFacetsTabPanel();

                    searchComponent.down('#searchresults').allResultSets.push({id: 'mockDAL', store: searchStore});
                    resultsDals.store = store;

                    facets = resultsDals.queryById('resultsfacets').queryById('tab_mockDAL');

                    spyOn(facets, 'add');
                });

                afterEach(function () {
                    var teardown = [fixtures, dalFixtures, facets, resultsDals, searchDals];

                    for (var i = 0; i < teardown; i++) {
                        if (teardown[i]) {
                            teardown[i].destroy();
                            teardown[i] = null;
                        }
                    }

                    server.restore();
                    server = null;
                    searchStore = null;
                });

                it('should create a facet for each facetDescription', function () {

                    searchComponent.down('#resultsdals').createDalFacets('mockDAL');

                    var expected = store.getById('mockDAL').data.facetDescriptions.length;

                    expect(facets.add.callCount).toBe(expected);
                });

                describe('Results Facet subview', function () {
                    var myFacet, facetFixture, searchStore, server, errorRaised = false, origErrorHandler;
                    beforeEach(function () {

                        origErrorHandler = Ext.Error.handle;

                        Ext.Error.handle = function () {
                            errorRaised = true;

                            return true;
                        };

                        facetFixture = Ext.clone(ThetusTestHelpers.Fixtures.FacetModels);

                        searchStore = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.SearchResults', { autoLoad: false });

                        // now set up server to get store data
                        server = new ThetusTestHelpers.FakeServer(sinon);

                        var readMethod = 'POST',
                            testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(searchStore.getProxy(), 'read', readMethod);

                        server.respondWith(readMethod, testUrl, fixtures.searchResults);


                        searchStore.load();

                        server.respond({
                            errorOnInvalidRequest: true
                        });
                    });

                    afterEach(function () {
                        myFacet = null;
                        facetFixture = null;
                        searchStore = null;
                        server = null;
                        origErrorHandler = null;
                        errorRaised = false;
                    });

                    describe('buildFacetFilterGroup', function () {

                        it('should return the correct UI for date facets', function () {

                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.dateFacet
                            });

                            expect(myFacet.queryById('facets_published-date').queryById('dateFacet')).toBeTruthy();
                        });

                        it('should return the correct UI for string facets', function () {

                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.stringFacet,
                                searchResults: {id: 'mockDAL', store: searchStore}
                            });

                            expect(myFacet.queryById('facets_producer').queryById('stringFacet')).toBeTruthy();
                        });

                        it('should raise an error for an unexpected facetDataType', function () {

                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.unknownFacet,
                                searchResults: {id: 'mockDAL', store: searchStore}
                            });

                            expect(errorRaised).toBeTruthy();
                        });
                    });

                    describe('buildFacetFilterGroup', function () {

                        it('should add a checkbox for each facetValue', function () {
                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.stringFacet,
                                searchResults: {id: 'mockDAL', store: searchStore}
                            });
                            spyOn(myFacet.queryById('facets_producer').queryById('stringFacet'), 'add');

                            myFacet.buildFacetFilterGroup();

                            var expected = searchStore.facetValueSummaries.producer.facetValues.length;

                            expect(myFacet.queryById('facets_producer').queryById('stringFacet').add.callCount).toBe(expected);
                        });
                    });

                    describe('onFacetFilterChange', function () {

                        var server, myFacet, myCheckbox;

                        beforeEach(function () {

                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.stringFacet,
                                searchResults: {id: 'mockDAL', store: searchStore},
                                dal: store.getById('mockDAL')
                            });
                        });

                        afterEach(function () {
                            server = null;
                            myFacet = null;
                            myCheckbox = null;
                        });

                        it('should add a new facetFilterCriteria for selections that do not yet exist', function () {

                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(0);

                            myCheckbox.setValue(true);

                            var expected = {
                                facetName: 'producer',
                                facetValues: ['Unknown']
                            };

                            expect(myFacet.dal.data.facetFilterCriteria[0]).toEqual(expected);


                        });

                        it('should add a new facetValue array element to an existing facetFilterCriteria', function () {


                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(0);

                            myCheckbox.setValue(true);

                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(1);

                            myCheckbox.setValue(true);

                            var expected = {
                                facetName: 'producer',
                                facetValues: ['Unknown', 'Webizens']
                            };

                            expect(myFacet.dal.data.facetFilterCriteria[0]).toEqual(expected);


                        });

                        it('should remove facetValues from facetFilterCriteria when a checkbox is deselected ', function () {


                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(0);

                            myCheckbox.setValue(true);

                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(1);

                            myCheckbox.setValue(true);

                            myCheckbox = myFacet.queryById('facets_producer').queryById('stringFacet').items.getAt(0);

                            myCheckbox.setValue(false);

                            var expected = {
                                facetName: 'producer',
                                facetValues: ['Webizens']
                            };

                            expect(myFacet.dal.data.facetFilterCriteria[0]).toEqual(expected);


                        });
                    });

                    describe('onDateRangeChange', function () {

                        var server, myFacet, myRadio;

                        beforeEach(function () {


                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.dateFacet,
                                searchResults: {id: 'mockDAL', store: store},
                                dal: store.getById('mockDAL')
                            });
                        });

                        afterEach(function () {
                            server = null;
                            myFacet = null;
                            myRadio = null;
                        });

                        it('should create start date and end date correctly', function () {

                            myRadio = myFacet.queryById('facets_published-date').queryById('dateFacet');

                            myRadio.queryById('date_past_year').setValue(true);  // one year

                            var dateRange = myFacet.getFormattedDateRange('past_year');

                            myFacet.onDateRangeChange(myRadio);

                            expect(myFacet.dal.data.dateTimeRanges[0].Startdate).toEqual(dateRange.startDate);

                            expect(myFacet.dal.data.dateTimeRanges[0].Enddate).toEqual(dateRange.endDate);

                        });
                    });

                    describe('doCustomDateSearch', function () {

                        var server, myFacet, myRadio, myPanel;

                        beforeEach(function () {

                            myFacet = Ext.create('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
                                facet: facetFixture.dateFacet,
                                searchResults: {id: 'mockDAL', store: store},
                                dal: store.getById('mockDAL')
                            });

                            myRadio = myFacet.queryById('facets_published-date').queryById('dateFacet');

                            myPanel = myRadio.up('#facets_' + myFacet.facet.facetId).queryById('customDatesPanel');
                        });

                        afterEach(function () {
                            server = null;
                            myFacet = null;
                            myRadio = null;
                            myPanel = null;
                        });

                        it('should show and hide From and To date pickers when Custom is and is not selected', function () {


                            myRadio.queryById('date_custom').setValue(true);  // custom

                            expect(myPanel.collapsed).toBeFalsy();

                            myRadio.queryById('date_past_year').setValue(true);  // one year

                            expect(myPanel.collapsed).toBeTruthy();

                        });

                        it('should set start and end dates to search from the custom date picker values', function () {

                            myRadio = myFacet.queryById('facets_published-date').queryById('dateFacet');

                            myRadio.queryById('date_custom').setValue(true);  // custom

                            var startDate = Ext.Date.format(myPanel.queryById('fromDate').getValue(), myFacet.dateFormat),
                                endDate = Ext.Date.format(myPanel.queryById('toDate').getValue(), myFacet.dateFormat),

                                expectedStart = '1971-01-01T00:00:00.01Z',  // default
                                expectedEnd = Ext.Date.format(new Date(), myFacet.dateFormat);

                            /*
                             match the year, month and day - the exact time will never match, of course - since
                             we are matching against the textfield value for the date picker component
                              */


                            expect(startDate).toEqual(expectedStart);

                            expect(endDate.substr(0,10)).toEqual(expectedEnd.substr(0,10));

                        });
                    });
                });

            });

            describe('createFacet', function () {

                it('should return a component of the correct type', function () {

                    var facet = view.createFacet({}, {}, store.getById('mockDAL'));

                    expect(facet instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet).toBeTruthy();
                });

            });


            describe('updateDalStatus', function () {
                var dalsView = null;

                beforeEach(function () {

                    searchComponent = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

                    dalsView = searchComponent.queryById('searchdals');

                    view = searchComponent.down('#resultsdals');

                    view.store = store;

                    dalsView.store = store;

                });

                afterEach(function () {
                    view = null;

                    if (searchComponent) {
                        searchComponent.destroy();
                        searchComponent = null;
                    }

                    server.restore();

                    server = null;
                });

                it('should select a success indicator if passed a "true" value', function () {

                    dalsView.createDalPanels();

                    view.createDalPanels();

                    view.updateDalStatus('mockDAL', 'success');

                    var myDal = view.queryById('mockDAL'),
                        green = 'rgb(0, 128, 0)';

                    expect(myDal.down('#dalStatusIcon').getEl().getStyle('backgroundColor')).toEqual(green);

                });

                it('should select a fail indicator if passed a "false" value', function () {

                    dalsView.createDalPanels();

                    view.createDalPanels();

                    view.updateDalStatus('mockDAL', 'fail');

                    var myDal = view.queryById('mockDAL'),
                        red = 'rgb(255, 0, 0)';

                    expect(myDal.down('#dalStatusIcon').getEl().getStyle('backgroundColor')).toEqual(red);
                });

                it('should set the DAL item label based on a DAL id and status', function () {

                    view.store = store;

                    searchComponent.down('#searchdals').store = store;
                    searchComponent.down('#searchdals').createDalPanels();

                    view.createDalPanels();

                    var dalItem = view.query('panel[cls=results-dal]')[0],
                        expected = store.getById(dalItem.itemId).data.displayName + ' (8)';

                    view.up('#searchresults').allResultSets.push({id: dalItem.itemId, store: store});

                    view.updateDalStatus('mockDAL', 'success');


                    expect(dalItem.queryById('dalName').text).toEqual(expected);
                });
            });
        });


        describe('Grid subview', function () {

            var grid = null;
            var tools = null;

            beforeEach(function () {
                grid = resultsComponent.queryById('resultspanel').queryById('resultspanelgrid');
                tools = resultsComponent.queryById('resultspanel').queryById('resultspaneltoolbar');
            });

            it('should have a grid of the correct component type', function () {
                expect(grid instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelGrid).toBeTruthy();
            });

            it('should have a toolbar of the correct component type', function () {
                expect(tools instanceof Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPanelToolbar).toBeTruthy();
            });

            it('should have a paging toolbar', function () {
                expect(grid.queryById('gridtoolbar') instanceof Ext.toolbar.Paging).toBeTruthy();
            });

        });
    });

    describe('Controller', function () {

        var resultsComponent = null,
            resultsController = null,
            searchComponent = null,
            searchController = null,
            panel = null,
            grid = null,
            sources = null,
            store = null,
            server = null;

        beforeEach(function () {


            resultsComponent = Ext.create('Savanna.search.view.searchComponent.searchBody.ResultsComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

            resultsController = Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');

            searchComponent = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

            searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

            panel = resultsComponent.queryById('resultspanel');

            grid = panel.queryById('resultspanelgrid');

            sources = searchComponent.down('#resultsdals');

            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources', {autoLoad: false});

            // now set up server to get store data
            server = new ThetusTestHelpers.FakeServer(sinon);

            var readMethod = 'GET',
                testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

            server.respondWith(readMethod, testUrl, dalFixtures.allDals);

            store.load();

            sources.store = store;

            server.respond({
                errorOnInvalidRequest: true
            });
        });

        afterEach(function () {
            var teardown = [resultsComponent, resultsController, searchComponent, searchController, panel, grid, sources];

            for (var i = 0; i < teardown; i++) {
                if (teardown[i]) {
                    teardown[i].destroy();
                    teardown[i] = null;
                }
            }

            server.restore();
            server = null;
            store = null;
        });

        it('should have a store behind the grid panel', function () {
            expect(grid.store).toBeTruthy();
        });

        it('should have a store behind the sources panel', function () {
            expect(sources.store).toBeTruthy();
        });

        describe('onDalRender', function () {

            var dalItem;

            beforeEach(function () {

                searchComponent.down('#searchdals').store = store;
                searchComponent.down('#searchdals').createDalPanels();

                sources.createDalPanels();

                dalItem = sources.query('panel[cls=results-dal]')[0];
            });

            afterEach(function () {

                dalItem = null;

            });

            it('should add a click handler', function () {

                dalItem.removeListener('click');

                resultsController.onDalRender(dalItem, {});

                expect(dalItem.hasListener('click')).toBeTruthy();
            });

        });

        describe('onSortByChange', function () {

            beforeEach(function () {

                spyOn(searchController, 'doSearch');
            });

            it('should call doSearch"', function () {

                resultsController.onSortByChange(resultsComponent.down('#resultsSortByCombobox'));

                expect(searchController.doSearch).toHaveBeenCalled();
            });

        });

        describe('onPageComboChange', function () {

            beforeEach(function () {

                spyOn(searchController, 'doSearch');
            });

            it('should call doSearch"', function () {

                resultsController.onSortByChange(resultsComponent.down('#resultsPageSizeCombobox'));

                expect(searchController.doSearch).toHaveBeenCalled();
            });

        });

        describe('changeSelectedStore', function () {

            var dalItem, resultsPanel;

            beforeEach(function () {

                searchComponent.down('#searchdals').store = store;
                searchComponent.down('#searchdals').createDalPanels();

                sources.createDalPanels();

                dalItem = sources.query('panel[cls=results-dal]')[0];

                resultsPanel = searchComponent.down('#resultspanel');

                spyOn(resultsPanel, 'updateGridStore');
            });

            afterEach(function () {

                dalItem = null;

            });

            it('should update the results grid with the passed dal store', function () {

                dalItem.findParentByType('search_resultscomponent').allResultSets.push({id: dalItem.itemId, store: store});

                /*
                 This call swaps the store behind the grid
                 */
                resultsController.changeSelectedStore({}, {}, dalItem);

                expect(resultsPanel.updateGridStore).toHaveBeenCalled();
            });

        });
    });
});
