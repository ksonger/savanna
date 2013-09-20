/* global Ext: false,
 describe: false, beforeEach: false, afterEach: false, it: false, expect: false, spyOn: false,
 Savanna: false, ThetusTestHelpers: false
 */
Ext.require('Savanna.desktop.controller.DesktopController');
Ext.require('Savanna.desktop.view.SavannaDesktop');
Ext.require('Savanna.desktop.view.SavannaWorkspace');
Ext.require('Savanna.desktop.view.SavannaDashboard');
Ext.require('Savanna.desktop.view.SearchWindow');
Ext.require('Savanna.space.controller.SpaceManagerController');
Ext.require('Savanna.space.view.SpaceManagerComponent');
Ext.require('Savanna.space.view.SpaceMetadataTabPanel');
Ext.require('Savanna.crumbnet.controller.CrumbnetController');
Ext.require('Savanna.map.controller.MapController');

describe('Savanna.desktop', function () {

    beforeEach(function() {
        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        ThetusTestHelpers.ExtHelpers.cleanTestDom();

    });

    describe('Desktop View', function() {
        var componentView = null;

        beforeEach(function() {
            componentView = Ext.create('Savanna.desktop.view.SavannaDesktop', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
        });

        afterEach(function() {
            if (componentView) {
                componentView.destroy();
                componentView = null;
            }
        });

        it('desktop view should not be null', function () {
            expect(componentView).not.toBeNull();
        });

        it('should have a toolbar instance', function () {
            expect(componentView.down('desktop_savannatoolbar') instanceof Savanna.desktop.view.SavannaToolbar).toBeTruthy();
        });

        it('should have a space manager', function () {
            expect(componentView.down('space_spacemanagercomponent') instanceof Savanna.space.view.SpaceManagerComponent).toBeTruthy();
        });

        it('should have a dashboard', function () {
            expect(componentView.down('desktop_savannadashboard') instanceof Savanna.desktop.view.SavannaDashboard).toBeTruthy();
        });

        it('should have a workspace view', function () {
            expect(componentView.down('desktop_savannaworkspace') instanceof Savanna.desktop.view.SavannaWorkspace).toBeTruthy();
        });
    });

    describe('Desktop Controller', function() {
        var controller = null,
            componentView = null,
            errorRaised = false,
            origErrorHandleFn = null;

        beforeEach(function() {
            componentView = Ext.create('Savanna.desktop.view.SavannaDesktop', { renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID });
            controller = Savanna.controller.Factory.getController('Savanna.desktop.controller.DesktopController');

            origErrorHandleFn = Ext.Error.handle;

            Ext.Error.handle = function() {
                errorRaised = true;
                return true;
            };
        });

        afterEach(function() {
            if (controller) {
                controller.destroy();
                controller = null;
            }

            if (componentView) {
                componentView.destroy();
                componentView = null;
            }

            errorRaised = false;
            Ext.Error.handle = origErrorHandleFn;
        });

        it('controller should not be null', function() {
            expect(controller).not.toBeNull();
        });
        it('the controller should be of the correct type instantiated', function() {
            expect(controller instanceof Savanna.desktop.controller.DesktopController).toBeTruthy();
        });
        describe('displayAboutDialog()', function() {
            it('about dialog should begin null', function() {
                //access the static var through the class name...don't need an instance
                expect(Savanna.desktop.controller.DesktopController.aboutwindow).toBeNull();
            });
            it('about dialog should be valid after function call', function() {
                controller.displayAboutDialog();
                expect(Savanna.desktop.controller.DesktopController.aboutwindow).not.toBeNull();
            });
        });
        describe('displaySearch()', function() {
            it('search dialog should begin null', function() {
                //access the static var through the class name...don't need an instance
                expect(Savanna.desktop.controller.DesktopController.searchwindow).toBeNull();
            });
            it('search dialog should be valid after function call', function() {
                controller.displaySearch();
                expect(Savanna.desktop.controller.DesktopController.searchwindow).not.toBeNull();
            });
        });
        describe('displayMyStuffWindow()', function() {
            it('mystuff window should begin null', function() {
                //access the static var through the class name...don't need an instance
                expect(Savanna.desktop.controller.DesktopController.mystuffwindow).toBeNull();
            });
            it('mystuff flyout should be valid after function call', function() {
                controller.showMyStuffWindow();
                expect(Savanna.desktop.controller.DesktopController.mystuffwindow).not.toBeNull();
            });
        });
        describe('showDesktopComponent()', function() {
            var toolbarComponent = null,
                dashboard = null;
            beforeEach(function() {
                toolbarComponent = componentView.down('#savannatoolbar');
                dashboard = componentView.down('#savannadashboard');
            });
            afterEach(function() {
                if (toolbarComponent) {
                    toolbarComponent.destroy();
                    toolbarComponent = null;
                }
                if (dashboard) {
                    dashboard.destroy();
                    dashboard = null;
                }
            });

            it('should raise an error with a null argument', function() {
                controller.showDesktopComponent(null);
                expect(errorRaised).toBeTruthy();
            });
            it('should not do anything if the components are the same', function() {
                spyOn(toolbarComponent, 'show');
                controller.showDesktopComponent(toolbarComponent);
                expect(toolbarComponent.show).not.toHaveBeenCalled();
            });
            it('should show the new component', function() {
                spyOn(dashboard, 'show');
                controller.showDesktopComponent(dashboard);
                expect(dashboard.show).toHaveBeenCalled();
            });
        });
        describe ('setWorkspaceViewMode()', function() {
            var workspace = null,
                mainPanel = null;
            beforeEach(function() {
                workspace = componentView.down('#savannaworkspace');
                mainPanel = workspace.down('#maintabpanel');
            });
            afterEach(function() {
                if (workspace) {
                    workspace.destroy();
                    workspace = null;
                }
                if (mainPanel) {
                    mainPanel.destroy();
                    mainPanel = null;
                }
            });
            it('should throw an error on invalid mode', function() {
                controller.setWorkspaceViewMode('dummy');
                expect(errorRaised).toBeTruthy();
            });
            it('workspace current view should update', function() {
                workspace.currentView = 'single';
                controller.setWorkspaceViewMode('split');
                expect(workspace.currentView).toEqual('split');
            });
            it('mainPanel should not be null', function() {
                expect(mainPanel).not.toBeNull();
            });
            it('secondary tab panel should be created on split', function() {
                controller.setWorkspaceViewMode('split');
                var tabPanel = workspace.down('#secondarytabpanel');
                expect(tabPanel).not.toBeNull();
            });
            it('secondary tab panel should be removed on single', function() {
                controller.setWorkspaceViewMode('split');
                controller.setWorkspaceViewMode('single');
                var tabPanel = workspace.down('#secondarytabpanel');
                expect(tabPanel).toBeNull();
            });
        });
    });
});
