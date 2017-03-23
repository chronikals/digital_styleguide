"use strict";
var utils = {
    "objectSize": function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },
    "removeClass": function (selector, className) {
        var elems = document.querySelectorAll(selector);

        [].forEach.call(elems, function (el) {
            el.classList.remove(className);
        });
    },
    "_isInternetExplorer": function () {
        var currentPosition = document.documentElement.scrollTop;
        //set value for test browser
        document.documentElement.scrollTop = 1;
        //if browser is IE then carousel value is set to 1 otherwise ex. chrome it is still 0
        var isIE = document.documentElement.scrollTop === 1;

        if (isIE) document.documentElement.scrollTop = currentPosition;
        return isIE;
    },
    "_scrollToElement": function (to, duration) {
        var element = document.body;

        if (utils._isInternetExplorer()) {
            element = document.documentElement;
        }

        if (duration <= 0) return;
        var from = element.scrollTop,
            difference = to - from,
            perTick = difference / duration * 10;

        setTimeout(function () {
            element.scrollTop = to;
        }, duration);
        duration = duration - 10;

        while (duration > 0) {
            setTimeout(function () {
                element.scrollTop += perTick;
            }, duration);
            duration = duration - 10;
        }
    },
    "smoothScroll": function (element, pageScrollOffset, pageScrollDuration) {
        if (element) {
            var targetElement = document.querySelector(element);
            if (targetElement) {
                var destination;
                if (isNaN(Number(pageScrollOffset))) {
                    destination = targetElement.offsetTop - document.querySelector(pageScrollOffset).offsetHeight;
                } else {
                    destination = targetElement.offsetTop - pageScrollOffset;
                }
                utils._scrollToElement(destination, pageScrollDuration);
            }
        }
    }
};

var brandGuidelineTables = {
    "setDataAttr": function () {
        var tableHeader = document.querySelectorAll(".BrandGuidelineTable th");
        var tableHeaderMobile = document.querySelectorAll(".BrandGuidelineTable tr");
        for (var i = 0; i < tableHeaderMobile.length; i++) {
            var tableRows = tableHeaderMobile[i].children;
            for (var j = 0; j < tableRows.length; j++) {
                var tableHeaderVal = tableHeader[j].innerHTML;
                tableRows[j].setAttribute("data-header", tableHeaderVal);
            }
        }
    }
};

var brandGuidelineChapterList = {
    "getList": function (selector) {
        var list = document.getElementsByClassName(selector);
        return list
    },
    "addAnchor": function (href, text) {
        var anchorDomElem = document.createElement("a");
        anchorDomElem.setAttribute("href", href);
        anchorDomElem.innerHTML = text;
        anchorDomElem.addEventListener("click", function (event) {
            event.preventDefault();
            utils.smoothScroll(href, 5, 500);
        });
        return anchorDomElem;
    },
    "generateList": function (selector) {
        var chapterList = brandGuidelineChapterList.getList(selector);
        if (chapterList) {
            var listDomElem = document.createElement("ul");
            for (var i = 0; i < chapterList.length; i++) {
                chapterList[i].setAttribute("id", selector + i);
                var listItemDomElem = document.createElement("li");
                listItemDomElem.appendChild(brandGuidelineChapterList.addAnchor("#" + selector + i, chapterList[i].innerText));
                listDomElem.appendChild(listItemDomElem);
            }
            return listDomElem;
        }
    },
    "displayList": function (inputSelector, outputSelector) {
        var displayList = document.getElementsByClassName(outputSelector);

        if (displayList.length > 0) {
            for (var i = 0; i < displayList.length; i++) {
                var list = brandGuidelineChapterList.generateList(inputSelector);
                displayList.item(i).appendChild(list);
            }
        }
    }
};

var resources = {
    "config": {
        "userSelectedValues": {},
        "filteredDownloadElementObj": {},
        "downloadElementObj": {},
        "downloadButtonClass": "BrandGuidelineResourceFinder-downloadButton",
        "downloadButtonClassHidden": "BrandGuidelineResourceFinder-downloadButton--hidden",
        "selectClass": "BrandGuidelineResourceFinder-select",
        "optionsClass": "BrandGuidelineResourceFinder-options",
        "labelClass": "BrandGuidelineResourceFinder-label",
        "downloadLinkId": "downloadLinkId"
    },
    init: function(object, displayElemId){
        resources.getOptionsLists(object, displayElemId)
    },
    "closeDropdowns": function () {
        var elems = document.querySelectorAll("." + resources.config.selectClass);

        [].forEach.call(elems, function (el) {
            el.setAttribute("data-open", "close");
            el.setAttribute("class", resources.config.selectClass + " close");
        });
    },
    "toggleDropdown": function (dropdown, state) {
        dropdown.setAttribute("class", resources.config.selectClass + " " + state);
        dropdown.setAttribute("data-open", state);
    },
    "generateLabel": function (key) {
        var label = document.createElement("label");
        label.innerHTML = key;
        label.setAttribute("for", key);
        label.setAttribute("class", resources.config.labelClass);
        return label;
    },
    "generateList": function (list, key, downloadElementObj) {
        var div = document.createElement("div");
        div.setAttribute("class", resources.config.optionsClass);
        var select = document.createElement("ul");
        select.setAttribute("name", key);
        resources.toggleDropdown(select, "close");
        var itemIndex = 0;
        for (var listElement in list) {
            select.appendChild(resources.generateItem(listElement, key, itemIndex, downloadElementObj));
            itemIndex = 1;
        }

        div.appendChild(select);

        return div;
    },
    "generateItem": function (item, key, itemIndex, downloadElementObj) {
        var option = document.createElement("li");
        if (resources.config.userSelectedValues[key] == item) {
            option.setAttribute("class", "selected");
        }
        option.addEventListener("click", function (event) {
            var dropDownList = event.target.parentElement;
            if (dropDownList.getAttribute("data-open") != "open") {
                resources.closeDropdowns();
                resources.toggleDropdown(dropDownList, "open");
            } else {
                resources.toggleDropdown(dropDownList, "close");
                utils.removeClass("[name='" + key + "']." + resources.config.selectClass + " .selected", "selected");
                event.target.setAttribute("class", "selected");
                resources.config.userSelectedValues[key] = option.innerHTML;
                resources.filterUrls(downloadElementObj);
            }
        });

        option.innerHTML = item;
        return option;
    },
    "generateDownloadLink": function (link, displayElemId) {
        var linkButton = document.getElementById(resources.config.downloadLinkId);
        if (!linkButton) {
            var display = document.getElementById(displayElemId);
            var href = document.createElement("a");
            href.setAttribute("class", resources.config.downloadButtonClass);
            href.setAttribute("id", resources.config.downloadLinkId);
            href.setAttribute("href", link);
            href.setAttribute("target", "_blank");
            href.innerHTML = "Download";
            display.appendChild(href);
        } else {
            linkButton.setAttribute("href", link);
            linkButton.setAttribute("class", resources.config.downloadButtonClass);
        }

    },
    "getOptionsLists": function (object, displayElemId) {
        var uniqRols = {};
        for (var file in object) {
            var roles = object[file].selectedValues;
            if (utils.objectSize(resources.config.userSelectedValues) == 0) {
                for (var values in roles) {
                    resources.config.userSelectedValues[values] = roles[values];
                }
            }
            for (var key in roles) {
                if (!uniqRols[key]) {
                    uniqRols[key] = {};
                }
                uniqRols[key][roles[key]] = 1;
            }
        }
        var display = document.getElementById(displayElemId);
        display.innerHTML = "";
        for (var role in uniqRols) {
            display.appendChild(resources.generateLabel(role));
            display.appendChild(resources.generateList(uniqRols[role], role, object));
        }
        resources.filterUrls(object, displayElemId);
    },
    "filterUrls": function (downloadList, displayElemId) {
        if (utils.objectSize(downloadList)) {
            resources.config.filteredDownloadElementObj = {};
            var downloadUrl = "";
            for (var file in downloadList) {
                var roles = downloadList[file].selectedValues;
                var controlSum = 0;
                for (var userKeys in resources.config.userSelectedValues) {
                    if (roles[userKeys] == resources.config.userSelectedValues[userKeys]) {
                        controlSum++;
                    }
                }
                if (controlSum == utils.objectSize(resources.config.userSelectedValues)) {
                    downloadUrl = file;
                }
            }
            if (downloadUrl) {
                resources.generateDownloadLink(downloadUrl, displayElemId);
            } else {
                var linkButton = document.getElementById(resources.config.downloadLinkId);
                if(linkButton){
                    linkButton.setAttribute("class", resources.config.downloadButtonClassHidden);
                }
            }
        }
    }
};

if (window.jQuery) {
    (function ($, document) {
        'use strict';

        var sufix = 'BrandGuideline';
        var base = sufix + 'Slider';
        var action = '__action';
        var panel = '-panel';
        var item = '-item';
        var copies = 3;

        var selector = {
            base: '.' + base,
            panel: '.' + base + panel,

            item: '.' + base + panel + item,
            action: {
                previous: '.' + base + action + '--previous',
                next: '.' + base + action + '--next'
            }
        };

        var state = {
            // transparent: base + '--transparent',
            panel: {
                animated: base + panel + '--animated',
                previous: base + panel + '--previous',
                next: base + panel + '--next'
            },
            item: {
                copied: base + panel + item + '--copied',
                current: base + panel + item + '--current',
                overflow: base + panel + item + '--overflow'
            }
        };

        function normalize(id) {
            return $.map(id.split('-'), function (value, index) {
                if (index > 0) {
                    value = value.substring(0, 1).toUpperCase() + value.substring(1);
                }
                return value;
            })
                .join('');
        }

        var data = {
            selected: {
                selector: normalize(base + '-selected-selector'),
                switch: normalize(base + '-selected-switch')
            }
        };

        function copyOfItem(slider, item) {
            var clone = item.clone(true);
            clone.addClass(state.item.copied);

            var content = clone.find(slider.data(data.selected.selector))
                .first();
            if (content.length > 0) {
                content.removeClass(slider.data(data.selected.switch));
            }

            return clone;
        }

        function shift(slider, panel, previous, shift, copies) {
            var items = panel.find(selector.item);
            var item = items.slice(previous + copies)
                .first();
            var selected = item.find(slider.data(data.selected.selector))
                .first();

            item.removeClass(state.item.current);
            if (selected.length > 0) {
                selected.removeClass(slider.data(data.selected.switch));
            }

            var size = items.length - 2 * copies;
            var current = previous + shift;

            if (current >= size) {
                current = 0;
            } else if (current < 0) {
                current = size - 1;
            }

            setTimeout(function () {
                var item = items.slice(current + copies)
                    .first();
                var selected = item.find(slider.data(data.selected.selector))
                    .first();

                item.addClass(state.item.current);
                if (selected.length > 0) {
                    selected.addClass(slider.data(data.selected.switch));
                }

                items.slice(0, current)
                    .addClass(state.item.overflow);
                items.slice(current)
                    .removeClass(state.item.overflow);

                panel.removeClass(state.panel.animated)
                    .removeClass(state.panel.next)
                    .removeClass(state.panel.previous);
            }, 500);

            return current;
        }

        function init() {
            var sliders = $(selector.base);

            sliders.each(function (index, item) {
                var slider = $(item);
                var panel = slider.find(selector.panel)
                    .first();
                var items = panel.find(selector.item);
                var current = 0;


                var previous = items
                    .slice(-copies)
                    .map(function (index, item) {
                        return copyOfItem(slider, $(item));
                    });
                panel.prepend(previous.get());

                var next = items
                    .slice(0, copies)
                    .map(function (index, item) {
                        return copyOfItem(slider, $(item));
                    });
                panel.append(next.get());

                slider.find(selector.action.previous)
                    .on('click', function (e) {
                        e.preventDefault();
                        if (panel.hasClass(state.panel.animated)) return;

                        panel.addClass(state.panel.animated);
                        panel.addClass(state.panel.previous);

                        current = shift(slider, panel, current, -1, copies);
                    });
                slider.find(selector.action.next)
                    .on('click', function (e) {
                        e.preventDefault();
                        if (panel.hasClass(state.panel.animated)) return;

                        panel.addClass(state.panel.animated);
                        panel.addClass(state.panel.next);

                        current = shift(slider, panel, current, 1, copies);
                    });
            });
        }

        if (document.readyState == 'loading') {
            $(init);
        } else {
            init();
        }
    }(jQuery, document));
}
var carousel = {
    showItems: {},
    count: {
        withDuplicated: {},
        withoutDuplicated: {}
    },
    activeIndex: {},
    fullWidth: {},
    transitionTime: "0.75s",
    showNav: true,
    showDots: true,
    responsiveTable: [[300, 1], [600, 1], [1000, 1]],
    moveBy: 1,
    position: 0,
    transition: "none",
    class: {
        item: ".BrandGuidelineCarousel-item",
        wrapper: ".BrandGuidelineCarousel-stage",
        dots: ".BrandGuidelineCarousel-dots"
    },

    init: function (_el) {
        //TODO read configuration fronm data attr
        var carouselWidth = $("#" + _el).innerWidth();
        carousel.transition = "none";
        carousel.fullWidth[_el] = carouselWidth;
        carousel.showItems[_el] = carousel.getCountFromResponsiveTable(carouselWidth);

        carousel.count.withoutDuplicated[_el] = $("#" + _el).find(carousel.class.item).length;
        carousel.duplicate(_el);
        carousel.count.withDuplicated[_el] = $("#" + _el).find(carousel.class.item).length;

        carousel.activeIndex[_el] = carousel.showItems[_el];

        var resizeTimer;

        $(window).resize(function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                carousel.transition = "none";
                carousel.fullWidth[_el] = $("#" + _el).innerWidth();
                carousel.showItems[_el] = carousel.getCountFromResponsiveTable(carousel.fullWidth[_el]);
                carousel.styleCarousel(_el);
            }, 250);
        });

        carousel.styleCarousel(_el);
        carousel.bindNavigation(_el);
        carousel.renderDots(_el);
        carousel.styleDots(_el);
        carousel.transition = "1s";
    },

    bindNavigation: function (_el) {
        $("#" + _el).find(".prev").on("click", function () {
            carousel.setActivIndex(-1, _el);
        });
        $("#" + _el).find(".next").on("click", function () {
            carousel.setActivIndex(+1, _el);
        });
    },

    renderDots: function (_el) {
        var pages = carousel.getPages(_el);
        for (var page = 0; page < pages.length; page++) {
            pages[page];
            $("#" + _el).find(carousel.class.dots)
                .append($("<span data-page-index='" + pages[page] + "'></span>"))
        }
        $("#" + _el).find(carousel.class.dots + " span").on("click", function (event) {
            carousel.jumpToIndex(event.target.getAttribute("data-page-index"), _el);
        });
    },

    styleDots: function (_el) {
        $("#" + _el).find(carousel.class.dots + " span").each(function (index, element) {
                $(this).removeClass("active");
                if (carousel.isCurrentPage(parseInt(element.getAttribute("data-page-index")), _el)) {
                    $(this).addClass("active");
                }
            }
        )
    },

    styleCarousel: function (_el) {
        $("#" + _el).find(carousel.class.item).each(function (index) {
            $(this).css(carousel.itemStyles(_el));
            $(this).removeClass("active");
            if (carousel.getActivIndex(index, _el)) {
                $(this).addClass("active");
            }
        });

        $("#" + _el).find(carousel.class.wrapper).css(carousel.listStyles(_el));
        carousel.styleDots(_el);
    },

    itemStyles: function (_el, clear) {
        if(!clear){}
        return {'width': Math.floor(carousel.fullWidth[_el] / carousel.showItems[_el]) + 'px'};
    },

    listStyles: function (_el) {
        var position = -carousel.activeIndex[_el] * Math.floor(carousel.fullWidth[_el] / carousel.showItems[_el]);
        return {
            'transform': 'translate3d(' + position + 'px, 0px, 0px)',
            'width': Math.floor(carousel.fullWidth[_el] * carousel.count.withDuplicated[_el]) + 'px',
            'transition': carousel.transition
        };
    },

    getCountFromResponsiveTable: function (width) {
        var tempCount;
        for (var t in carousel.responsiveTable) {
            if (width > carousel.responsiveTable[t][0] && carousel.responsiveTable[t][1] > 0) {
                tempCount = carousel.responsiveTable[t][1];
            }
        }
        return tempCount;
    },

    duplicate: function (_el) {
        var objToClone = $("#" + _el + " " + carousel.class.wrapper + " " + carousel.class.item);
        objToClone.each(function (index) {
            if (index < carousel.showItems[_el]) {
                $(this).clone().appendTo("#" + _el + " " + carousel.class.wrapper);
            }
        });
        $(objToClone.get().reverse()).each(function (index) {
            if (index < carousel.showItems[_el]) {
                $(this).clone().prependTo("#" + _el + " " + carousel.class.wrapper);
            }
        });
    },

    getActivIndex: function (index, _el) {
        return !!(carousel.activeIndex[_el] <= index && index < carousel.activeIndex[_el] + carousel.showItems[_el]);
    },

    isCurrentPage: function (dot, _el) {
        if (carousel.activeIndex[_el] < carousel.showItems[_el]) {
            return (carousel.activeIndex[_el] + carousel.count.withoutDuplicated >= dot && carousel.activeIndex[_el] + carousel.count.withoutDuplicated < dot + carousel.showItems);
        } else if (carousel.activeIndex[_el] == carousel.showItems[_el] + carousel.count.withoutDuplicated[_el]) {
            return dot === carousel.showItems
        }
        else {
            return (carousel.activeIndex[_el] >= dot && carousel.activeIndex[_el] < dot + carousel.showItems[_el]);
        }
    },

    getPages: function (_el) {
        var countIndex = 0;
        var pagesIndexes = [];
        while (countIndex * carousel.showItems[_el] < carousel.count.withoutDuplicated[_el]) {
            countIndex++;
            pagesIndexes.push(countIndex * carousel.showItems[_el]);
        }
        return pagesIndexes;
    },

    setActivIndex: function (direction, _el) {
        var nextIndex = carousel.activeIndex[_el] + (carousel.moveBy * direction);
        carousel.transition = "none";
        if (nextIndex > carousel.count.withoutDuplicated[_el]) {
            carousel.activeIndex[_el] = 0;
            carousel.styleCarousel(_el);
        } else if (nextIndex < carousel.showItems[_el]) {
            carousel.activeIndex[_el] = carousel.count.withoutDuplicated[_el] + carousel.showItems[_el];
            carousel.styleCarousel(_el);
        }
        setTimeout(function () {
            carousel.transition = carousel.transitionTime;
            carousel.activeIndex[_el] += (carousel.moveBy * direction);
            carousel.styleCarousel(_el)
        }, 10);

    },

    jumpToIndex: function (index, _el) {
        carousel.transition = carousel.transitionTime;
        carousel.activeIndex[_el] = parseInt(index);
        carousel.styleCarousel(_el)
    }
};

document.addEventListener("DOMContentLoaded", function (event) {
    brandGuidelineChapterList.displayList("BrandGuidelineChapterHeader-title", "displayChapterListHere");
    brandGuidelineTables.setDataAttr();
});