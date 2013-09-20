/* global _: false, console: true */
var ThetusTestHelpers;
(function(ThetusTestHelpers) {
    'use strict';

    /*
     * FakeRequestCache
     */
    function FakeRequestCache() {
        this.cache = [];
        this.length = this.cache.length;
    }

    FakeRequestCache.prototype.addRequest = function(xhr) {
        this.cache.push(xhr);
        this.length = this.cache.length;
    };

    FakeRequestCache.prototype.get = function(i) {
        return this.cache[i];
    };

    FakeRequestCache.prototype.getRequest = function(method, url) {
        var req = null;
        for (var i = 0; i < this.cache.length; i += 1) {
            req = this.cache[i];

            if (req.method === method && req.url === url) {
                break;
            }
        }

        return req;
    };

    FakeRequestCache.prototype.clear = function() {
        this.cache = [];
        this.length = 0;
    };

    /**
     * FakeServer
     *   Custom implementation similar to SinonJS's Fake Server
     *   The reason being, that we needed to be able to ignore some requests
     *   (i.e. template requests)
     *
     *   Typical use case:
     *
     * <code>
     *   var fakeServer = new FakeServer();
     *   fakeServer.handleAuthentication(); // if there is code to deal with authentication
     *
     *   // before running test code which will make server requests...
     *   fakeServer.respondWith('GET', '/SavannaX/foo/bar/baz', { id: 'YO', someField: 'Dude!' });
     *
     *   someObj.someMethodWhichMakesServerCalls();
     *
     *   fakeServer.respond({
     *      errorOnInvalidRequest: true, // if you want to fail on unexpected requests
     *      testBody: function(requestBody) {
     *          // if you want to validate what is sent in the request...
     *          var json = JSON.parse(requestBody);
     *
     *          return json.id === 'someId';
     *      }
     *   );
     *
     *   // do any other tests...
     *
     *   fakeServer.restore(); // clean up after yourself
     *   </code>
     *
     *   @constructor
     *   @param {sinon} sinon a Sinon.js instance (should be globally available in Jasmine unit tests)
     *   @param {object} [options] object of options
     *   @return {FakeServer} reference to mocked server to use in mocking server request/responses
     */
    function FakeServer(sinon, options) {
        this.options = options || {};
        this.requestCache = new FakeRequestCache();
        this.responseCache = {};
        this.responses = {};
        this.skipRequest = {};

        this.sinon = sinon;
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.xhr.useFilters = true;

        this.filters = [
            /\.html$/
        ];

        this.xhr.addFilter(_.bind(this.filterRequest, this));

        this.xhr.onCreate = _.bind(this.addRequest, this);
    }

    ThetusTestHelpers.FakeServer = FakeServer;

    // Sinon override to process adding a request to the cache
    FakeServer.prototype.addRequest = function(xhr) {
        this.requestCache.addRequest(xhr);
    };

    // Sinon override filter the requests we can ignore (i.e. template requests)
    FakeServer.prototype.filterRequest = function(method, url) { // also can be passed async, username, password
        var skipRequest = false;

        for (var i = 0; i < this.filters.length; i += 1) {
            var filter = this.filters[i];

            if ((filter instanceof RegExp && filter.test(url)) || filter === url) {
                skipRequest = true;
                break;
            }
        }

        if (skipRequest) {
            this.skipRequest[method] = this.skipRequest[method] || {};
            this.skipRequest[method][url] = true;
        }

        return skipRequest;
    };

    /**
     * clear
     *
     * Resets the internal state of the FakeServer, removing all cached responses
     */
    FakeServer.prototype.clear = function() {
        this.requestCache.clear();
        this.responseCache = {};
        this.responses = {};
        this.skipRequest = {};
    };

    /**
     * restore
     *
     * Restores the mocked server back to the default instance and resets the internal state for the fake server
     */
    FakeServer.prototype.restore = function() {
        this.xhr.restore();
        this.clear();
    };

    FakeServer.prototype.validResponse = function(response) {
        var statusCode = response._statusCode || 200;
        var headers = response._headers || { 'Content-Type': 'application/json' };

        delete response._statusCode;

        // HACK: Need something cleaner that allows status code, content-type and response body to be set...
        if (_.isFunction(response)) {
            var callback = response;
            response = function() {
                return JSON.stringify(callback());
            };
        }
        else {
            response = JSON.stringify(response);
        }

        // Helper to generate Sinon-friendly responses
        return [ statusCode, headers, response ];
    };

    /**
     * respondWith
     *
     * Set up a response for a given METHOD/URL
     *
     * @param {String} method HTTP verb (i.e. GET|PUT|POST|DELETE|OPTIONS)
     * @param {String} url string of URL for request
     * @param {Object} [data] object of data for the response (TODO: document the structure of this object)
     */
    FakeServer.prototype.respondWith = function(method, url, data) {
        this.responseCache[method] = this.responseCache[method] || {};
        this.responseCache[method][url] = this.validResponse(data);
    };

    /**
     *  respond
     *
     *  Trigger processing of incoming server requests
     *
     * @param options
     *      testBody: function(requestBody) { return ''|'Error message of some sort'; } (callback handed the body of the request and returns validation message)
     *      testRequest: function(request) { return ''|'Error message of some sort'; } (callback handed the xhr request and returns validation message)
     *      returnBody: true|false  (indicates whether the content passed in should used as the response)
     *      errorOnInvalidRequest: true|false  (cause an error to be set if a request is made that is not expected)
     *      reportBody: true|false     (cause the requestBody to be included in any error messaging)
     */
    FakeServer.prototype.respond = function(options) {
        var respondOptions = options || this.options;

        for (var i = 0; i < this.requestCache.length; i += 1) {
            var request = this.requestCache.get(i);
            var method = request.method;
            var url = request.url;

            if (this.skipRequest[method] && this.skipRequest[method][url]) { continue; }

            var response = this.responseCache[method];
            var errMsg = '';

            if (respondOptions.reportBody) {
                console.log('"' + method + '" - ' + url);
                console.log('request.body', request.requestBody);
            }

            if (respondOptions.testRequest) {
                errMsg = respondOptions.testRequest(request);
            }

            if (!errMsg && respondOptions.testBody) {
                errMsg = respondOptions.testBody(request.requestBody);
            }

            if (!errMsg) {
                if (response) {
                    response = response[url];

                    if (response) {

                        // this is so we can pass an array of arguments to respond()
                        if (respondOptions.returnBody) {
                            if (response.length === 3) {
                                response.pop(); // remove the current body
                            }

                            if (typeof request.requestBody !== 'string') {
                                response.push(JSON.parse(request.requestBody));
                            }
                            else if (_.isFunction(response)) {
                                response.push(response());
                            }
                            else {
                                response.push(request.requestBody);
                            }
                        }

                        this.responses[method] = this.responses[method] || {};
                        this.responses[method][url] = true;

                        request.respond.apply(request, response);
                    }
                    else {
                        errMsg = 'No response for ' + url + ' via ' + method;
                    }
                }
                else {
                    errMsg = 'No "' + method + '" response for ' + url;
                }
            }

            if (errMsg === '') {
                continue;
            }

            if (respondOptions.errorOnInvalidRequest) {
                this.sinon.assert.fail(errMsg);
            }
            else {
                console.log(errMsg);
            }
        }

        this.requestCache.clear();
    };

    /**
     * respondedTo
     *
     * Check to see if the server has seen/responded to a request for the given HTTP method / URL
     *
     * @param method HTTP method (i.e. GET|PUT|POST|DELETE|OPTIONS)
     * @param url string of URL to test
     * @returns Boolean
     */
    FakeServer.prototype.respondedTo = function(method, url) {
        return this.responses[method] && this.responses[method][url];
    };
})(ThetusTestHelpers || (ThetusTestHelpers = {}));
