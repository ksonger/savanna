/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/12/13
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define("Savanna.flexpaper.view.FlexpaperEntityWindow", {
    extend: "Ext.window.Window",
    autoShow: true,
    align: "stretchmax",
    title: 'Entity Types',
    minWidth: 120,
    initComponent:function()    {
        this.callParent();
    },
    items: [
        {
            xtype: "form",
            itemID: "entity_form",
            minWidth: 120,
            items: [
                {
                    xtype: 'radiogroup',
                    fieldLabel: "",
                    layout: "vbox",
                    width: '100%',
                    padding: '10 10 10 10',
                    items: [
                        { boxLabel: 'Person', name: 'ent', inputValue: 'person' },
                        { boxLabel: 'Place', name: 'ent', inputValue: 'place' },
                        { boxLabel: 'Thing', name: 'ent', inputValue: 'thing' }
                    ]
                }
            ]
        }
    ]
});