var ThetusTestHelpers;

(function (ThetusHelpers) {
    'use strict';

    // NOTE: this data is duplicated in sr/public/app/assets/testCrumbnetTemplates.json
    var defaultPaletteTemplateResponse = {
        success: true,
        groups: [
            {
                id: 'TEST_PALETTE_GROUP_ONE',
                title: 'TEST PALETTE GROUP ONE',
                templates:
                [
                    { label: 'Concept label', category: 'Concept' },
                    { label: 'Hypothesis label', category: 'Hypothesis' },
                    { label: 'Question label', category: 'Question' }
                ]
            },
            {
                id: 'TEST_PALETTE_GROUP_TWO',
                title: 'TEST PALETTE GROUP TWO',
                templates:
                [
                    { label: 'Problem label', category: 'Problem' },
                    { label: 'Conclusion label', category: 'Conclusion' },
                    { label: 'Assumption label', category: 'Assumption' },
                    { label: 'Fact label', category: 'Fact' }
                ]
            }
        ]
    };

    var noTemplatesResponse = {
        success: true,
        groups: []
    };

    ThetusHelpers.Fixtures = ThetusHelpers.Fixtures || {};
    ThetusHelpers.Fixtures.Crumbnet = ThetusHelpers.Fixtures.Crumbnet || {};

    ThetusHelpers.Fixtures.Crumbnet.defaultPaletteTemplateResponse = defaultPaletteTemplateResponse;
    ThetusHelpers.Fixtures.Crumbnet.noTemplatesResponse = noTemplatesResponse;

})(ThetusTestHelpers || (ThetusTestHelpers = {}));