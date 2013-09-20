/**
 * Created with IntelliJ IDEA.
 * User: thille
 * Date: 7/25/13
 * Time: 5:17 PM
 * To change this template use File | Settings | File Templates.
 */
/* global Ext: false */
Ext.define('Savanna.crumbnet.model.Template', {
    extend: 'Ext.data.Model',

    belongsTo: 'Savanna.search.model.TemplateGroup',

    idProperty: 'category',

    fields: ['category', 'label']
});