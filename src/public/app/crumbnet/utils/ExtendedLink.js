/* global Ext: false, go: false */
//TODO - Can we include a class here without doing a Ext.define
Ext.define('Savanna.crumbnet.utils.ExtendedLink', {});

function ExtendedLink() {
    go.Link.call(this);
}

go.Diagram.inherit(ExtendedLink, go.Link);

// produce a Geometry from the Link's route
ExtendedLink.prototype.makeGeometry = function () {
    // First we need to check if the category in the link data is 'tapered'
    // Optionally if multiple categories were tapered we could test
    // a different value in the link data instead
    //TODO - this is temporary until the gojs lib is fixed to allow changing link classes
    if (this.data.category !== 'Tapered') {
        // Regular link! Call the base method and return:
        return go.Link.prototype.makeGeometry.call(this);
    }


    // maybe use the standard geometry for this route, instead?
    var numpts = this.pointsCount;
    if (numpts < 4 || this.computeCurve() !== go.Link.Bezier) {
        return go.Link.prototype.makeGeometry.call(this);
    }

    var p0 = this.getPoint(0);
    var p1 = this.getPoint((numpts > 4) ? 2 : 1);
    var p2 = this.getPoint((numpts > 4) ? numpts - 3 : 2);
    var p3 = this.getPoint(numpts - 1);
    var fromHoriz = Math.abs(p0.y - p1.y) < Math.abs(p0.x - p1.x);
    var toHoriz = Math.abs(p2.y - p3.y) < Math.abs(p2.x - p3.x);

    var p0x = p0.x + (fromHoriz ? 0 : -4);
    var p0y = p0.y + (fromHoriz ? -4 : 0);
    var p1x = p1.x + (fromHoriz ? 0 : -3);
    var p1y = p1.y + (fromHoriz ? -3 : 0);
    var p2x = p2.x + (toHoriz ? 0 : -2);
    var p2y = p2.y + (toHoriz ? -2 : 0);
    var p3x = p3.x + (toHoriz ? 0 : -1);
    var p3y = p3.y + (toHoriz ? -1 : 0);

    var fig = new go.PathFigure(p0x, p0y, true);  // filled
    var seg1 = new go.PathSegment(go.PathSegment.Bezier, p3x, p3y, p1x, p1y, p2x, p2y);
    fig.segments.add(seg1);

    p0x = p0.x + (fromHoriz ? 0 : 4);
    p0y = p0.y + (fromHoriz ? 4 : 0);
    p1x = p1.x + (fromHoriz ? 0 : 3);
    p1y = p1.y + (fromHoriz ? 3 : 0);
    p2x = p2.x + (toHoriz ? 0 : 2);
    p2y = p2.y + (toHoriz ? 2 : 0);

    var seg2 = new go.PathSegment(go.PathSegment.Bezier, p0x, p0y, p2x, p2y, p1x, p1y).close();
    fig.segments.add(seg2);

    var geo = new go.Geometry();
    geo.figures.add(fig);
    geo.normalize();

    return geo;
};