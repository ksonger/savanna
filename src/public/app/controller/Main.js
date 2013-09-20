/* global Ext: false, Savanna: false */
/**
 * Central controller for the Savanna client application
 */
Ext.define('Savanna.controller.Main', {
    extend: 'Ext.app.Controller',

    views: [
        'Savanna.view.Login',
        'Savanna.desktop.view.SavannaDesktop',
        'Savanna.view.PrintModal'
    ],

    controllers: [],

    init: function(app) {
        var me = this;

        this.app = app;

            this.control({
            login: {
                render: function() {
                    Ext.EventManager.on(window, 'message', function(e) {
                        //TODO - This needs to either remove after the first time or case based on the message that is sent
                        me.swapLogin(e.browserEvent.data);
                    });
                }
            },
            'print-modal button[type="print"]': {
                click: this.printContent
            },
            'print-modal button[type="cancel"]': {
                click: this.closePrintModal
            }
        });
    },

    swapLogin: function(sessionId) {
        Savanna.jsessionid = sessionId;

        if (this.app && this.app.viewport && this.app.viewport.queryById) {
            var mainViewport = this.app.viewport.queryById('viewport_main');
            var login = this.app.viewport.queryById('login');
            if (mainViewport && login) {
                mainViewport.remove('login');

                var main = Ext.create('Savanna.desktop.view.SavannaDesktop', { itemId: 'main' });

                mainViewport.add(main);
            }
        }
        else {
            Ext.Error.raise('no viewport defined');
        }
    },

    printContent: function() {
        window.print();
    },

    closePrintModal: function(button) {
        var modal = button.findParentByType('print-modal');

        // NOTE: we assume we will always get the modal window, since the button is it's child
        modal.close();
    }
});