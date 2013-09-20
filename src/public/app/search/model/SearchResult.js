/**
 * Created with IntelliJ IDEA.
 * User: ksonger
 * Date: 7/25/13
 * Time: 1:19 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Savanna.search.model.SearchResult', {
    extend: 'Ext.data.Model',


    requires: [

    ],

    fields: [

        {name: "latlonPairs", type: "array"},
        {name: "fileType", type: "object"},
        {name: "documentFileName", type: "string"},
        {name: "score", type: "int"},
        {name: "ingestionDate", type: "int"},
        {name: "documentSource", type: "string"},
        {name: "contentDocUri", type: "string"},
        {name: "uri", type: "string"},
        {name: "composite", type: "string"},
        {name: "title", type: "string"},
        {name: "previewString", type: "string"},
        {name: "classification", type: "string"},
        {name: "producer", type: "string"},
        {name: "relatedDocUris", type: "array"},
        {name: "publishedDate", type: "int"},
        {name: "entityCounts", type: "array"},
        {name: "isRead", type: "boolean"},
        {name: "metadata", type: "array"}
    ]
});
