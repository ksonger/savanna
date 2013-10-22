/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/31/13
 * Time: 4:31 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Savanna.search.view.searchComponent.searchBody.resultsComponent.ResultsPreviewContent', {
    extend: 'Ext.panel.Panel',
    controller: 'Savanna.search.controller.resultsComponent.ResultsPreviewContentController',
    alias: 'widget.search_resultspreviewcontent',
    header: false,
    bubbleEvents: ['search:previewNextButton', 'search:previewPrevButton'],

    requires: [
        'Savanna.search.controller.resultsComponent.ResultsPreviewContentController'
    ],

    overflowY: 'auto',

    items: [
        {
            xtype: 'panel',
            itemId: 'previewcontent',
            html: ''
        }
    ],

    tbar: [
        {
            height: 54,
            layout: 'anchor',
            xtype: 'container',
            border: false,
            defaults: {
                anchor: '100%',
                height: 27
            },
            items: [
                {
                    xtype: 'toolbar',
                    width: 620,
                    border: false,
                    itemId: 'results_preview_nav_text',
                    items: [
                        {
                            xtype: 'label',
                            text: 'Preview Results {currentIndex} of {totalResults}',
                            itemId: 'itemIndexAndTotalLabel'
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'prev',
                            itemId: 'previewPrevButton',
                            repeat: true
                        },
                        {
                            xtype: 'button',
                            text: 'next',
                            itemId: 'previewNextButton',
                            repeat: true
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    width: 620,
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add to MyStuff'
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            text: 'Open Result'
                        },
                        {
                            xtype: 'button',
                            text: 'Close',
                            itemId: 'previewclosebutton'
                        }
                    ]
                }
            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
        this.getController();
        //Savanna.controller.Factory.getController('Savanna.search.controller.ResultsComponent');
    },


    populate: function (record, metadata, index, totalResultsCount) {

        var capco = {'U': 'UNCLASSIFIED'},
            metaHTML = '<table>',
            row;

        var primaryKeys = [
            'docTitle',
            'uri_DEBUG',
            'classification',
            'authors',
            'abstract',
            'document-description',
            'published-date',
            'publisher',
            'pubName',
            'producer',
            'producer-category',
            'distributor',
            'document-organization',
            'document-language',
            'document-country',
            'pageCount',
            'ingest-date',
            'modifiedDate',
            'document-original-name',
            'document-type',
            'retrieval-url',
            'relatedDocs',
            'document_comments',
            'ingest-state',
            'keyCitationPlain',
            'keyCitationHtml'
        ];

        var added = {};

        /*
        primary attributes display first
         */
        Ext.each(primaryKeys, function (key) {
            Ext.each(metadata.data.items, function (item) {
                if (item.data.key === key) {
                    if(key === 'docTitle')    {
                        row = '<tr><td class="doctitle-meta-value">' + item.data.value + '</td></tr>';
                    } else  {
                        row = '<tr><td class="meta-displaylabel">' + item.data.displayLabel + '</td></tr><tr><td class="meta-value">' + item.data.value + '</td></tr>';
                    }

                    metaHTML += row;
                    added[item.data.key] = item.data.value;
                }
            });
        });

        /*
        other dynamic attributes display below the primary attributes
         */
        Ext.each(metadata.data.items, function (item) {
            if (!added[item.data.key]) {
                if (item.data.key.toLowerCase().indexOf('date') !== -1) {
                    item.data.value = Ext.Date.format(new Date(item.data.value), 'F d, Y');
                }
                if (item.data.key === 'classification') {
                    item.data.value = capco[item.data.value];
                }
                row = '<tr><td class="meta-displaylabel">' + item.data.displayLabel + '</td></tr><tr><td class="meta-value">' + item.data.value + '</td></tr>';
                metaHTML += row;
            }
        });

        metaHTML += '</table>';

        this.queryById('previewcontent').update(metaHTML);

        var label = this.getComponent('itemIndexAndTotalLabel');
        if (label) {
            label.text = 'Preview Results ' + index + ' of ' + totalResultsCount;
        }

    }
});