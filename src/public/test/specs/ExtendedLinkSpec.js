/* global Ext: false,
          describe: false, beforeEach: false, afterEach: false, it: false, expect: false,
          go: false, ExtendedLink: false
*/
Ext.require('Savanna.crumbnet.utils.ExtendedLink');

describe('Savanna.crumbnet.utils.ExtendedLink', function() {

    describe('default behavior', function() {
        var link = null;

        beforeEach(function() {
            link = new ExtendedLink();
        });

        afterEach(function() {
            link = null;
        });

        it('should be able to create a simple link', function() {
            expect(link instanceof ExtendedLink).toBeTruthy();
        });

        it('should have no points', function() {
            expect(link.points.count).toBe(0);
        });

        describe('adding points to link', function() {
            var geometry = null;

            describe('creating a link with less than four points', function() {

                beforeEach(function() {
                    var newPointsList = new go.List();
                    newPointsList.add(new go.Point(0, 0));
                    newPointsList.add(new go.Point(10, 10));
                    newPointsList.add(new go.Point(20, 20));

                    link.points = newPointsList;
                    link.data = { category: 'Tapered'};

                    geometry = link.makeGeometry();
                });

                afterEach(function() {
                    link.points = new go.List();

                    geometry = null;
                });

                it('should have only one segment in the figure generated for this link', function() {
                    expect(link.points.count).toBe(3);
                    expect(geometry.figures.count).toBe(1);
                    expect(geometry.figures.first().segments.count).toBe(1);
                });
            });

            describe('creating a link with at least four points', function() {

                beforeEach(function() {
                    var newPointsList = new go.List();

                    newPointsList.add(new go.Point(0, 0));
                    newPointsList.add(new go.Point(5, 1));
                    newPointsList.add(new go.Point(10, 10));
                    newPointsList.add(new go.Point(10, -10));

                    link.points = newPointsList;
                    link.data = { category: 'Tapered'};

                    geometry = link.makeGeometry();
                });

                afterEach(function() {
                    link.points = new go.List();

                    geometry = null;
                });

                it('should have two segments in the figure generated for this link', function() {
                    expect(link.points.count).toBe(4);
                    expect(geometry.figures.count).toBe(1);
                    expect(geometry.figures.first().segments.count).toBe(2);
                });
            });
        });
    });
});