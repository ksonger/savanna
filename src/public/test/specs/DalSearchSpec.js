/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, expect: false, it: false,
          sinon: false, spyOn: false,
          ThetusTestHelpers: false,
          Savanna: false
 */
Ext.require('Savanna.Config');
Ext.require('Savanna.search.model.DalSource');
Ext.require('Savanna.search.model.dalSource.CustomSearchDescription');
Ext.require('Savanna.search.store.DalSources');
Ext.require('Savanna.search.view.SearchComponent');
Ext.require('Savanna.search.view.searchComponent.SearchBody');
Ext.require('Savanna.search.view.searchComponent.searchBody.searchDals.CustomGroup');
Ext.require('Savanna.search.view.searchComponent.searchBody.searchDals.CustomSearchGroupForm');
Ext.require('Savanna.search.view.searchComponent.searchBody.searchDals.SearchOptions');


describe('Dal Search', function() {
    var fixtures = {};

    beforeEach(function() {
        fixtures = Ext.clone(ThetusTestHelpers.Fixtures.DalSources);

        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        fixtures = null;
        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('Savanna.search.model.DalSource', function() {
        var store = null;

        beforeEach(function() {
            // NOTE: this has to happen BEFORE your create a FakeServer,
            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources');
            store.add(Ext.create('Savanna.search.model.DalSource', fixtures.groupedDal));
        });

        afterEach(function() {
            store = null;
        });

        describe('constructor', function() {

            it('should be able to create a model with canonical data', function() {
                var dal = Ext.create('Savanna.search.model.DalSource', fixtures.groupedDal);

                expect(dal instanceof Savanna.search.model.DalSource).toBeTruthy();

                expect(dal.get('inputTypes').length).toBeGreaterThan(0);
            });
        });
    });

    describe('Savanna.search.store.DalSources', function() {
        var server = null,
            store = null;

        beforeEach(function() {
            // NOTE: this has to happen BEFORE your create a FakeServer,
            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources');

            server = new ThetusTestHelpers.FakeServer(sinon);
        });

        afterEach(function() {
            server.restore();

            server = null;
            store = null;
        });

        describe('default data loading', function() {
            /*
             This test broke above due to the data restructure and use of 'hasOne'.  Creating a store and adding allDals - which
             includes the legacyDal model - fixes the test since the associations stuff executes and creates the customSearchDescription
             */
            it('should correctly create an empty store for "CustomSearchGroup" when null passed for that value', function() {
                var readMethod = 'GET';

                var testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.allDals);

                store.load();
                server.respond({
                    errorOnInvalidRequest: true
                });
                expect(store.getAt(0).getCustomSearchDescription().customSearchGroups().count()).toBe(0);
            });

            it('should load data', function() {
                var readMethod = 'GET';

                expect(store.getTotalCount()).toBe(0);

                var testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.allDals);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });

                expect(store.getTotalCount()).toBe(8);
                expect(store.defaultId).toBe('mockDAL');
            });
        });
    });

    describe('Savanna.search.view.searchComponent.SearchBody', function() {
        var view = null;

        beforeEach(function() {
            //noinspection JSValidateTypes
            spyOn(Savanna.controller.Factory, 'getController');
            view = Ext.create('Savanna.search.view.searchComponent.SearchBody', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
        });

        afterEach(function() {
            if (view && view.destroy) {
                view.destroy();
            }

            view = null;
        });
    });

    describe('Savanna.search.view.searchComponent.searchBody.SearchDals', function() {
        var view = null,
            store = null,
            server = null;

        beforeEach(function() {
            //noinspection JSValidateTypes

            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources');

            server = new ThetusTestHelpers.FakeServer(sinon);

            //noinspection JSValidateTypes
            spyOn(Savanna.controller.Factory, 'getController');
            view = Ext.create('Savanna.search.view.searchComponent.searchBody.SearchDals', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
        });

        afterEach(function() {
            if (view && view.destroy) {
                view.destroy();
            }

            view = null;
            server.restore();

            server = null;
            store = null;
        });

        it('initComponent should ask for a controller', function() {
            expect(Savanna.controller.Factory.getController).toHaveBeenCalledWith('Savanna.search.controller.SearchDals');
        });

        describe('createPanel', function() {
            it('should create an instance of the SearchOptions panel', function() {
                /*
                 This test broke due to the data restructure and use of 'hasOne'.  Creating a store and adding allDals - which
                 includes the legacyDal model - fixes the test since the associations stuff executes and creates the customSearchDescription
                 */

                var readMethod = 'GET';

                var testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.allDals);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });

                var panelView = view.createPanel(store.getAt(0));

                expect(panelView instanceof Savanna.search.view.searchComponent.searchBody.searchDals.SearchOptions).toBeTruthy();
            });
        });

        describe('createDalPanels', function() {
            var server = null,
                store = null;

            beforeEach(function() {
                view = Ext.create('Savanna.search.view.searchComponent.searchBody.SearchDals', { renderTo: 'test-html' });

                // NOTE: this has to happen BEFORE your create a FakeServer,
                store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources');

                server = new ThetusTestHelpers.FakeServer(sinon);

                var readMethod = 'GET',
                    testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

                server.respondWith(readMethod, testUrl, fixtures.allDals);

                store.load();

                server.respond({
                    errorOnInvalidRequest: true
                });
            });

            afterEach(function() {


                server = null;
                store = null;

                if (view && view.destroy) {
                    view.destroy();
                }

                view = null;
            });

            it('should create a Panel for every record in the store', function() {
                //noinspection JSValidateTypes
                spyOn(view, 'add');
                view.store = store;
                view.createDalPanels();
                expect(view.add.callCount).toBe(store.count());
            });
        });
    });

    describe('Savanna.search.controller.SearchDals', function() {
        var controller = null,
            server = null,
            store = null,
            topView = null;

        beforeEach(function() {
            // Set up the store first as it is autovivified by our main view
            store = ThetusTestHelpers.ExtHelpers.setupNoCacheNoPagingStore('Savanna.search.store.DalSources', { autoLoad: false });

            // Store it in the store manager so when the view goes to create it, it's already there
            Ext.data.StoreManager.add('Savanna.search.store.DalSources', store);

            // now set up server to get store data
            server = new ThetusTestHelpers.FakeServer(sinon);

            var readMethod = 'GET',
                testUrl = ThetusTestHelpers.ExtHelpers.buildTestProxyUrl(store.getProxy(), 'read', readMethod);

            server.respondWith(readMethod, testUrl, fixtures.allDals);

            // set up the view (it should pull in the store we just created)
            topView = Ext.create('Savanna.search.view.searchComponent.searchBody.SearchDals', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });

            // load the store now (should trigger event to render the view)
            store.load();

            server.respond({
                errorOnInvalidRequest: true
            });

            // finally, set up our controller to test against
            controller = Ext.create('Savanna.search.controller.SearchDals');
        });

        afterEach(function() {
            if (topView && topView.destroy) {
                topView.destroy();
                topView = null;
            }

            if (controller && controller.destroy) {
                controller.destroy();
                controller = null;
            }

            server.restore();

            server = null;
            store = null;
        });

        describe('createCustomSearchGroupPanel', function() {
            it('should create an instance of the Savanna.search.view.searchComponent.searchBody.searchDals.CustomSearchGroupForm', function() {
                var store = Ext.create('Savanna.search.store.DalSources', {
                    autoload: false
                });
                store.loadData(fixtures.allDals);
                var view = controller.createCustomSearchGroupPanel(store);

                expect(view instanceof Savanna.search.view.searchComponent.searchBody.searchDals.CustomSearchGroupForm).toBeTruthy();
            });
        });
        describe('CustomGroup', function() {
            var myStore;
            var myRecord;
            var myView;
            beforeEach(function(){

                myStore = store.getAt(1).getCustomSearchDescription().customSearchGroups();
                myRecord = myStore.getAt(0);
                myView = Ext.create('Savanna.search.view.searchComponent.searchBody.searchDals.CustomGroup', { model: myRecord });
            });
            afterEach(function(){
                myStore = null;
                myRecord = null;
                myView = null;
            });
           it('should create view Group 1 with 4 items', function() {
               expect(myView.title).toBe('Group 1');
               expect(myView.items.length).toBe(5);
           });
           describe('key value input', function() {
               var keyList = [];
               var myConfig = {};
               beforeEach(function() {
                   keyList = ['test1','test2','test3','test4'];
                   myConfig.xtype = 'panel';
                   myConfig.width = 400;
                   myConfig.itemId = 'keyValuePanel';
                   myConfig.layout = 'vbox';
                   myConfig.keyList = keyList;
                   myConfig.items = [];
                   myConfig.bbar = {
                       xtype: 'button',
                       text: 'Add Key Value Pair Option',
                       ui: 'link'
                   };

               });
               afterEach(function() {
                   keyList = [];
                   myConfig = {};
               });
               it('addKeyValueInput should add a key value input, deleteKeyValueInput should delete key value input', function() {
                    myView.add(myConfig);
                    var myButton = myView.down('button');
                    var keyValuePanel = myView.down('#keyValuePanel');
                    expect(keyValuePanel.items.length).toBe(0);
                    myView.addKeyValueInput(myButton);
                    expect(keyValuePanel.items.length).toBe(1);
                    myView.deleteKeyValueInput(keyValuePanel.down('fieldcontainer').down('button'));
                    expect(keyValuePanel.items.length).toBe(0);
               });
           });
        });

        describe('renderCustomOptions', function() {
            var testView = null;
            var button = null;

            beforeEach(function() {
                testView = topView.down('search_searchDals_searchoptions:last');
                button = testView.down('#searchOptionsToggle');

                //noinspection JSValidateTypes
                spyOn(testView, 'add').andCallThrough();

                //noinspection JSValidateTypes
                spyOn(testView, 'doLayout'); // don't necessarily need to redo the layout...

                //noinspection JSValidateTypes
                spyOn(button, 'setText').andCallThrough();
            });

            afterEach(function() {
                testView = null;
                button = null;
            });

            it('should render a group form if it has not been built yet', function() {
                controller.renderCustomOptions(button);

                expect(testView.add).toHaveBeenCalled();
                expect(button.setText).toHaveBeenCalledWith('Hide Search Options');
                expect(testView.doLayout).toHaveBeenCalled();

                // "click" the button again to validate that we change the button text to "show"
                button.setText.reset();
                testView.add.reset();
                testView.doLayout.reset();

                controller.renderCustomOptions(button);

                expect(testView.add).not.toHaveBeenCalled();
                expect(button.setText).toHaveBeenCalledWith('Show Search Options');
                expect(testView.doLayout).toHaveBeenCalled();
            });
        });

        describe('dalCheckBoxClicked', function() {
            var testView = null;
            var checkbox = null;
            var button = null;

            beforeEach(function() {
                testView = topView.down('search_searchDals_searchoptions:last');

                checkbox = testView.queryById('includeDalCheckBox');
                button = topView.queryById('selectAllDals');

                //noinspection JSValidateTypes
                spyOn(testView, 'doLayout'); // don't necessarily need to redo the layout...

                //noinspection JSValidateTypes
                spyOn(checkbox, 'getValue').andCallThrough();

                //noinspection JSValidateTypes
                spyOn(checkbox, 'up').andCallThrough();

                //noinspection JSValidateTypes
                spyOn(button, 'setText').andCallThrough();
            });

            afterEach(function() {
                topView = null;
                testView = null;
                checkbox = null;
                button = null;
            });

            it('checkbox.getValue, checkbox.up and button.setText to be called', function() {
                controller.dalCheckBoxClicked(checkbox);

                expect(checkbox.getValue).toHaveBeenCalled();
                expect(checkbox.up).toHaveBeenCalled();
                expect(button.setText).toHaveBeenCalledWith('Select All');
            });

            it('button.setText should be called with Unselect All if all checkboxes are checked', function() {
                var checkboxes = topView.query('#includeDalCheckBox'),
                    i = 0;

                topView.settingAllDalCheckBoxes = true;

                for (i = 0; i < checkboxes.length; ++i) {
                    checkboxes[i].setValue(true);
                }

                topView.settingAllDalCheckBoxes = false;
                checkbox.setValue(true);
                controller.dalCheckBoxClicked(checkbox);

                expect(button.setText).toHaveBeenCalledWith('Unselect All');
            });

            it('should do nothing if called while we are in the process of setting all the dal checkboxes', function() {
                topView.settingAllDalCheckBoxes = true;

                controller.dalCheckBoxClicked(checkbox);

                expect(checkbox.up).toHaveBeenCalled();
                expect(checkbox.getValue).not.toHaveBeenCalled();
                expect(button.setText).not.toHaveBeenCalled();
            });

            it('should change button text to indicate that clicking it will check all boxes if at least one is checked and one is unchecked', function() {
                // NOTE: we assume all are unchecked, so we only need to set one to checked...
                topView.down('search_searchDals_searchoptions:first').queryById('includeDalCheckBox').setValue(true);

                controller.dalCheckBoxClicked(checkbox);

                expect(checkbox.getValue).toHaveBeenCalled();
                expect(checkbox.up).toHaveBeenCalled();
                expect(button.setText).toHaveBeenCalledWith('Select All');
            });
        });

        describe('setAllDalCheckboxValues', function() {
            var testView = null;
            var button = null;

            beforeEach(function() {
                testView = topView.down('search_searchDals_searchoptions:last');
                button = topView.queryById('selectAllDals');

                //noinspection JSValidateTypes
                spyOn(testView, 'doLayout'); // don't necessarily need to redo the layout...

                //noinspection JSValidateTypes
                spyOn(topView, 'query').andCallThrough();
            });

            afterEach(function() {
                topView = null;
                testView = null;
                button = null;
            });

            it('expect all the dal checkboxes to get checked and unchecked with selectOrUnselectAllButtonClicked', function() {
                controller.selectOrUnselectAllButtonClicked(button);

                var checkboxes = topView.query('#includeDalCheckBox'),
                    i = 0;

                for (i = 0; i < checkboxes.length; ++i) {
                    expect(checkboxes[i].getValue()).toBeTruthy();
                }

                controller.selectOrUnselectAllButtonClicked(button);

                for (i = 0; i < checkboxes.length; ++i) {
                    expect(checkboxes[i].getValue()).toBeFalsy();
                }

                expect(topView.query).toHaveBeenCalled();
            });
        });

        describe('resetAllSearchOptions', function() {
            var testView = null;
            var button = null;

            beforeEach(function() {
                testView = topView.down('search_searchDals_searchoptions:last');
                button = topView.queryById('resetAllSearchOptions');

                //noinspection JSValidateTypes
                spyOn(testView, 'doLayout'); // don't necessarily need to redo the layout...

                //noinspection JSValidateTypes
                spyOn(topView, 'removeAll').andCallThrough();

                //noinspection JSValidateTypes
                spyOn(topView, 'createDalPanels').andCallThrough();
            });

            afterEach(function() {
                topView = null;
                testView = null;
                button = null;
            });

            it('expect resetAllSearchOptions to call removeAll and createDalPanels', function() {
                var checkboxes = topView.query('#includeDalCheckBox'),
                    i = 0;

                topView.settingAllDalCheckBoxes = true;

                for (i = 0; i < checkboxes.length; ++i) {
                    checkboxes[i].setValue(true);
                }

                topView.settingAllDalCheckBoxes = false;

                var allCheckBoxesChecked = true;

                // after resetAllSearchOptions all checkboxes should no longer be checked.
                controller.resetAllSearchOptions(button);

                for (i = 0; i < checkboxes.length; ++i) {
                    if (checkboxes[i].getValue !== true) {
                        allCheckBoxesChecked = false;
                    }
                }

                expect(allCheckBoxesChecked).toBeFalsy();
                expect(topView.removeAll).toHaveBeenCalled();
                expect(topView.createDalPanels).toHaveBeenCalled();
            });
        });

        describe('resetSingleDal', function() {
            var testView = null;
            var button = null;

            beforeEach(function() {
                testView = topView.down('search_searchDals_searchoptions:last');

                button = testView.queryById('resetSingleDal');

                //noinspection JSValidateTypes
                spyOn(testView, 'doLayout'); // don't necessarily need to redo the layout...

                //noinspection JSValidateTypes
                spyOn(topView, 'remove').andCallThrough();
            });

            afterEach(function() {
                testView = null;
                button = null;
            });

            it('expect resetSingleDal to remove CustomSearchGroupForm', function() {
                var store = Ext.create('Savanna.search.store.DalSources', {
                    autoload: false
                });

                store.loadData(fixtures.allDals);

                var childSearchDalsPanel =  Ext.create('Savanna.search.view.searchComponent.searchBody.searchDals.CustomSearchGroupForm', { store: store });

                testView.add(childSearchDalsPanel);

                expect(testView.down('search_searchDals_custom-search-group-form')).toBeTruthy();

                controller.resetSingleDal(button);

                expect(testView.down('search_searchDals_custom-search-group-form')).toBeFalsy();
            });
        });
    });
});