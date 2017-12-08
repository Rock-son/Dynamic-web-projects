import waypoints from "../../node_modules/waypoints/lib/noframework.waypoints";
import classList from "classlist-polyfill";
classList();


class RevealOnScroll {
    constructor(items, offset) {
        this.itemsToReveal = items;
        this.offsetPercentage = offset;
        this.hideInitially();
        this.createWaypoints();
    }

    hideInitially() {
        this.itemsToReveal.classList.add("reveal-item");
    }

    createWaypoints() {
        const self = this;
        this.itemsToReveal.forEach(function(element) {
            const currentItem = this;
            new Waypoint({
                element: currentItem,
                handler: function() {
                    currentItem.classList.add("reveal-item--is-visible");
                },
                offset: self.offsetPercentage
            });
        });
    }
}

export default RevealOnScroll;