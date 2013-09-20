/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 8/6/13
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */

var ThetusTestHelpers;

(function (ThetusHelpers) {
    'use strict';

    var historyResults = [
        {
            "query": "apples",
            "date": 1375825806861
        },
        {
            "query": "oranges",
            "date": 1375825806862
        },
        {
            "query": "bananas",
            "date": 1375825806863
        }
    ];
    ThetusHelpers.Fixtures = ThetusHelpers.Fixtures || {};
    ThetusHelpers.Fixtures.HistoryResults = ThetusHelpers.Fixtures.HistoryResults || {};
    ThetusHelpers.Fixtures.HistoryResults.historyResults = historyResults;

})(ThetusTestHelpers || (ThetusTestHelpers = {}));

