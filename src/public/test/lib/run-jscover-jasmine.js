/* global require: false, console: false, phantom: false, jasmine: false, jscoverage_report: false, utils: false */
/**
 * run-jscover-jasmine.js
 *
 * PhantomJS runner script to run JsCover coverage testing tool
 *
 * This is copied from http://tntim96.github.io/JSCover/manual/manual.xml
 */
var system = require('system'),
    fs = require('fs'),
    page,
    resultsDir = system.args[1],
    pageUrl = system.args[2],
    MAX_TIMEOUT = 12 * 60 * 1000; // hopefully our tests don't take longer than 12 minutes to run

phantom.injectJs('lib/utils/core.js');

if (system.args.length !== 3) {
    console.log('Usage: run-jasmine.js reportsDir URL');
    phantom.exit(1);
}

page = require('webpage').create();

// Route 'console.log()' calls from within the Page context to the main Phantom context (i.e. current 'this')
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.open(pageUrl, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    }
    else {
        console.log('Loaded ' + pageUrl);

        utils.core.waitfor(function () {
            return page.evaluate(function () {
                return document.body.querySelector('.symbolSummary .pending') === null;
            });
        },
        function () {
            var exitCode = page.evaluate(function () {
                var bodyDesc = document.body.querySelector('.description');

                if (bodyDesc && bodyDesc.innerText) {
                    console.log('');
                    console.log(bodyDesc.innerText);
                }

                var list = document.body.querySelectorAll('.results > #details > .specDetail.failed');

                if (list && list.length > 0) {
                    console.log('');
                    console.log(list.length + ' test(s) FAILED:');

                    for (var i = 0; i < list.length; ++i) {
                        var el = list[i],
                            desc = el.querySelector('.description'),
                            msg = el.querySelector('.resultMessage.fail');

                        if (desc || msg) {
                            console.log('');

                            if (desc && desc.innerText) {
                                console.log(desc.innerText);
                            }

                            if (msg && msg.innerText) {
                                console.log(msg.innerText);
                            }

                            console.log('');
                        }
                    }

                    return 1;
                }
                else {
                    var passingAlert = document.body.querySelector('.alert > .passingAlert.bar');

                    if (passingAlert && passingAlert.innerText) {
                        console.log(passingAlert.innerText);
                    }

                    return 0;
                }
            });

            console.log('Going to do jscoverage reporting....');
            page.evaluate(function () {
                if (typeof jscoverage_report === 'function') {
                    jscoverage_report('jscover');
                }
            });

            console.log('Going to do surefire report generation....');
            // Retrieve the result of the tests
            var f = null, i, len, filepath,
                suitesResults = page.evaluate(function(){
                    return jasmine.phantomjsXMLReporterResults;
                });

            // Save the result of the tests in files
            if (!fs.exists(resultsDir)) {
                fs.makeDirectory(resultsDir);
            }

            for ( i = 0, len = suitesResults.length; i < len; ++i ) {
                try {
                    filepath = resultsDir + '/' + suitesResults[i].xmlfilename;
                    f = fs.open(filepath, 'w');
                    f.write(suitesResults[i].xmlbody);
                    f.close();
                } catch (e) {
                    console.log(e);
                    console.log('ERROR: Unable to save result of Suite "' + suitesResults[i].xmlfilename + '"');
                }
            }

            if (!exitCode) {
                exitCode = page.evaluate(function() {
                    return jasmine.phantomjsXMLReporterPassed ? 0 : 1; //< exit(0) is success, exit(1) is failure
                });
            }

            phantom.exit(exitCode);

        },
        function () {
            console.log('timed out....');
            phantom.exit(1);
        },
        MAX_TIMEOUT);
    }
});
