/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/16/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.model.dalSource.CustomSearchDescription', {

    extend: 'Ext.data.Model',

    // NOTE: if you have a relationship, you need to be sure to require that model...
    requires: [
        'Savanna.search.model.dalSource.CustomSearchGroup'
    ],

    fields: [

    ],

    // NOTE: the model class must be fully qualififed in your relationship definition
    hasMany: [
        { model: 'Savanna.search.model.dalSource.CustomSearchGroup', name: 'customSearchGroups' }
    ]
});