/* global
    Ext: false,
    describe: false, beforeEach: false, afterEach: false, it: false, expect: false, sinon: false, spyOn: false,
    ThetusTestHelpers: false
 */
Ext.require('Savanna.Config');
Ext.require('Savanna.search.model.SearchLocation');
Ext.require('Savanna.search.store.SearchLocation');
Ext.require('Savanna.search.view.SearchComponent');
Ext.require('Savanna.search.view.searchComponent.SearchBody');
Ext.require('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationForm');
Ext.require('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationItem');


describe('Search Location', function() {
    var fixtures = {};

    beforeEach(function() {
        fixtures = Ext.clone(ThetusTestHelpers.Fixtures.LocationSources);

        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        fixtures = null;
        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('Savanna.search.model.SearchLocation', function() {

        describe('constructor', function() {

            it('should be able to create a model with canonical data', function() {
                var loc = Ext.create('Savanna.search.model.SearchLocation', fixtures.locationRecord);
                expect(loc instanceof Savanna.search.model.SearchLocation).toBeTruthy();
                expect(loc.get('administrativeNames').length).toBeGreaterThan(0);
            });
        });
    });

    describe('Savanna.search.store.SearchLocation', function() {
        var server = null,
            store = null;

        beforeEach(function() {
            // NOTE: this has to happen BEFORE your create a FakeServer,
            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.SearchLocation');

            server = new ThetusTestHelpers.FakeServer(sinon);
        });

        afterEach(function() {
            server.restore();

            server = null;
            store = null;
        });

        describe('default data loading', function() {

            it('should load data', function() {
                var readMethod = 'GET';

                expect(store.getTotalCount()).toBe(0);

                var testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.locationData);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });

                expect(store.getTotalCount()).toBe(10);
                expect(store.data.items[0].data.population).toBe(9854000);
            });
        });
    });

    describe('Savanna.search.view.searchComponent.searchBody.SearchDals', function() {
        var view = null;

        beforeEach(function() {
            //noinspection JSValidateTypes
            view = Ext.create('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationForm', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
        });

        afterEach(function() {
            if (view && view.destroy) {
                view.destroy();
            }

            view = null;
        });

        describe('createSearchLocationItemPanel', function() {
            it('should create an instance of the SearchLocationItem panel', function() {
                var model = new Savanna.search.model.SearchLocation(fixtures.locationRecord);

                var panelView = view.createSearchLocationItemPanel(model);

                expect(panelView instanceof Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationItem).toBeTruthy();
            });
        });

        describe('createSearchLocationItems', function() {
            var server = null,
                store = null;

            beforeEach(function() {
                // NOTE: this has to happen BEFORE your create a FakeServer,
                store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.SearchLocation');

                server = new ThetusTestHelpers.FakeServer(sinon);

                var readMethod = 'GET',
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.locationData);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });
            });

            afterEach(function() {
                server.restore();

                server = null;
                store = null;
            });

            it('should create a Panel for every record in the store', function() {
                var view = Ext.create('Savanna.search.view.searchComponent.searchBody.searchMap.SearchLocationForm', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

                //noinspection JSValidateTypes
                spyOn(view, 'add');

                view.createSearchLocationItems();

                expect(view.add.callCount).toBe(view.getStore().count());
            });
        });

    });
});