/**
 * Created with IntelliJ IDEA.
 * User: swatson
 * Date: 8/15/13
 * Time: 8:19 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.model.SearchLocation', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'administrativeNames'},
        {name: 'centroid'},
        {name: 'locClass', type: 'string'},
        {name: 'locType', type: 'string'},
        {name: 'viewBox'},
        {name: 'population', type: 'int'},
        {name: 'geometry'}
    ]
});