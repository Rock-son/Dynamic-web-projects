"use strict"
import waypoints from "../../node_modules/waypoints/lib/noframework.waypoints";
import smoothScroll from "jquery-smooth-scroll";
import classList from "classlist-polyfill";
classList();



class StickyHeader {

    constructor(element, parent) {
        this.pageSections = document.getElementsByTagName("section");
        this.headerLinks = document.getElementsByClassName("nav-headers");
        this.siteHeader = element;
        this.headerTriggerElement = parent;
        this.createHeaderWaypoint();
        this.createPageSectionWaypoints();
        this.addSmoothScrolling();
    }

    addSmoothScrolling() {
        this.headerLinks.smoothScroll();
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

    createPageSectionWaypoints() {
        
        const that = this;
        this.itemsToReveal.forEach(function(element) {
            const currentPageSection = this;
            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if (direction === "down") {
                        const matchingHeaderLink = currentPageSection.getAttribute("data-matching-link");
                        that.headerLinks.classList.remove("is-current-link");
                        document.getElementById(matchingHeaderLink).classList.add("is-current-link");
                    }
                },
                offset: "18%"
            });
            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if (direction === "up") {
                        const matchingHeaderLink = currentPageSection.getAttribute("data-matching-link");
                        that.headerLinks.classList.remove("is-current-link");
                        document.getElementById(matchingHeaderLink).classList.add("is-current-link");
                    }
                },
                offset: "-40%"
            });

        });
    }
}


export default StickyHeader;