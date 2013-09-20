var ThetusTestHelpers;

(function (ThetusHelpers) {
    "use strict";

    var legacyDal = {
        "displayName": "Savanna",
        "id": "SolrJdbc",
        "outputTypes": [
            {
                "type": "sav_searchOutputFlagType_ReturnResults"
            },
            {
                "type": "sav_searchOutputFlagType_ReturnTagCloud"
            },
            {
                "type": "sav_searchOutputFlagType_ReturnFacets"
            },
            {
                "type": "sav_searchOutputFlagType_ReturnTermCloud"
            },
            {
                "type": "sav_searchOutputFlagType_Buckets"
            }
        ],
        "inputTypes": [
            {
                "type": "sav_searchInputType_DateRange"
            },
            {
                "type": "sav_searchInputType_TagCloud"
            },
            {
                "type": "sav_searchInputType_NounVerbPhrase"
            },
            {
                "type": "sav_searchInputType_PosProximity"
            },
            {
                "type": "sav_searchInputType_TextWithinDoc"
            },
            {
                "type": "sav_searchInputType_Text"
            },
            {
                "type": "sav_searchInputType_NumberRange"
            },
            {
                "type": "sav_searchInputType_QuerySuggest"
            },
            {
                "type": "sav_searchInputType_FacetFilter"
            },
            {
                "type": "sav_searchInputType_TermCloud"
            },
            {
                "type": "sav_searchInputType_BucketedRange"
            },
            {
                "type": "sav_searchInputType_Heatmap"
            },
            {
                "type": "sav_searchInputType_Proximity"
            },
            {
                "type": "sav_searchInputType_Geo"
            },
            {
                "type": "sav_searchInputType_AbacFilter"
            },
            {
                "type": "sav_searchInputType_GetFacetNames"
            },
            {
                "type": "sav_searchInputType_SortOrder"
            },
            {
                "type": "sav_searchInputType_ContentDocUri"
            },
            {
                "type": "sav_searchInputType_PublisherId"
            },
            {
                "type": "sav_searchInputType_FacetName"
            }
        ],
        "facetDescriptions": [
            {
                "enumValues": null,
                "facetId": "published-date",
                "facetDataType": "DATE",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Publish Date",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "ingest-date",
                "facetDataType": "DATE",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Ingest Date",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "producer",
                "facetDataType": "STRING",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Producer",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "producer-category",
                "facetDataType": "STRING",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Category",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "distributor",
                "facetDataType": "STRING",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Distributor",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "composite",
                "facetDataType": "STRING",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "Classification",
                "enumValuesType": "sav_facetEnumType_None"
            },
            {
                "enumValues": null,
                "facetId": "isf-source-type",
                "facetDataType": "STRING",
                "providesAggregateData": true,
                "canFilterOn": true,
                "displayValue": "ISF Source Type",
                "enumValuesType": "sav_facetEnumType_None"
            }
        ],
        "timeoutMillis": 5000,
        "sortOrderVOs": null,
        "searchGeoTypes": [ "sav_searchInputType_Geo" ],
        "supportsHyperDynamicFacets": false,
        "textDescription": "",
        "customSearchDescription": {
            "customSearchGroups": null
        }
    };

    var groupedDal = {
        "id": "mockDAL",
        "inputTypes": [
            {
                "type": "sav_searchInputType_Text"
            },
            {
                "type": "sav_searchInputType_FacetFilter"
            }
        ],
        "outputTypes": [
            {
                "type": "sav_searchOutputFlagType_ReturnResults"
            },
            {
                "type": "sav_searchOutputFlagType_ReturnFacets"
            }
        ],
        "displayName": "mockDAL",
        "facetDescriptions": [{
            "displayValue": "Publish Date",
            "facetId": "published-date",
            "facetDataType": "DATE",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }, {
            "displayValue": "Ingest Date",
            "facetId": "ingest-date",
            "facetDataType": "DATE",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }, {
            "displayValue": "Producer",
            "facetId": "producer",
            "facetDataType": "STRING",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }, {
            "displayValue": "Category",
            "facetId": "producer-category",
            "facetDataType": "STRING",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }, {
            "displayValue": "Distributor",
            "facetId": "distributor",
            "facetDataType": "STRING",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }, {
            "displayValue": "Classification",
            "facetId": "composite",
            "facetDataType": "STRING",
            "providesAggregateData": true,
            "canFilterOn": true,
            "enumValues": null,
            "enumValuesType": "sav_facetEnumType_None"
        }],
        "timeoutMillis": 5000,
        "sortOrderVOs": null,
        "searchGeoTypes": null,
        "supportsHyperDynamicFacets": false,
        "textDescription": "",

        /* WARNING, WARNING, WARNING!!!!!!
         We restructured the data to get rid of the parent "customSearchDescription" data-member since it
         only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
         that is just a wrapper for a has-many....
         */
        "customSearchDescription": {
            "customSearchGroups": [
                {
                    "id": "group1",
                    "displayLabel": "Group 1",
                    "customSearchParameters": [
                        {
                            "list": [
                                "a good option",
                                "a bad option",
                                "a so-so option"
                            ],
                            "id": "dropdown1",
                            "parameterType": "drop-down",
                            "displayLabel": "It's a dropdown"
                        },
                        {
                            "defaultValue": "",
                            "id": "field1",
                            "parameterType": "text",
                            "displayLabel": "How are you feeling today?"
                        },
                        {
                            "radioOptions": [
                                {
                                    "id": "chicken",
                                    "parameterType": null,
                                    "displayLabel": "Chicken"
                                },
                                {
                                    "id": "turkey",
                                    "parameterType": null,
                                    "displayLabel": "Turkey"
                                },
                                {
                                    "id": "roastbeef",
                                    "parameterType": null,
                                    "displayLabel": "Roast Beef"
                                }
                            ],
                            "id": "radio1",
                            "parameterType": "radio",
                            "displayLabel": "Which do you prefer?"
                        },
                        {
                            "date": 1346104423747,
                            "id": "date1",
                            "parameterType": "date",
                            "displayLabel": "When it started"
                        },
                        {
                            "date": 1377640423747,
                            "id": "date2",
                            "parameterType": "date",
                            "displayLabel": "When it ended"
                        }
                    ]
                },
                {
                    "id": "group2",
                    "displayLabel": "Group 2",
                    "customSearchParameters": [
                        {
                            "defaultValue": true,
                            "id": "check1",
                            "parameterType": "checkbox",
                            "displayLabel": "Make it good"
                        },
                        {
                            "defaultValue": false,
                            "id": "check2",
                            "parameterType": "checkbox",
                            "displayLabel": "Make it better than that"
                        },
                        {
                            "radioOptions": [
                                {
                                    "id": "chicken",
                                    "parameterType": null,
                                    "displayLabel": "Chicken"
                                },
                                {
                                    "id": "turkey",
                                    "parameterType": null,
                                    "displayLabel": "Turkey"
                                },
                                {
                                    "id": "roastbeef",
                                    "parameterType": null,
                                    "displayLabel": "Roast Beef"
                                }
                            ],
                            "id": "radio1",
                            "parameterType": "radio",
                            "displayLabel": "Which do you prefer?"
                        },
                        {
                            "list": [
                                "score",
                                "coolness",
                                "price",
                                "length"
                            ],
                            "id": "savannaSortOrder",
                            "parameterType": "drop-down",
                            "displayLabel": "How do you want to sort it?"
                        }
                    ]
                },
                {
                    "id": "group3",
                    "displayLabel": "Group 3",
                    "customSearchParameters": [
                        {
                            "list": [
                                "name",
                                "country",
                                "company",
                                "type"
                            ],
                            "id": "keyvalues1",
                            "parameterType": "key-value",
                            "displayLabel": "Set some filters"
                        }
                    ]
                }
            ]
        }
    };

    var allDals = {
        defaultId: "mockDAL",
        sources: [
            legacyDal,
            groupedDal,
            {
                "id": "MediaWiki",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_Text"
                    },
                    {
                        "type": "sav_searchInputType_ContentDocUri"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    }
                ],
                "displayName": "Wikipedia",
                "facetDescriptions": [ ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "Pages on Wikipedia",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": null
                }
            }, {
                "id": "Linkedin",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_GetFacetNames"
                    },
                    {
                        "type": "sav_searchInputType_Text"
                    },
                    {
                        "type": "sav_searchInputType_FacetFilter"
                    },
                    {
                        "type": "sav_searchInputType_FacetName"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    },
                    {
                        "type": "sav_searchOutputFlagType_ReturnFacets"
                    },
                    {
                        "type": "sav_searchOutputFlagType_Buckets"
                    }
                ],
                "displayName": "Linkedin",
                "facetDescriptions": [
                    {
                        "facetId": "location",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Location"
                    },
                    {
                        "facetId": "current-company",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Current-Company"
                    },
                    {
                        "facetId": "past-company",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Past-Company"
                    },
                    {
                        "facetId": "school",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "School"
                    },
                    {
                        "facetId": "industry",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": false,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Industry"
                    },
                    {
                        "facetId": "network",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": false,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": [
                            {
                                "id": "F",
                                "displayValue": "FirstDegreeConnection"
                            },
                            {
                                "id": "S",
                                "displayValue": "SecondDegreeConnection"
                            },
                            {
                                "id": "A",
                                "displayValue": "InsideOneOfYourGroup"
                            },
                            {
                                "id": "O",
                                "displayValue": "OutOfNetWorkConnection"
                            }
                        ],
                        "displayValue": "Network"
                    },
                    {
                        "facetId": "language",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": [
                            {
                                "id": "en",
                                "displayValue": "English"
                            },
                            {
                                "id": "es",
                                "displayValue": "Spanish"
                            },
                            {
                                "id": "fr",
                                "displayValue": "French"
                            },
                            {
                                "id": "de",
                                "displayValue": "German"
                            },
                            {
                                "id": "it",
                                "displayValue": "Italian"
                            },
                            {
                                "id": "pt",
                                "displayValue": "Portuguese"
                            },
                            {
                                "id": "_o",
                                "displayValue": "Others"
                            }
                        ],
                        "displayValue": "Language"
                    }
                ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "Users on Linkedin",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": null
                }
            }, {
                "id": "Flickr",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_GeoBox"
                    },
                    {
                        "type": "sav_searchInputType_Text"
                    },
                    {
                        "type": "sav_searchInputType_FacetFilter"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    }
                ],
                "displayName": "Flickr",
                "facetDescriptions": [
                    {
                        "facetId": "locations-string",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Locations"
                    }
                ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "Photos on Flickr",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": null
                }
            }, {
                "id": "Twitter",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_Text"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    }
                ],
                "displayName": "Twitter",
                "facetDescriptions": [ ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "Twitter tweets",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": null
                }
            }, {
                "id": "EBSCO",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_DateRange"
                    },
                    {
                        "type": "sav_searchInputType_GetFacetNames"
                    },
                    {
                        "type": "sav_searchInputType_Text"
                    },
                    {
                        "type": "sav_searchInputType_FacetFilter"
                    },
                    {
                        "type": "sav_searchInputType_FacetName"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    },
                    {
                        "type": "sav_searchOutputFlagType_ReturnFacets"
                    },
                    {
                        "type": "sav_searchOutputFlagType_Buckets"
                    }
                ],
                "displayName": "EBSCO",
                "facetDescriptions": [
                    {
                        "facetId": "published-date",
                        "facetDataType": "DATE",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "sav_facetEnumType_None",
                        "enumValues": null,
                        "displayValue": "Publish Date"
                    },
                    {
                        "facetId": "SubjectEDS",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": false,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Subject EDS"
                    },
                    {
                        "facetId": "SourceType",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Source Type"
                    },
                    {
                        "facetId": "Language",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Language"
                    },
                    {
                        "facetId": "ContentProvider",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Content Provider"
                    },
                    {
                        "facetId": "Publisher",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Publisher"
                    },
                    {
                        "facetId": "Journal",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Journal"
                    },
                    {
                        "facetId": "SubjectGeographic",
                        "facetDataType": "STRING",
                        "providesAggregateData": true,
                        "canFilterOn": true,
                        "enumValuesType": "String",
                        "enumValues": null,
                        "displayValue": "Geography"
                    }
                ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "Documents on EBSCO",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": null
                }
            }, {
                "id": "MOCK",
                "inputTypes": [
                    {
                        "type": "sav_searchInputType_Text"
                    },
                    {
                        "type": "sav_searchInputType_FacetFilter"
                    }
                ],
                "outputTypes": [
                    {
                        "type": "sav_searchOutputFlagType_ReturnResults"
                    },
                    {
                        "type": "sav_searchOutputFlagType_ReturnFacets"
                    }
                ],
                "displayName": "MOCK",
                "facetDescriptions": [ ],
                "timeoutMillis": 5000,
                "sortOrderVOs": null,
                "searchGeoTypes": null,
                "supportsHyperDynamicFacets": false,
                "textDescription": "A MOCK Dal For Testing Custom Search Options",

                /* WARNING, WARNING, WARNING!!!!!!
                 We restructured the data to get rid of the parent "customSearchDescription" data-member since it
                 only has "customSearchGroups" and we do not really want to create a has-a relationship for a model
                 that is just a wrapper for a has-many....
                 */
                "customSearchDescription": {
                    "customSearchGroups": [
                        {
                            "id": "group1",
                            "displayLabel": "Group 1",
                            "customSearchParameters": [
                                {
                                    "list": [
                                        "a good option",
                                        "a bad option",
                                        "a so-so option"
                                    ],
                                    "id": "dropdown1",
                                    "parameterType": "drop-down",
                                    "displayLabel": "It's a dropdown"
                                },
                                {
                                    "defaultValue": "",
                                    "id": "field1",
                                    "parameterType": "text",
                                    "displayLabel": "How are you feeling today?"
                                },
                                {
                                    "date": 1346104423747,
                                    "id": "date1",
                                    "parameterType": "date",
                                    "displayLabel": "When it started"
                                },
                                {
                                    "date": 1377640423747,
                                    "id": "date2",
                                    "parameterType": "date",
                                    "displayLabel": "When it ended"
                                }
                            ]
                        },
                        {
                            "id": "group2",
                            "displayLabel": "Group 2",
                            "customSearchParameters": [
                                {
                                    "defaultValue": true,
                                    "id": "check1",
                                    "parameterType": "checkbox",
                                    "displayLabel": "Make it good"
                                },
                                {
                                    "defaultValue": false,
                                    "id": "check2",
                                    "parameterType": "checkbox",
                                    "displayLabel": "Make it better than that"
                                },
                                {
                                    "radioOptions": [
                                        {
                                            "id": "chicken",
                                            "parameterType": null,
                                            "displayLabel": "Chicken"
                                        },
                                        {
                                            "id": "turkey",
                                            "parameterType": null,
                                            "displayLabel": "Turkey"
                                        },
                                        {
                                            "id": "roastbeef",
                                            "parameterType": null,
                                            "displayLabel": "Roast Beef"
                                        }
                                    ],
                                    "id": "radio1",
                                    "parameterType": "radio",
                                    "displayLabel": "Which do you prefer?"
                                },
                                {
                                    "list": [
                                        "score",
                                        "coolness",
                                        "price",
                                        "length"
                                    ],
                                    "id": "savannaSortOrder",
                                    "parameterType": "drop-down",
                                    "displayLabel": "How do you want to sort it?"
                                }
                            ]
                        },
                        {
                            "id": "group3",
                            "displayLabel": "Group 3",
                            "customSearchParameters": [
                                {
                                    "list": [
                                        "name",
                                        "country",
                                        "company",
                                        "type"
                                    ],
                                    "id": "keyvalues1",
                                    "parameterType": "key-value",
                                    "displayLabel": "Set some filters"
                                }
                            ]
                        }
                    ]
                }
            } ]
    };

    ThetusHelpers.Fixtures = ThetusHelpers.Fixtures || {};
    ThetusHelpers.Fixtures.DalSources = ThetusHelpers.Fixtures.DalSources || {};

    ThetusHelpers.Fixtures.DalSources.legacyDal = legacyDal;
    ThetusHelpers.Fixtures.DalSources.groupedDal = groupedDal;
    ThetusHelpers.Fixtures.DalSources.allDals = allDals;

})(ThetusTestHelpers || (ThetusTestHelpers = {}));