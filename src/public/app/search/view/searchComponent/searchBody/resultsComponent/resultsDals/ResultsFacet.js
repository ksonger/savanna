/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/22/13
 * Time: 3:14 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsFacet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.search_resultsDals_resultsfacet',

    requires: [
        'Ext.XTemplate',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Savanna.search.view.searchComponent.searchBody.resultsComponent.resultsDals.ResultsDatefield'
    ],

    width: '100%',
    minHeight: 20,
    bodyPadding: 5,
    border: false,
    cls: 'results-facet',
    collapsible: true,
    collapsed: true,
    titleCollapse: true,
    hideCollapseTool: true,
    dateFormat: 'Y-m-d\\TH:i:s.m\\Z',

    initComponent: function () {

        this.title = this.facet.displayValue;
        this.items = this.buildFacetOptions();
        this.callParent(arguments);

        /*

         There are only two types of facets at present, STRING, and DATE.  STRING options are
         defined by the json response for the DalSources store.

         DATE facetDataTypes don't need the following step because they're a static set of 6 options,
         listed out in 'buildFacetOptions' below.  That doesn't seem ideal - the options would be nice
         to get dynamically from the services side as well.

         */
        if (this.facet.facetDataType === 'STRING') {
            this.buildFacetFilterGroup();
        }
    },

    buildFacetOptions: function () {

        var content;

        switch (this.facet.facetDataType) {

            case 'DATE' :
                var facetID = this.facet.facetId;
                content = [
                    {
                        xtype: 'form',
                        itemId: 'facets_' + this.facet.facetId,
                        items: [
                            {
                                xtype: 'radiogroup',
                                itemId: 'dateFacet',
                                // Arrange radio buttons, distributed vertically
                                columns: 1,
                                vertical: true,
                                items: [
                                    { boxLabel: 'Any Time', itemId: 'date_all', name: facetID, inputValue: 'all', checked: true },
                                    { boxLabel: 'Past 24 Hours', itemId: 'date_past_day', name: facetID, inputValue: 'past_day'},
                                    { boxLabel: 'Past Week', itemId: 'date_past_week', name: facetID, inputValue: 'past_week' },
                                    { boxLabel: 'Past Month', itemId: 'date_past_month', name: facetID, inputValue: 'past_month' },
                                    { boxLabel: 'Past Year', itemId: 'date_past_year', name: facetID, inputValue: 'past_year' },
                                    { boxLabel: 'Custom Range', itemId: 'date_custom', name: facetID, inputValue: 'custom' }
                                ],
                                listeners: {
                                    'change': this.onDateRangeChange
                                }
                            },
                            {
                                xtype: 'form',
                                itemId: 'customDatesPanel',
                                collapsible: true,
                                collapsed: true,
                                titleCollapse: true,
                                hideCollapseTool: true,
                                header: false,
                                width: '100%',
                                items: [
                                    {
                                        xtype: 'search_resultsDals_resultsdatefield',
                                        fieldLabel: 'From',
                                        labelWidth: 50,
                                        width: 185,
                                        name: 'from_date',
                                        itemId: 'fromDate',
                                        value: new Date('1/1/1971')
                                    },
                                    {
                                        xtype: 'search_resultsDals_resultsdatefield',
                                        fieldLabel: 'To',
                                        labelWidth: 50,
                                        width: 185,
                                        name: 'to_date',
                                        itemId: 'toDate',
                                        value: new Date()
                                    }
                                ]

                            }
                        ]
                    }
                ];
                break;

            case 'STRING' :

                content = [
                    {
                        xtype: 'form',
                        itemId: 'facets_' + this.facet.facetId,
                        items: [
                            {
                                xtype: 'checkboxgroup',
                                itemId: 'stringFacet',
                                columns: 1,
                                vertical: true,
                                items: []
                            }
                        ]
                    }
                ];
                break;

            default:
                content = [];
                Ext.Error.raise({
                    msg: 'Unknown facet type: ' + this.facet.facetDataType
                });
                break;
        }

        return content;
    },

    buildFacetFilterGroup: function () {

        var searchResults = this.searchResults,
            facet = this.facet.facetId,
            me = this;
        if (searchResults.store.facetValueSummaries) {
            Ext.each(searchResults.store.facetValueSummaries[facet].facetValues, function (facetobj) {

                var checkbox = {
                    boxLabel: facetobj.key + ' (' + facetobj.value + ')',
                    name: facetobj.key,
                    inputValue: facetobj.key,
                    id: 'checkbox_' + facetobj.key + '_' + String(Ext.id()),
                    /*
                     added to resolve defect SAV-5380.  Needs design to assign a class.
                     */
                    style: {
                        'white-space': 'nowrap'
                    },
                    listeners: {
                        'change': Ext.bind(me.onFacetFilterChange, me)
                    }
                };

                me.down('#stringFacet').add(checkbox);
            });

        }
    },

    getFormattedDateRange: function (period) {

        var now = new Date(),

            dateObject = {startDate: '', endDate: Ext.Date.format(now, this.dateFormat)},
            sinceTheBeginningOfTime = new Date('1/1/1971');

        switch (period) {
            case 'any'  :
                dateObject.startDate = Ext.Date.format(sinceTheBeginningOfTime, this.dateFormat);
                break;

            case 'past_year'    :
                dateObject.startDate = Ext.Date.format(Ext.Date.subtract(now, Ext.Date.YEAR, 1), this.dateFormat);
                break;

            case 'past_month'    :
                dateObject.startDate = Ext.Date.format(Ext.Date.subtract(now, Ext.Date.MONTH, 1), this.dateFormat);
                break;

            case 'past_week'    :
                dateObject.startDate = Ext.Date.format(Ext.Date.subtract(now, Ext.Date.DAY, 7), this.dateFormat);
                break;

            case 'past_day'    :
                dateObject.startDate = Ext.Date.format(Ext.Date.subtract(now, Ext.Date.DAY, 1), this.dateFormat);
                break;

            case 'custom'   :
                // TODO: not handled yet
                break;

            default:
                Ext.Error.raise({
                    msg: 'Unknown value: ' + period
                });
        }

        return dateObject;
    },

    onDateRangeChange: function (btn) {

        var fieldName = btn.ownerCt.itemId.replace('facets_', ''),
            rangeName = btn.lastValue[fieldName],
            me = btn.findParentByType('search_resultsDals_resultsfacet'),
            dateRange = me.getFormattedDateRange(rangeName),
            customDates = btn.up('#facets_' + me.facet.facetId).queryById('customDatesPanel'),
            updateExisting = false;

        if (rangeName !== 'custom') {
            if (!me.dal.get('dateTimeRanges').length) {
                me.dal.set('dateTimeRanges', []);   // just set to an empty array
            }
            var newDateRange = {
                'Startdate': dateRange.startDate,
                'dateRangeName': rangeName,
                'DateFieldName': fieldName,
                'Enddate': dateRange.endDate
            };

            if (me.dal.get('dateTimeRanges').length > 0) {
                Ext.each(me.dal.get('dateTimeRanges'), function (range, index) {
                    if (range.DateFieldName === fieldName) {
                        // replace it, do not add another
                        me.dal.get('dateTimeRanges')[index] = newDateRange;
                        updateExisting = true;
                    }
                });
            }

            if (!updateExisting) {
                me.dal.get('dateTimeRanges').push(newDateRange);
            }

            var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

            if (searchController !== undefined) {
                me.doFilter(btn);
            }

            customDates.collapse();
            customDates.collapsed = true;

        } else {

            customDates.expand();
            customDates.collapsed = false;
        }
    },

    doCustomDateSearch: function () {

        var startDate = Ext.Date.format(this.queryById('fromDate').getValue(), this.dateFormat),
            endDate = Ext.Date.format(this.queryById('toDate').getValue(), this.dateFormat),
            fieldName = this.query('form')[0].itemId.replace('facets_', ''),
            rangeName = 'custom',
            newDateRange = {
                'Startdate': startDate,
                'dateRangeName': rangeName,
                'DateFieldName': fieldName,
                'Enddate': endDate
            },
            updateExisting = false,
            me = this;


        if (!me.dal.get('dateTimeRanges').length) {
            me.dal.set('dateTimeRanges', []);   // just set to an empty array
        }

        if (me.dal.get('dateTimeRanges').length > 0) {
            Ext.each(me.dal.get('dateTimeRanges'), function (range, index) {
                if (range.DateFieldName === fieldName) {
                    // replace it, do not add another
                    me.dal.get('dateTimeRanges')[index] = newDateRange;
                    updateExisting = true;
                }
            });
        }

        if (!updateExisting) {
            me.dal.get('dateTimeRanges').push(newDateRange);
        }

        var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

        if (searchController !== undefined) {
            this.doFilter(me);
        }
    },

    onFacetFilterChange: function (btn) {

        var filterExists = false,
            facet = this.facet.facetId,
            me = this;
        /*
         check to see if this facet filter exists in the store already
         */

        if (me.dal.get('facetFilterCriteria').length) {

            Ext.each(me.dal.get('facetFilterCriteria'), function (filter, index) {

                if (filter) {

                    var values = filter.facetValues;

                    if (filter.facetName === facet) { // if it already exists

                        filterExists = true;

                        if (btn.value) {   // if the checkbox has been selected, add the selection

                            values.push(btn.inputValue);

                        } else {       // if the checkbox has been deselected, remove the selection

                            Ext.each(values, function (val, ind) {
                                if (val === btn.inputValue) {
                                    Ext.Array.remove(values, values[ind]);
                                }
                            });
                        }
                    }

                    if (values.length > 0) {
                        filter.facetValues = values;
                    } else {
                        me.dal.get('facetFilterCriteria').splice(index, 1);   // remove the facetFilterCriteria entirely
                    }
                }

            });

            if (!filterExists) {
                me.dal.get('facetFilterCriteria').push({
                    'facetName': facet,
                    'facetValues': [btn.inputValue]   // this is always an array
                });
            }

        } else {
            if (me.dal.get('facetFilterCriteria').length === 0) {
                me.dal.set('facetFilterCriteria', []);
            }
            me.dal.get('facetFilterCriteria').push({
                'facetName': facet,
                'facetValues': [btn.inputValue]   // this is always an array
            });
        }
        var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent');

        if (searchController !== undefined) {
            this.doFilter(btn);
        }

    },

    doFilter: function (btn) {

        var searchController = Savanna.controller.Factory.getController('Savanna.search.controller.SearchComponent'),
            component = searchController.getSearchComponent(btn),
            currentDalPanel = component.down('#searchdals').queryById(this.dal.get('id')),
            searchString = component.queryById('searchbar').buildSearchString(),
            searchObj = searchController.buildSearchObject(searchString, this.dal, currentDalPanel);

        searchController.buildAndLoadResultsStore(this.dal, component, searchObj, 'filter');
    }
});