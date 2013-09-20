/**
 * Factory to instantiate controllers as needed
 *
 * This was created to get around the fact that ExtJS apparently requires you to declare all of your controllers in the
 * app.js file and that seems a bit odd...
 *
 * Usage:
 *
 * Ext.require('Savanna.controller.Factory'); // it's a singleton, so this should instantiate it
 *
 * Savanna.controller.Factory.getController('Savanna.controller.Foo');
 *
 * // now the controller should be available for use
 *
 * Savanna.controller.Foo.doSomething();
 */
Ext.define('Savanna.controller.Factory', {
    singleton: true,

    // CUSTOM METHODS

    /**
     * Retrieves the given controller (via Ext.app.Application.getController) based upon given controller name
     *
     * @param {String} controllerName fully-qualified
     * @return {Ext.app.Application}
     */
    getController: function(controllerName) {
        return Savanna.getApplication().getController(controllerName);
    }
});