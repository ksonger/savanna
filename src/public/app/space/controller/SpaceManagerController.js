/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/5/13
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.space.controller.SpaceManagerController', {
    extend: 'Ext.app.Controller',
    views: [
        'Savanna.space.view.SpaceManagerComponent',
        'Savanna.space.view.SpaceListPanel'
    ],
    stores: [
        'Savanna.space.store.Spaces'
    ],
    currentSpace: null,

    init: function() {

        //todo: create a new empty space and put it in edit mode
        //todo: the empty space is not added to the store until the user saves it
        //todo: anytime the "create space" button is pressed we go into this state again

        //todo: hook up store when ready
//        var spaceStore = this.getStore('Savanna.space.store.Spaces');

        this.control({
            'space_spacemanagercomponent #openspacebutton': {
                click: this.onOpenSpace
            }
        });
    },

    onOpenSpace: function(button) {
        this.application.fireEvent('openspace'); //todo: pass currentSpace
    }
});
