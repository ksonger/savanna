/**
 * Created with IntelliJ IDEA.
 * User: bcannon
 * Date: 9/5/13
 * Time: 8:15 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.space.model.Space', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'displayLabel', type: 'string'},
        {name: 'description', type: 'string'}
    ]
});
