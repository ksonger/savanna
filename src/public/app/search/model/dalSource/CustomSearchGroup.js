Ext.define('Savanna.search.model.dalSource.CustomSearchGroup', {
    extend: 'Ext.data.Model',

    alternateClassName: 'DalCustomSearchGroup',

    requires: [
        'Savanna.search.model.dalSource.CustomSearchParameter'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayLabel', type: 'string' }
    ],

    belongsTo: 'Savanna.search.model.DalSource',

    hasMany: [
        { model: 'Savanna.search.model.dalSource.CustomSearchParameter', name: 'customSearchParameters' }
    ]
});