Ext.define('Savanna.search.controller.resultsComponent.resultsDals.ResultsRefineSearchbarController',
    {
        extend: 'Deft.mvc.ViewController',

        control: {
            refine_search_terms: {
                'onsearchclick': 'onNewSearchTerm'
            }
        },

        //Called when a new search term is added by pressing enter or the search button.
        //(the search field itself fires on enter key press so we don't have to listen for it explicitly here)
        onNewSearchTerm: function (field) {
            var newTerm = field.getValue().trim();
            if (newTerm.length) {
                var searchComponent = field.findParentByType('search_searchcomponent'),
                    refineTerms = searchComponent.down('#refineterms');

                field.setValue(''); //whether it's a duplicate or new term, clear the text field
                if (!refineTerms.termExists(newTerm)) {
                    //new term...add to the list
                    refineTerms.addTerm(newTerm);

                    //Handle in main search results controller
                    //TODO: move this event to fire on the results component and not the application
                    Savanna.getApplication().fireEvent('results:refineSearch', field);
                    return true;
                }
            }
            return false;
        }
    }
);