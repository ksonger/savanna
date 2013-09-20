Ext.define('Savanna.search.model.DalSource', {
    extend: 'Ext.data.Model',

    // NOTE: if you have a relationship, you need to be sure to require that model...
    requires: [
        'Savanna.search.model.dalSource.CustomSearchDescription'
    ],

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayName', type: 'string' },
        { name: 'textDescription', type: 'string' },

        // This is data that is not needed for search display, but IS needed for results display...
        { name: 'facetDescriptions' },

        // These are fields that currently are not used
        { name: 'timeoutMillis', type: 'int' },
        { name: 'inputTypes' },
        { name: 'outputTypes' },
        { name: 'facetFilterCriteria', type: 'array'},
        { name: 'dateTimeRanges', type: 'array'}
    ],

    // NOTE: the model class must be fully qualififed in your relationship definition

    /*
     hasOne will only work if it includes the undocumented configs
     'getterName', 'setterName' and 'instanceName'.  See the thread here:

     http://www.sencha.com/forum/showthread.php?180111-4.1-B2-HasOne-constructor-does-not-work/page2
     */
    associations: [
        {
            type: 'hasOne',
            name: 'customsearchdescription',
            model: 'Savanna.search.model.dalSource.CustomSearchDescription',
            associationKey: 'customSearchDescription',
            instanceName: 'searchDescription',
            getterName: 'getCustomSearchDescription',
            setterName: 'setCustomSearchDescription'
        }
    ]
});