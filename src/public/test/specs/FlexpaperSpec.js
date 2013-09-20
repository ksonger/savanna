/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, it: false, expect: false, spyOn: false,
          Savanna: false, ThetusTestHelpers: false
 */
Ext.require('Savanna.flexpaper.view.FlexpaperComponent');
Ext.require('Savanna.flexpaper.view.FlexpaperBody');
Ext.require('Savanna.flexpaper.view.FlexpaperToolbar');
Ext.require('Savanna.flexpaper.view.FlexpaperEntityWindow');

describe('Flexpaper Component', function () {
    var fixtures, fp, fpc;

    beforeEach(function () {
        ThetusTestHelpers.ExtHelpers.createTestDom();

        fp = Ext.create('Ext.panel.Panel', {
            title: 'unit test',
            closable: true,
            layout: 'border',
            renderTo: ThetusTestHelpers.ExtHelpers.TEST_HTML_DOM_ID
        });

        fpc = Ext.create('Savanna.flexpaper.view.FlexpaperComponent', {
            itemId: 'flexcomponent',
            asset: 'http://localhost/flexpaper/pdf/Paper.pdf'
        });

        spyOn(fpc.ctrl, 'loadPaper');

        fp.add(fpc);
    });

    afterEach(function () {
		if (fp) {
            fp.destroy();
        }

		fp = null;
		fpc = null;
        fixtures = null;

        ThetusTestHelpers.ExtHelpers.cleanTestDom();
    });


    describe('View', function () {

        it('should render the flexpaper instance', function()    {
            expect(fpc instanceof Savanna.flexpaper.view.FlexpaperComponent).toBeTruthy();
        });
    });

    describe('Stores', function () {

    });

    describe('Models', function () {

    });

    describe('Controller', function () {
        it('should call the loadPaper method', function()  {
            expect(fpc.ctrl.loadPaper).toHaveBeenCalled();
        });
    });
});
