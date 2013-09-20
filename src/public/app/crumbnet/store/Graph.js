/* global Ext: false, Savanna: false */
Ext.define('Savanna.crumbnet.store.Graph', {
    extend: 'Ext.data.Store',

    storeId: 'graphStore',

    model: 'Savanna.crumbnet.model.Graph',

    autoLoad: true,

    constructor: function() {
        this.buildData();

        this.callParent(arguments);
    },

    buildData: function() {
        this.data = [
            {
                id: 'GRAPH_ONE',
                linkDataArray: [],
                nodeDataArray: []
            }
        ];

        var categories = [{type: 'Concept', color: '#00FFFF'},
            {type: 'Question', color: '#00FFFF'},
            {type: 'Problem', color: '#00FFFF'},
            {type: 'Fact', color: '#00FFFF'},
            {type: 'Hypothesis', color: '#00FFFF'},
            {type: 'Conclusion', color: '#00FFFF'},
            {type: 'Assumption', color: '#FFFF00'}];
        var TOT_NODE_COUNT = 50; // NOTE: change this to 1000 and performance will degrade...
        var generatedLink = {};
        var relationshipTypes = Ext.clone(Savanna.crumbnet.utils.ViewTemplates.linkRelationshipTypes);

        relationshipTypes.push('');

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        for (var i = 0; i < TOT_NODE_COUNT; ++i) {
            var cat = categories[i % categories.length];

            this.data[0].nodeDataArray.push({ key: i, title: cat.type, type: cat.type, category: 'standard',
                percent: Math.random() * 100, color: cat.color, description: 'Description' });

            var to = randomInt(0, TOT_NODE_COUNT-1);
            var from = randomInt(0, TOT_NODE_COUNT-1);
            var key = from + '-' + to;

            var linkInt = randomInt(1, 3);
            var type = linkInt === 1 ? 'Orthogonal' : linkInt === 2 ? 'Tapered' : 'Straight';

            if (to !== from && !generatedLink[key]) {
                this.data[0].linkDataArray.push({ from: from > to ? to : from, to: to > from ? to : from, text: relationshipTypes[randomInt(0, relationshipTypes.length-1)], category: type});
                generatedLink[key] = true;
            }
        }
    }
});