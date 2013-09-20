/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/18/13
 * Time: 4:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBar.SearchAdvancedTextfield', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchadvanced_textfield',
    width: 355,
    fieldLabel: 'All of these words:',
    name: 'all_words',
    enableKeyEvents: true,
    itemId: 'all_words',
    labelWidth: 125,
    tabIndex: 1,

    getBooleanValue: function () {
        /*
        Breaks removed - returns make the breaks always unreachable.
         */
        var str = this.getValue();
        str.trim();
        switch(this.configs.booleanType)    {
            case 'all':
                return str.replace(/\s+/g, ' AND ');
            case 'exact':
                return '"' + str + '"';
            case 'any':
                return str.replace(/\s+/g, ' OR ');
            case 'none':
                return str.replace(/\s+/g, ' NOT ');
            default:
                Ext.Error.raise({
                    msg: 'Unexpected booleanType.'
                });
                return str;
        }
    }
});