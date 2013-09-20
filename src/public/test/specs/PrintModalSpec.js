/* global
    Ext: false,
    describe: false, beforeEach: false, afterEach: false, it: false, expect: false,
    ThetusTestHelpers, Savanna: false */
Ext.require('Savanna.view.PrintModal');

describe('Savanna.view.PrintModal', function() {
    var modal = null;

    beforeEach(function() {
        ThetusTestHelpers.ExtHelpers.createTestDom();
    });

    afterEach(function() {
        if (modal) {
            modal.destroy();
            modal = null;
        }

        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });

    describe('default initialization', function() {

        beforeEach(function() {
            modal = Ext.create('Savanna.view.PrintModal', { renderTo: 'test-html' });
            modal.show();
        });

        it('should instantiate a simple modal for us', function() {
            expect(modal).not.toBeNull();
            expect(modal instanceof Savanna.view.PrintModal).toBeTruthy();
        });

        it('should be modal', function() {
            expect(modal.modal).toBeTruthy();
        });

        it('should have a "cancel" button', function() {
            var cancelButton = modal.down('button[type="cancel"]');

            expect(cancelButton).not.toBeNull();
        });

        it('should have a "print" button', function() {
            var printButton = modal.down('button[type="print"]');

            expect(printButton).not.toBeNull();
        });
    });

    describe('setting content', function() {

        describe('setting via configuration', function() {

            beforeEach(function() {
                modal = Ext.create('Savanna.view.PrintModal', {
                    renderTo: 'test-html',
                    html: 'TEST CONTENT'
                });
            });

            it('should get the content we configured', function() {
                expect(modal.getPrintContent()).toBe('TEST CONTENT');
            });
        });

        describe('setting via setPrintContent', function() {

            beforeEach(function() {
                modal = Ext.create('Savanna.view.PrintModal', { renderTo: 'test-html' });
            });

            it('should allow us to set the content via the method with a string', function() {
                expect(modal.getPrintContent()).toBe('');

                modal.setPrintContent('SOME CONTENT');

                expect(modal.getPrintContent()).toBe('SOME CONTENT');
            });

            it('should allow us to set the content via the method with a HTMLElement', function() {
                expect(modal.getPrintContent()).toBe('');

                var domElem = document.createElement('div');
                domElem.appendChild(document.createTextNode('outerHTML CONTENT'));

                modal.setPrintContent(domElem);

                expect(modal.getPrintContent()).toBe('<div>outerHTML CONTENT</div>');
            });

            it('should allow us to set the content via the method with an Ext.Element', function() {
                expect(modal.getPrintContent()).toBe('');

                var domElem = document.createElement('div');
                domElem.appendChild(document.createTextNode('getHTML CONTENT'));

                var extElem = new Ext.dom.Element(domElem);

                modal.setPrintContent(extElem);

                expect(modal.getPrintContent()).toBe('getHTML CONTENT');
            });
        });
    });
});