/* global Ext: false */
Ext.define('Savanna.view.PrintModal', {
    extend: 'Ext.window.Window',
    alias: 'widget.print-modal',

    height: '90%',
    width: '90%',
    layout: 'fit',
    modal: true,

    // NOTE: this is used in the stylesheet to control the printing display
    cls: 'print-modal',

    title: 'Print',

    tbar: [
        {
            type: 'print',
            text: 'Print'
        },
        {
            type: 'cancel',
            text: 'Cancel'
        }
    ],

    items: [
        {
            xtype: 'component',
            itemId: 'printContent'
        }
    ],

    initComponent: function() {
        this.callParent(arguments);

        this.on('afterrender', function() {
            // NOTE: you specify the content to put in the modal by doing a:
            //         Ext.create('Savanna.view.PrintModal' {
            //            html: (htmlString | Ext.element reference | HTMLELement reference)
            //         });
            if (this.initialConfig.html) {
                this.setPrintContent(this.initialConfig.html);
            }
        }, this);
    },

    // CUSTOM METHODS

    /**
     * Sets up the printable content for this instance
     * @param html (String|Ext.dom.Element|HTMLElement)
     *
     * Essentially, you can pass in either a stirng of HTML, an object that has an "outerHTML" property which contains
     * the string of HTML to use, or an object which implements the getHTML() method which returns a string of HTML.
     */
    setPrintContent: function(html) {
        var printContent = this.down('#printContent');

        if (html.outerHTML) {
            html = html.outerHTML;
        }
        else if (html.getHTML) {
            html = html.getHTML();
        }

        printContent.getEl().setHTML(html);
    },

    /**
     * accessor to the HTML content current set within the printable portion of this modal instance
     * @returns {String}
     */
    getPrintContent: function() {
        return this.down('#printContent').getEl().getHTML();
    }
});