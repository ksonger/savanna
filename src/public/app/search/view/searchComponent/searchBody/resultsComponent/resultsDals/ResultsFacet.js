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
    border: false,
    cls: 'results-facet',
    ui: 'results-facet',
    collapsible: true,
    collapsed: true,
    titleCollapse: true,
    dateFormat: 'Y-m-d\\TH:i:s.m\\Z',

    initComponent: function () {

        this.title = this.facet.displayValue;
        this.items = this.buildFacetOptions();
        this.callParent(arguments);


        if (this.facet.facetDataType === 'STRING') {
            this.buildFacetFilterGroup();
        }
    },

    buildFacetOptions: function () {

        var content,
            me = this;

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
                                cls: 'small-spacing',
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
                                    'change': Ext.bind(me.onDateRangeChange, me)
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
                                cls: 'customDatePanel',
                                items: [
                                    {
                                        xtype: 'search_resultsDals_resultsdatefield',
                                        fieldLabel: 'From',
                                        labelWidth: 35,
                                        width: 155,
                                        name: 'from_date',
                                        itemId: 'fromDate',
                                        value: this.convertDateToUTC(new Date('1/1/1971'))
                                    },
                                    {
                                        xtype: 'search_resultsDals_resultsdatefield',
                                        fieldLabel: 'To',
                                        labelWidth: 35,
                                        width: 155,
                                        name: 'to_date',
                                        itemId: 'toDate',
                                        value: this.convertDateToUTC(new Date())
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
                                cls: 'small-spacing',
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
            facetId = this.facet.facetId,
            me = this;
        if (searchResults.store.facetValueSummaries) {
            Ext.each(searchResults.store.facetValueSummaries[facetId].facetValues, function (facetobj) {

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
                        'change': Ext.bind(me.onFacetFilterChange, me),
                        render: function(label){
                            Ext.create('Ext.tip.ToolTip',{
                                target: label.getEl(),
                                html: facetobj.key
                            });
                        }
                    }
                };

                me.down('#stringFacet').add(checkbox);
            });

        }
    },

    convertDateToUTC: function(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    },

    getFormattedDateRange: function (period) {

        var now = this.convertDateToUTC(new Date()),
            dateObject = {startDate: '', endDate: Ext.Date.format(now, this.dateFormat)},
            sinceTheBeginningOfTime = this.convertDateToUTC(new Date('1/1/1971'));

        switch (period) {
            case 'all'  :
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

        //for "anytime", remove the date filter for this facet
        if(rangeName === "all"){
            var ranges = me.dal.get('dateTimeRanges'),
                dateLen = ranges.length,
                range = null,
                removed = false;

            //go through the date ranges array backwards
            for (var i = dateLen - 1;  i >= 0; i--) {
                range = ranges[i];
                //find the date range that corresponds to the facet that just changed
                if (range.DateFieldName == fieldName) {
                    Ext.Array.remove(ranges, range);
                    removed = true;
                    break;
                }
            }
            if (removed) {
                //Update the search results if we were able to remove a date range
                me.doFilter(me);
                return;
            }
        }

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
                me.doFilter(me);
            }

            customDates.collapse();
            customDates.collapsed = true;

        } else {

            customDates.expand();
            customDates.collapsed = false;
            me.doCustomDateSearch();
        }
    },

    getFilters: function () {
        var filters = this.dal.data.facetFilterCriteria;

        if (!filters || !filters.length || filters === '') {
            this.dal.data.facetFilterCriteria = [];   // just set to an empty array
            filters = this.dal.data.facetFilterCriteria;
        }
        return filters;
    },

    doCustomDateSearch: function () {
        //already converted to utc dates
        var startDate = this.queryById('fromDate').getValue(),
            endDate = this.queryById('toDate').getValue();

        //set to beginning of next day so that the chosen end date will be included in the range
        endDate.setDate(endDate.getDate() + 1);

        //format the dates
        startDate = Ext.Date.format(startDate, this.dateFormat);
        endDate = Ext.Date.format(endDate, this.dateFormat);


        var fieldName = this.query('form')[0].itemId.replace('facets_', ''),
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
            facetId = this.facet.facetId,
            me = this;
        /*
         check to see if this facet filter exists in the store already
         */

        var filters = this.getFilters();
        Ext.each(filters, function (filter, index) {
            if (filter) {
                var values = filter.facetValues;
                if (filter.facetId === facetId) { // if it already exists
                    filterExists = true;
                    if (btn.value) {   // if the checkbox has been selected, add the selection

                        values.push(btn.inputValue);

                    } else {       // if the checkbox has been deselected, remove the selection
                        //Since we are removing, we need to iterate from end to beginning
                        var len = values.length;
                        var valueIndex;
                        for (valueIndex = len - 1;  valueIndex >= 0; valueIndex--) {
                            var val = values[valueIndex];
                            if (val.value === btn.inputValue) {
                                Ext.Array.remove(values, values[valueIndex]);
                            }
                        }
                    }
                }

                if (values.length > 0) {
                    filter.facetValues = values;
                } else {
                    me.dal.get('facetFilterCriteria').splice(index, 1);   // remove the facetFilterCriteria entirely
                }
            }
        });

        if (!filterExists && btn.value) {
            filters.push({
                'facetId': facetId,
                'facetName': facetId,
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
            mapView = component.down('search_map_canvas'),
            searchObj = searchController.buildSearchObject(searchString, this.dal, currentDalPanel, mapView);

        searchController.buildAndLoadResultsStore(this.dal, component, searchObj, 'filter');
    }
});