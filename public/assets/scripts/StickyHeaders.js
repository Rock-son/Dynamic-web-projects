import waypoints from "../../node_modules/waypoints/lib/noframework.waypoints";
import classList from "classlist-polyfill";
classList();

class StickyHeader {
    constructor(element, parent) {
        this.siteHeader = element;
        this.headerTriggerElement = parent;
        this.createHeaderWaypoint();
    }

    createHeaderWaypoint() {
        const that = this;
        new Waypoint({
            element: this.headerTriggerElement,
            handler: function(direction) {
                if (direction === "down") {
                    that.siteHeader.classList.add("site-header--dark");
                } else {
                    that.siteHeader.classList.remove("site-header--dark");
                }
            }
        });
    }
}


export default StickyHeader;