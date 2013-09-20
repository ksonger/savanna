/* global
        Ext: false,
        describe: false, beforeEach: false, afterEach: false, it: false, expect: false, spyOn: false, sinon: false,
        ThetusTestHelpers: false, Savanna: false
 */
Ext.require('Savanna.Config');
Ext.require('Savanna.search.controller.SearchComponent');
Ext.require('Savanna.search.model.SearchRequest');
Ext.require('Savanna.search.model.SearchResult');
Ext.require('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield');
Ext.require('Savanna.search.view.searchComponent.SearchBar');
Ext.require('Savanna.search.view.searchComponent.searchBar.SearchForm');
Ext.require('Savanna.search.view.searchComponent.SearchBody');
Ext.require('Savanna.search.view.SearchComponent');
Ext.require('Savanna.search.view.searchComponent.SearchToolbar');

describe('Search Component', function () {

    var dalFixtures;
    var dalStore;
    var server;

    beforeEach(function () {

        /*
         NOTE: because the search component is comprised of the SearchDals component which autoLoads the dalSources,
         we need to set up our mockServer so that it will respond to that request when it happens...
         */
        dalFixtures = Ext.clone(ThetusTestHelpers.Fixtures.DalSources);
        server = new ThetusTestHelpers.FakeServer(sinon);
        dalStore = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources');
        server.respondWith('GET', dalStore.getProxy().url, dalFixtures.allDals);

        // Even though the request will happen later (at some point when the component is instantiated), we set the
        // server to respond now so that it's ready for that future call
        server.respond({
            errorOnInvalidRequest: true
        });

        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function () {
        if (server) {
            server.restore();
            server = null;
        }

        dalFixtures = null;
        dalStore = null;

        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });
    describe('getCustomSearchSelections', function() {
        var formPanel = {};
        var component = {};
        var controller = {};
        beforeEach(function() {
            component = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
            controller = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');
            formPanel =  Ext.create('Ext.form.Panel', {
                title: 'testing',
                layout: 'vbox',

                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'testing',
                        labelAlign: 'left',
                        labelWidth: 200,
                        labelPad: 5,
                        name: 'testing',
                        cls: 'customInputField'
                    },{
                        xtype: 'combobox',
                        valueField: 'value',
                        displayField: 'value',
                        forceSelection: true,
                        queryMode: 'local',
                        editable: false,
                        fieldLabel: 'testing',
                        labelAlign: 'left',
                        labelWidth: 200,
                        labelPad: 5,
                        name: 'testing',
                        cls: 'customInputField',
                        value: 'testing'

                    },{
                        xtype: 'checkbox',
                        checked: true,
                        fieldLabel: 'testing',
                        labelAlign: 'left',
                        labelWidth: 200,
                        labelPad: 5,
                        name: 'testing',
                        cls: 'customInputField',
                        value: 'testing'

                    },{
                        xtype: 'radiogroup',
                        defaultType: 'radiofield',
                        layout: 'hbox',
                        fieldLabel: 'testing',
                        labelAlign: 'left',
                        labelWidth: 200,
                        labelPad: 5,
                        name: 'testing',
                        cls: 'customInputField',
                        value: null

                    },{
                        xtype: 'datefield',
                        value: 1347298216073,
                        fieldLabel: 'testing',
                        labelAlign: 'left',
                        labelWidth: 200,
                        labelPad: 5,
                        name: 'testing',
                        cls: 'customInputField'
                    },{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        cls: 'customInputField',
                        items: [
                            {
                                xtype: 'combobox',
                                value: 'testing',
                                valueField: 'value',
                                displayField: 'value',
                                forceSelection: true,
                                queryMode: 'local',
                                editable: false
                            },{
                                xtype: 'textfield',
                                name: 'keyValueText'
                            },{
                                xtype: 'button',
                                text: 'X',
                                itemId: 'keyValueToggleInput'
                            }
                        ]
                    }
                ]
            });
        });
        afterEach(function () {
            formPanel = null;
            if (controller) {
                controller.destroy();
                controller = null;
            }
            if (component) {
                component.destroy();
                component = null;
            }
        });
        it('should return 6 objects with a key and value property', function() {
            var test = controller.getCustomSearchSelections(formPanel);
            expect(test.length).toBe(6);
            for(var i = 0; i < 6; i++){
                expect(test[i].hasOwnProperty('key')).toBeTruthy();
                expect(test[i].hasOwnProperty('value')).toBeTruthy();
                // test[i].value should either have something in it that evals to true or be an empty string
                expect(test[i].value || test[i].value === '').toBeTruthy();
            }
        });
    });
    describe('View', function () {
        var component = null;

        beforeEach(function () {
            component = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
        });

        afterEach(function () {
            if (component) {
                component.destroy();
                component = null;
            }
        });

        it('should have a toolbar instance', function () {
            expect(component.queryById('searchtoolbar') instanceof Savanna.search.view.searchComponent.SearchToolbar).toBeTruthy();
        });

        it('should have a searchbar instance', function () {
            expect(component.queryById('searchbar') instanceof Savanna.search.view.searchComponent.SearchBar).toBeTruthy();
        });

        it('search component should have a searchbody instance', function () {
            expect(component.queryById('searchbody') instanceof Savanna.search.view.searchComponent.SearchBody).toBeTruthy();
        });

        describe('SearchBar subview', function () {
            describe('buildSearchString method', function () {
                var searchbar = null;

                beforeEach(function () {
                    searchbar = component.queryById('searchbar');

                    searchbar.queryById('search_terms').setValue('search bar terms');
                    searchbar.queryById('all_words').setValue('some text');
                    searchbar.queryById('exact_phrase').setValue('other text');
                    searchbar.queryById('any_words').setValue('more and more text');
                    searchbar.queryById('none_words').setValue('bad terms');
                });

                it('should correctly assemble a search string from form fields', function () {
                    var result = searchbar.buildSearchString();
                    var expected = 'search bar terms AND some AND text AND "other text" AND more OR and OR more OR text NOT bad NOT terms';

                    expect(result).toEqual(expected);
                });

                it('should call getBooleanValue on each field', function () {
                    spyOn(searchbar.queryById('all_words'), 'getBooleanValue');
                    spyOn(searchbar.queryById('exact_phrase'), 'getBooleanValue');
                    spyOn(searchbar.queryById('any_words'), 'getBooleanValue');
                    spyOn(searchbar.queryById('none_words'), 'getBooleanValue');

                    searchbar.buildSearchString();

                    expect(searchbar.queryById('all_words').getBooleanValue).toHaveBeenCalled();
                    expect(searchbar.queryById('exact_phrase').getBooleanValue).toHaveBeenCalled();
                    expect(searchbar.queryById('any_words').getBooleanValue).toHaveBeenCalled();
                    expect(searchbar.queryById('none_words').getBooleanValue).toHaveBeenCalled();
                });
            });
        });
    });

    describe('Controller', function () {
        var component = null,
            toolbar = null,
            controller = null;

        beforeEach(function () {
            component = Ext.create('Savanna.search.view.SearchComponent', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
            toolbar = component.queryById('searchtoolbar');
            controller = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

        });

        afterEach(function () {
            if (controller) {
                controller.destroy();
                controller = null;
            }

            if (component) {
                component.destroy();
                component = null;
            }

            toolbar = null;
        });

        describe('handleSearchTermKeyUp callback', function () {

            beforeEach(function () {
                spyOn(controller, 'doSearch');
            });

            it('should call do search on keypress "Enter"', function () {
                controller.handleSearchTermKeyUp(null, {keyCode: 13 });

                expect(controller.doSearch).toHaveBeenCalled();
            });

            it('should not do search if not "Enter"', function () {
                controller.handleSearchTermKeyUp(null, { keyCode: 0 });

                expect(controller.doSearch).not.toHaveBeenCalled();
            });
        });

        describe('managing SearchBar subview events', function () {
            var searchbar = null;

            beforeEach(function () {
                searchbar = component.queryById('searchbar');
                searchbar.queryById('search_terms').setValue('search bar terms');
                searchbar.queryById('all_words').setValue('some text');
                searchbar.queryById('exact_phrase').setValue('other text');
                searchbar.queryById('any_words').setValue('more and more text');
                searchbar.queryById('none_words').setValue('bad terms');

                var readMethod = 'GET',
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(dalStore.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, dalFixtures.allDals);

                dalStore.getProxy().addSessionId = false; // so our URL is clean
                dalStore.load();

                server.respond({
                    errorOnInvalidRequest: true
                });
            });

            afterEach(function () {
                searchbar = null;

                if (server) {
                    server.restore();
                    server = null;
                }
                dalStore = null;
                dalFixtures = null;
            });

            it('should be able to hide the menu', function () {
                controller.hideMenu(searchbar.items.first());

                expect(searchbar.queryById('searchadvanced_menu').isVisible()).toBeFalsy();
            });

            it('should align the advanced menu below the simple search textfield', function () {
                var button = component.queryById('searchadvanced_btn');
                var menu = button.menu;

                spyOn(menu, 'alignTo');

                controller.alignMenuWithTextfield(button);

                expect(menu.alignTo).toHaveBeenCalled();
            });

            it('should build the search string', function () {

                component.down('#searchdals').store = dalStore;
                component.down('#searchdals').createDalPanels();

                component.down('#resultsdals').store = dalStore;
                component.down('#resultsdals').createDalPanels();

                spyOn(searchbar, 'buildSearchString').andCallThrough();
                controller.doSearch(searchbar);

                expect(searchbar.buildSearchString).toHaveBeenCalled();
            });

            it('should remove search field values when "Start New Search" is selected', function () {
                var form = searchbar.queryById('search_form');
                controller.handleNewSearch(component.queryById('searchbar'));

                expect(form.queryById('search_terms').getValue()).toEqual('');
                expect(form.queryById('all_words').getValue()).toEqual('');
                expect(form.queryById('exact_phrase').getValue()).toEqual('');
                expect(form.queryById('any_words').getValue()).toEqual('');
                expect(form.queryById('none_words').getValue()).toEqual('');
            });
        });

        describe('search clear button', function () {
            var searchbar = null;

            beforeEach(function () {
                searchbar = component.queryById('searchbar');
                searchbar.queryById('search_terms').setValue('search bar terms');
            });

            afterEach(function () {
                searchbar = null;
            });

            it('should clear the search text input', function () {
                controller.clearSearch(searchbar.queryById('search_clear'));
                var form = searchbar.queryById('search_form');
                expect(form.queryById('search_terms').getValue()).toEqual('');
            });

        });

        describe('managing SearchAdvancedTextfield subview events', function () {

            var field = null; // set up in each test, but we want to be sure and destroy it, even if the test fails
            var originalErrorHandler = null;
            var errorRaised = false;

            beforeEach(function()   {
                 originalErrorHandler = Ext.Error.handle;
                Ext.Error.handle = function()   {
                    errorRaised = true;
                    return true;
                };
            });

            afterEach(function () {
                if (field) {
                    field.destroy();
                    field = null;
                }
                if(originalErrorHandler)    {
                    Ext.Error.handle = originalErrorHandler;
                    originalErrorHandler = null;
                }
                errorRaised = false;
            });

            it('getBooleanValue returns expected string for booleanType "all"', function () {
                field = Ext.create('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
                    configs: { join: '', booleanType: 'all' },
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
                });

                field.setValue('some   text');

                var expected = 'some AND text',
                    result = field.getBooleanValue();

                expect(result).toEqual(expected);
            });

            it('getBooleanValue returns expected string for booleanType "exact"', function () {
                field = Ext.create('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
                    configs: { join: '', booleanType: 'exact' },
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
                });

                field.setValue('some   text');

                var expected = '"some   text"',
                    result = field.getBooleanValue();

                expect(result).toEqual(expected);
            });

            it('getBooleanValue returns expected string for booleanType "any"', function () {
                field = Ext.create('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
                    configs: { join: '', booleanType: 'any' },
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
                });

                field.setValue('some   text');

                var expected = 'some OR text',
                    result = field.getBooleanValue();

                expect(result).toEqual(expected);
            });

            it('getBooleanValue returns expected string for booleanType "none"', function () {
                field = Ext.create('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
                    configs: { join: '', booleanType: 'none' },
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
                });

                field.setValue('some   text');

                var expected = 'some NOT text',
                    result = field.getBooleanValue();

                expect(result).toEqual(expected);
            });

            it('getBooleanValue returns original string and raises an error on unexpected booleanType', function () {
                field = Ext.create('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
                    configs: { join: '', booleanType: 'unexpected' },
                    renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
                });

                field.setValue('some   text');

                var expected = 'some   text',
                    result = field.getBooleanValue();

                expect(result).toEqual(expected);
                expect(errorRaised).toBeTruthy();
            });
        });

        describe('searchCallback', function () {
            var origErrorHandler,
                errorRaised = false,
                fixtures;

            beforeEach(function () {
                spyOn(controller, 'showResultsPage');

                fixtures = Ext.clone(ThetusTestHelpers.Fixtures.SearchResults);

                origErrorHandler = Ext.Error.handle;

                Ext.Error.handle = function () {
                    errorRaised = true;

                    return true;
                };

                var readMethod = 'GET',
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(dalStore.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, dalFixtures.allDals);

                dalStore.getProxy().addSessionId = false; // so our URL is clean
                dalStore.load();

                server.respond({
                    errorOnInvalidRequest: true
                });
            });

            afterEach(function () {
                fixtures = {};

                Ext.Error.handle = origErrorHandler;

                origErrorHandler = null;
                errorRaised = false;

                if (server) {
                    server.restore();
                    server = null;
                }
                dalStore = null;
                dalFixtures = null;
            });

            it('should raise an error if success is false', function () {

                server = new ThetusTestHelpers.FakeServer(sinon);

                // Even though the request will happen later (at some point when the component is instantiated), we set the
                // server to respond now so that it's ready for that future call
                server.respond({
                    errorOnInvalidRequest: true
                });

                component.down('#searchdals').store = dalStore;
                component.down('#searchdals').createDalPanels();

                component.down('#resultsdals').store = dalStore;
                component.down('#resultsdals').createDalPanels();

                controller.searchCallback(fixtures.searchResults, {}, false, {}, {}, 'mockDAL');

                expect(errorRaised).toBeTruthy();
            });
        });

        describe('managing Toolbar subview events', function () {

            describe('onBodyToolbarClick', function () {
                it('should set currentPanel to "results" when "Results" is clicked', function () {
                    var resbutton = component.queryById('resultsbutton');

                    component.queryById('searchbody').currentPanel = 'searchoptions';

                    spyOn(controller, 'onBodyToolbarClick');

                    resbutton.fireEvent('click', resbutton);

                    expect(component.queryById('searchbody').currentPanel).not.toBe('searchoptions');
                });

                it('should set currentPanel to "searchoptions" when "Search Options" is clicked', function () {
                    var optsbutton = component.queryById('optionsbutton');

                    component.queryById('searchbody').currentPanel = 'results';

                    spyOn(controller, 'onBodyToolbarClick');

                    optsbutton.fireEvent('click', optsbutton);

                    expect(component.queryById('searchbody').currentPanel).not.toBe('results');
                });
            });
        });
    });

    describe('Models', function () {
        var fixtures;
        beforeEach(function () {
            fixtures = Ext.clone(ThetusTestHelpers.Fixtures.SearchResults);
        });

        afterEach(function () {
            fixtures = {};
        });

        describe('constructor', function () {
            it('should be able to create a model with canonical data', function () {
                var result = Ext.create('Savanna.search.model.SearchResult', fixtures.searchResults);

                expect(result instanceof Savanna.search.model.SearchResult).toBeTruthy();
            });
        });
    });

    describe('SearchResults Store', function () {

        describe('retrieving results data', function () {

            afterEach(function () {
                if (server) {
                    server.restore();
                    server = null;
                }
            });


            it('should get same number of records as in our fixture', function () {

                var resultsFixture = Ext.clone(ThetusTestHelpers.Fixtures.SearchResults),
                    readMethod = 'POST',
                    resultsStore = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.SearchResults'),
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(resultsStore.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, resultsFixture.searchResults.results);

                resultsStore.load();

                server.respond({
                    errorOnInvalidRequest: true
                });

                expect(resultsStore.getCount()).toBe(resultsFixture.searchResults.results.length);
            });
        });
    });
});