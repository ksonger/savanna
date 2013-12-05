/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 11/18/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.controller.resultsComponent.ResultsPanelGridController', {
    extend: 'Deft.mvc.ViewController',
    control: {
        view: {
            itemdblclick: 'onItemDoubleClick',
            itemclick: 'onItemClick'
        }
    },
    onItemDoubleClick: function (view, rec) {
        this.fireOpen(rec.data.uri, rec.data.contentType, rec.data.title);
    },
    onItemClick: function (view, rec, node, index, e) {  //other parameter options
        //TODO - the way of getting this button is wrong, refactor
        if (e && e.target && e.target.className.indexOf('openClass') != -1) {
            this.fireOpen(rec.data.uri, rec.data.contentType, rec.data.title);
        }
    },
    fireOpen: function(uri, type, label){
        EventHub.fireEvent('open', {uri: uri, type: type, label: label});
    }

});