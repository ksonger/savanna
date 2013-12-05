Ext.define('Savanna.search.view.searchComponent.searchBody.searchDals.SearchOptions', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_searchDals_searchoptions',

    requires: [
        'Ext.form.field.Checkbox'
    ],

    header: false,

    width: '100%',

    itemId: 'dalSearchOptions',

    cls: 'search-dal',
    items: [],

    initComponent: function() {
        this.items = this.setupItems();
        this.callParent(arguments);

        this.on('beforerender', Ext.bind(function() {
            var config = this.initialConfig || {};
            var checkboxLabel = config.checkboxLabel || '';
            var label = config.label || '';
            var showButton = config.showButton || null;

            this.down('checkbox').boxLabel = checkboxLabel;
            this.down('label').text = label;
            this.down('#resetSingleDal').hide();
            
            if (!showButton) {
                this.down('#searchOptionsToggle').hide();
            }
        }, this));
    },
    setupItems: function() {
        return [
            {
                xtype: 'checkbox',
                itemId: 'includeDalCheckBox',
                boxLabel: '',
                cls: 'dal-checkbox'
            },
            {
                xtype: 'label',
                cls: 'dal-label',
                text: ''
            },
            {
                xtype: 'button',
                itemId: 'searchOptionsToggle',
                cls: 'dal-toggle',
                text: 'Show Search Options'
            },
            {
                xtype: 'button',
                itemId: 'resetSingleDal',
                cls: 'dal-text',
                text: 'Reset',
                tooltip: 'Reset search options'
            }
        ];
    }
});