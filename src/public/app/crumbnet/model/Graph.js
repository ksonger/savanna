Ext.define('Savanna.crumbnet.model.Graph', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' },
        'nodeDataArray',
        'linkDataArray'
    ]
})