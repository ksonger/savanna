/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 9/11/13
 * Time: 2:00 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsDatefield', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.search_resultsDals_resultsdatefield',

    maxValue: new Date(),
    minValue: new Date('1/1/1971'),
    editable:false,
    format: 'd M Y',

    initComponent: function () {
        this.on('change', this.onDateChange);
        this.callParent(arguments);
    },

    onDateChange:function(picker){
        picker.up('search_resultsDals_resultsfacet').doCustomDateSearch();
    }
});
