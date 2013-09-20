/* global Ext: false */
Ext.define('Savanna.crumbnet.view.part.PaletteMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.crumbnet_part_palette-menu',

    mixins: {
        storeable: 'Savanna.mixin.Storeable'
    },

    requires: [
        'Ext.layout.container.Accordion',
        'Savanna.crumbnet.view.part.PaletteGroup'
    ],

    store: 'Savanna.crumbnet.store.Templates',

    layout: {
        type: 'accordion',
        titleCollapse: false,
        animate: true,
        activeOnTop: false
    },

    panelClass: 'Savanna.crumbnet.view.part.PaletteGroup',

    items: [],

    initComponent: function() {
        this.mixins.storeable.initStore.call(this);

        this.callParent(arguments);
    },

    onStoreLoad: function() {
        this.removeAll();

        if (this.store.getCount() === 0) {
            // TODO: should this be an error?
            this.add(Ext.create(this.panelClass, {
                model: Ext.create('Savanna.crumbnet.model.TemplateGroup', { title: 'NO PALETTE', templates: [] })
            }));
        }
        else {
            this.store.each(function(model) {
                this.add(Ext.create(this.panelClass, { model: model }));
            }, this);
        }
    }
});