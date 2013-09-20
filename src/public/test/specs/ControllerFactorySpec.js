/* global Ext: false, Savanna: false,
         describe: false, it: false, expect: false */
Ext.require('Savanna.controller.Factory');
Ext.require('Savanna.controller.Main');

describe('Savanna.controller.Factory', function() {

    it('should be a globally available singleton', function() {
        expect(Savanna.controller.Factory).not.toBeNull();
    });

    describe('getController', function() {

        var controllerClass = 'Savanna.controller.Main';

        it('should be able to retrieve an defined controller', function() {
            var controller = Savanna.controller.Factory.getController(controllerClass);

            expect(controller).not.toBeNull();
            expect(controller instanceof Savanna.controller.Main).toBeTruthy();
        });

        it('should return the same instance regardless of whether called with a full package path or partial', function() {
            var fullPathController = Savanna.controller.Factory.getController(controllerClass);
            var partialPathController = Savanna.controller.Factory.getController(controllerClass);

            expect(fullPathController).toBe(partialPathController);
        });
    });
});