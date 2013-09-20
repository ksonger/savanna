/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 9/10/13
 * Time: 9:42 AM
 * To change this template use File | Settings | File Templates.
 */
var ThetusTestHelpers;

(function (ThetusHelpers) {
    'use strict';

    var dateFacet = {
        'enumValues': null,
        'facetId': 'published-date',
        'facetDataType': 'DATE',
        'providesAggregateData': true,
        'canFilterOn': true,
        'displayValue': 'Publish Date',
        'enumValuesType': 'sav_facetEnumType_None'
    };

    var stringFacet = {
        'enumValues': null,
        'facetId': 'producer',
        'facetDataType': 'STRING',
        'providesAggregateData': true,
        'canFilterOn': true,
        'displayValue': 'Producer',
        'enumValuesType': 'sav_facetEnumType_None'
    };

    var unknownFacet = {
        'enumValues': null,
        'facetId': 'producer',
        'facetDataType': 'UNKNOWN',
        'providesAggregateData': true,
        'canFilterOn': true,
        'displayValue': 'Producer',
        'enumValuesType': 'sav_facetEnumType_None'
    };

    ThetusHelpers.Fixtures = ThetusHelpers.Fixtures || {};
    ThetusHelpers.Fixtures.FacetModels = ThetusHelpers.Fixtures.FacetModels || {};

    ThetusHelpers.Fixtures.FacetModels.dateFacet = dateFacet;
    ThetusHelpers.Fixtures.FacetModels.stringFacet = stringFacet;
    ThetusHelpers.Fixtures.FacetModels.unknownFacet = unknownFacet;

})(ThetusTestHelpers || (ThetusTestHelpers = {}));