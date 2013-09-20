/* global
        Ext: false,
        jasmine: false, describe: false, beforeEach: false, afterEach: false, it: false, expect: false, sinon: false, waitsFor: false, runs: false, spyOn: false,
        Savanna: false, ThetusTestHelpers: false */
Ext.require('Savanna.Config');
Ext.require('Savanna.controller.Main');
Ext.require('Savanna.view.Login');
Ext.require('Savanna.view.PrintModal');

describe('Savanna Main', function() {
    var TEST_SESSION_ID = 'TEST_SESSION_ID',
        controller = null;

    beforeEach(function() {
        // NOTE: you need to set up the controller even before view tests, otherwise the view will not be able to be instantiated
        controller = new Savanna.controller.Main();

        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        if (controller) {
            Ext.destroy(controller);
            controller = null;
        }

        // Make sure Savanna is not keeping our session ID between tests...
        delete Savanna.jsessionid;

        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('Controller', function() {
        var server = null;

        beforeEach(function() {
            server = new ThetusTestHelpers.FakeServer(sinon);
        });

        afterEach(function() {
            if (server) {
                server.restore();
                server = null;
            }
        });

        it('should have a controller of the correct type instantiated', function() {
            expect(controller).not.toBeNull();

            expect(controller instanceof Savanna.controller.Main).toBeTruthy();
        });

        describe('Login', function() {

            describe('listens to Login view for events', function() {
                var view,
                    mockApplication;

                beforeEach(function() {
                    var mock = jasmine.createSpyObj('mainViewport', ['add', 'remove']);

                    view = Ext.create('Savanna.view.Login');
                    view.clearListeners();

                    mockApplication = {
                        viewport: {
                            queryById: function() {
                                return mock;
                            }
                        }
                    };
                });

                afterEach(function() {
                    if (view) {
                        view.destroy();
                        view = null;
                    }

                    mockApplication = null;
                });

                it('should listen for "render" event on login view', function() {
                    expect(view.hasListener('render')).toBeFalsy();
                    controller.init(mockApplication);
                    expect(view.hasListener('render')).toBeTruthy();
                });

                // NOTE: 9/18/2013 - turned this off as it is causing an issue with a later test (yes, I know that's weird, right?)
                xit('should process message from login iframe', function() {
                    spyOn(controller, 'swapLogin');

                    runs(function() {
                        controller.init(mockApplication);

                        view.fireEvent('render');
                    });

                    runs(function() {
                        window.postMessage(TEST_SESSION_ID, '*');
                    });

                    waitsFor(function() {
                        return controller.swapLogin.wasCalled;
                    }, 'swapLogin to be called', 300);

                    runs(function() {
                        expect(controller.swapLogin).toHaveBeenCalled();
                    });
                });

                it('should raise an Ext.Error if we do not have an app defined', function() {
                    var errorRaised = false;

                    Ext.Error.handle = function() {
                        errorRaised = true;
                        return true;
                    };

                    controller.app = null; // make sure we do not have an app....

                    controller.swapLogin('IRRELEVANT_SESSION_ID');

                    expect(errorRaised).toBeTruthy();
                });

                it('should attempt to swap viewport views if we can find our main viewport', function() {
                    var mock = mockApplication.viewport.queryById();
                    spyOn(Ext, 'create').andReturn('WOULD BE A VIEW'); // just have it return a string since we aren't doing anything with it

                    controller.init(mockApplication);
                    controller.swapLogin('IRRELEVANT_SESSION_ID');

                    expect(mock.remove).toHaveBeenCalledWith('login');
                    expect(mock.add).toHaveBeenCalledWith('WOULD BE A VIEW');
                });
            });
        });

        describe('PrintModal', function() {
            var modal = null;

            beforeEach(function() {
                modal = Ext.create('Savanna.view.PrintModal', { renderTo: 'test-html' });
                modal.show();
            });

            afterEach(function() {
                if (modal) {
                    modal.close();
                    modal.destroy();
                    modal = null;
                }
            });

            describe('"print" button handler', function() {
                it('should call "handlePrint" when the print button is clicked', function() {
                    window.print = window.print || function() {};

                    spyOn(window, 'print');

                    controller.printContent();

                    expect(window.print).toHaveBeenCalled();
                });
            });

            describe('"cancel" button handler', function() {
                it('should close the modal window when called', function() {
                    var button = modal.down('button[type="cancel"]');

                    expect(button).not.toBeNull();

                    spyOn(modal, 'close');

                    controller.closePrintModal(button);

                    expect(modal.close).toHaveBeenCalled();
                });
            });
        });
    });
});