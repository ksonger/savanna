/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, it: false, expect: false,
          Savanna: false
*/
Ext.require('Savanna.Config');

describe('Savanna.Config', function() {

    describe('buildSavnnaUrl', function() {

        beforeEach(function() {
            Savanna.Config.savannaUrlRoot = 'TEST_ROOT/';
            Savanna.Config.TEST_KEY = 'TEST_URL';
        });

        it('should use the configured "savannaUrlRoot" and a key to build the URL', function() {
            expect(Savanna.Config.buildSavannaUrl('TEST_KEY')).toBe('TEST_ROOT/TEST_URL');
        });

        it('should not add the savannaUrlRoot if we have a .json path', function() {
            Savanna.Config.TEST_KEY = 'TEST_URL.json';

            expect(Savanna.Config.buildSavannaUrl('TEST_KEY')).toBe(Savanna.Config.TEST_KEY);
        });

        describe('error handling', function() {
            var origErrorHandler = function() {},
                handledError = false;

            beforeEach(function() {
                origErrorHandler = Ext.Error.handle;

                Ext.Error.handle = function() {
                    handledError = true;
                    return true; // stop propagation
                };
            });

            afterEach(function() {
                Ext.Error.handle = origErrorHandler;
                origErrorHandler = function() {};
                handledError = false;
            });

            it('should raise an error if we give it a key it does not understand', function() {
                Savanna.Config.buildSavannaUrl('NONEXISTENT_KEY');

                expect(handledError).toBeTruthy();
            });
        });
    });
});