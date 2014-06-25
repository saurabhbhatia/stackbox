/* global jQuery */
(function modalBox($, window) {

    'use strict';

    var modalBoxCounter = 0,
        modalBoxGroup = 0,
        modalBoxElements = [],
        domElements = [],
        minMarginLeft = 20,
        minMarginRight = 30,
        minMarginTop = 10,
        defaultModalClass = 'modal',
        defaultWrapperClass = 'modal-wrapper',
        css3animsupported = false;

    function returnFunction(fn) {

        var ns;

        if (typeof fn === 'string') {

            if ($.fn.modalBox.globalSettings && typeof $.fn.modalBox.globalSettings.NAMESPACE === 'string') {

                ns = $.fn.modalBox.globalSettings.NAMESPACE;

                if (window[ns] && $.isFunction(window[ns][fn])) {
                    return window[ns][fn];
                }
            }

            if ($.isFunction(window[fn])) {
                return window[fn];
            }
        }

        if ($.isFunction(fn)) {
            return fn;
        }

        return function notFound() {
            console.warn('Function not found', fn);
        };
    }

    function modalOpenTrigger(event) {

        /*jshint validthis:true */

        event.preventDefault();
        $(this).addClass('active').modalBox();
    }

    function escapeKeyClick(event) {
        if (event.keyCode === 27) {
            closeTopmostModal();
            event.preventDefault();
        }
    }

    function closeTopmostModal() {
        var modalBoxInstance = modalBoxElements[modalBoxElements.length - 1];
        if (modalBoxInstance) {
            modalBoxInstance.exitModal();
        }
    }

    function closeModalContainingElement($element) {

        var $targetModalBox = $element.parents('.modal'),
            targetIndex,
            modalBoxInstance,
            i;

        if ($targetModalBox.length) {

            targetIndex = $targetModalBox.data('modalBoxIndex');

            for (i = modalBoxElements.length - 1; i >= 0; i--) {
                if (i >= targetIndex) {
                    modalBoxInstance = modalBoxElements[i];
                    if (modalBoxInstance) {
                        modalBoxInstance.exitModal(true);
                    }
                }
            }
        }
    }

    function modalMousedown(event) {

        var element = event.target,
            $element = $(element),
            modalBoxInstance,
            targetIndex,
            targetGroup,
            currentGroup,
            i,
            clickedVScrollBar,
            clickedHScrollBar,
            $window = $(window),
            closeThese = [],
            modalClass = defaultModalClass,
            wrapperClass = defaultWrapperClass;

        if (event.which !== 1) {
            return false;
        }

        if ($.fn.modalBox.globalSettings && $.fn.modalBox.globalSettings.modalclass) {
            modalClass = $.fn.modalBox.globalSettings.modalclass;
        }
        if ($.fn.modalBox.globalSettings && $.fn.modalBox.globalSettings.wrapperclass) {
            wrapperClass = $.fn.modalBox.globalSettings.wrapperclass;
        }

        while (element && element !== document.body && element !== document) {
            $element = $(element);

            if ($element.data('closeModal') === true) { // Click on close-modal=true is handled in modal#closeModalClick
                return false;
            }

            if ($element.hasClass(modalClass)) { // Clicked inside of modal, close all modals stacked on top of this one.
                targetIndex = $element.data('modalBoxIndex');

                for (i = modalBoxElements.length - 1; i >= 0; i--) {
                    if (i > targetIndex) {
                        modalBoxInstance = modalBoxElements[i];
                        if (modalBoxInstance) {
                            modalBoxInstance.exitModal(true);
                        }
                    }
                }

                return true; // Let event bubble up

            } else {
                element = element.parentNode;
            }
        }

        // Detect mousedown on scrollbars
        $element = $(event.target);

        clickedVScrollBar = (($window.outerWidth() - event.clientX) < ($element[0].offsetWidth - $element[0].clientWidth));
        clickedHScrollBar = (($window.outerHeight() - event.clientY) < ($element[0].offsetHeight - $element[0].clientHeight));

        if (clickedVScrollBar || clickedHScrollBar) {
            return false;
        }

        if (modalBoxElements.length === 1) {
            // Clicked somewhere in the document (through wrapper)
            modalBoxInstance = modalBoxElements[0];
            if (modalBoxInstance) {
                if (modalBoxInstance.$wrapper[0].style.pointerEvents === 'none') {
                    // Only one modal (with offspring) open. Close it.
                    modalBoxInstance.exitModal(true);
                    return true; // Let event bubble up
                }
            }
        }

        // Clicked outside of modal, i.e. on wrapper.
        targetGroup = $element.data('modalBoxGroup');
        if (targetGroup) {
            for (i = modalBoxElements.length - 1; i >= 0; i--) {
                modalBoxInstance = modalBoxElements[i];
                if (modalBoxInstance) {
                    currentGroup = modalBoxInstance.$modalbox.data('modalBoxGroup');
                    if (currentGroup === targetGroup) {
                        closeThese.push(modalBoxInstance);
                    }
                }
            }

            if (closeThese.length) {
                if (closeThese.length === 1 && closeThese[0].options.closeonbackdrop === true) {
                    // Last one in group, close it.
                    closeThese[0].exitModal(true);
                } else {
                    // Close all but the lowest modal in group.
                    for (i = 0; i < closeThese.length - 1; i++) {
                        if (closeThese[i].options.closeonbackdrop === true) {
                            closeThese[i].exitModal(true);
                        }
                    }
                }
            }
        } else {
            // All modals are 'drop downs' (i.e. none of them have backdrop), contained in a single wrapper. Close them all.
            for (i = modalBoxElements.length - 1; i >= 0; i--) {
                modalBoxInstance = modalBoxElements[i];
                if (modalBoxInstance) {
                    modalBoxInstance.exitModal(true);
                }
            }
        }
    }

    function windowResize() {

        var modalBoxInstance,
            i;

        for (i = 0; i < modalBoxCounter; i++) {
            modalBoxInstance = modalBoxElements[i];
            if (modalBoxInstance) {
                modalBoxInstance.updatePosition(modalBoxInstance);
            }
        }
    }

    function windowScroll() {
        windowResize();
    }

    var modalBoxPrototype = {

        init: function(options, parentElement) {

            var href,
                animDone;

            this.options = $.extend({}, $.fn.modalBox.settings, options, $.fn.modalBox.globalSettings);

            if (this.options.position === 'fixed') {
                this.options.position = 'absolute';
            }

            this.loadable = false;

            if (this.options.nextto !== null) {
                this.$offspring = $(this.options.nextto);
            } else {
                if (parentElement !== undefined) {
                    this.$offspring = $(parentElement);
                } else {
                    this.options.position = 'absolute';
                }
            }

            if (this.options.backdrop === 'auto') {
                if (this.options.position === 'absolute') {
                    this.options.backdrop = true;
                } else {
                    this.options.backdrop = false;
                }
            }

            this.createElements();

            href = $(parentElement).attr('href');
            if (this.options.content === false && href) {
                this.options.content = href;
            }

            this.addContent();

            if (this.loadable !== true) { // If loadable, created in loadAjax()
                this.createCloseButton();
            }

            this.createArrow();

            this.addEventListeners();

            this.created = true;

            returnFunction(this.options.beforeopen)(this.$offspring, this);
            $(document).trigger('beforeopen.modalBox', [this.$offspring, this]);

            if (this.loadable === true) {
                this.loadAjax(this.options.content);
            } else {

                this.afterOpen(true);

                animDone = function animDone() {
                    this.$modalbox.removeClass('animated ' + this.options.animopen);
                }.bind(this);

                if (css3animsupported) {
                    this.$modalbox.addClass('animated ' + this.options.animopen).on('animationend webkitAnimationEnd MSAnimationEnd', animDone);
                } else {
                    animDone();
                }
            }
        },

        afterOpen: function(updatePosition) {

            if (updatePosition === true) {
                this.updatePosition();
            }

            this.autoScroll();

            returnFunction(this.options.afteropen)(this.$modalbox, this.$offspring, this);
            $(document).trigger('afteropen.modalBox', [this.$modalbox, this.$offspring, this]);
        },

        createArrow: function() {

            if (this.$offspring === undefined || this.options.position === 'absolute') {
                this.$arrow = false;
                return;
            }

            $('<div class="modal-arrow"></div>').appendTo(this.$modalbox);
            this.$arrow = this.$modalbox.find('.modal-arrow');
            this.arrowWidth = this.$arrow.outerWidth();
            this.arrowHeight = this.$arrow.outerHeight();
        },

        createCloseButton: function() {

            if (this.options.closebutton === true) {
                this.$closeButton = $('<div class="modal-close" data-close-modal="true"><button type="button" class="close"><i class="' + this.options.closebuttonclass + '"></i></button></div>');
                this.$modalbox.prepend(this.$closeButton);
            }
        },

        createElements: function() {

            var $parent,
                modalBoxIndex,
                newModalGroup,
                modalBoxCss = {
                    display: 'block'
                },
                wrapperClass = defaultWrapperClass,
                modalClass = defaultModalClass,
                mainWrapperClass = this.options.mainwrapperclass,
                mainWrapperExtraClass = '';

            if ($.fn.modalBox.globalSettings && $.fn.modalBox.globalSettings.modalclass) {
                modalClass = $.fn.modalBox.globalSettings.modalclass;
            }

            if (this.$offspring) {
                $parent = this.$offspring.parents('.' + modalClass);
            }

            if ($.fn.modalBox.globalSettings && $.fn.modalBox.globalSettings.mainwrapperclass) {
                mainWrapperClass = $.fn.modalBox.globalSettings.mainwrapperclass;
                if ($.fn.modalBox.globalSettings.mainwrapperextraclass) {
                    mainWrapperExtraClass += ' ' + $.fn.modalBox.globalSettings.mainwrapperextraclass;
                }
            }

            if (modalBoxCounter === 1) {
                this.$wrapperWrapper = $('<div></div>').addClass(mainWrapperClass + mainWrapperExtraClass).appendTo($(document.body));
            } else if ($parent) {
                this.$wrapperWrapper = $parent.parents('.' + mainWrapperClass);
            }

            if (modalBoxCounter === 1 || this.options.backdrop === true) {

                this.$wrapper = $('<div></div>')
                    .addClass(wrapperClass)
                    .css('z-index', 9900 + modalBoxCounter)
                    .appendTo(this.$wrapperWrapper);

                if (modalBoxCounter === 1 && this.options.backdrop !== true) {
                    this.$wrapper.css({
                        'overflow': 'hidden',
                        'pointer-events': 'none'
                    });
                }

                modalBoxGroup++;
                this.$wrapper.data('modalBoxGroup', modalBoxGroup);
                $(document).off('mousedown.modalBox').on('mousedown.modalBox', modalMousedown);

            } else if ($parent) {
                this.$wrapper = $parent.parent();
            }

            this.hadNoScroll = $('html').hasClass(this.options.noscrollclass);

            if (this.options.backdrop === true) {
                this.$wrapper.addClass('modal-backdrop');
            }

            if (this.options.position === 'absolute') {
                $('html').addClass(this.options.noscrollclass);
            }

            if (this.options.width === 'auto') {
                modalBoxCss.width = 'auto';
            }

            // Create the modalbox element.
            this.$modalbox = $('<div></div>')
                .addClass(modalClass)
                .css(modalBoxCss)
                .appendTo(this.$wrapper);

            if (this.options.closeonbackdrop === true) {
                this.$wrapper.addClass('modal-close-on-backdrop');
            } else {
                this.$wrapper.removeClass('modal-close-on-backdrop');
            }

            modalBoxIndex = (modalBoxCounter - 1);
            this.modalBoxIndex = modalBoxIndex;
            this.$modalbox.data('modalBoxIndex', modalBoxIndex);

            newModalGroup = this.$wrapper.data('modalBoxGroup');
            this.modalBoxGroup = newModalGroup;
            this.$modalbox.data('modalBoxGroup', newModalGroup);
        },

        addEventListeners: function() {

            this.$modalbox.on('click', '[data-close-modal="true"]', {
                modalbox: this.$modalbox
            }, this.closeModalClick);
        },

        closeModalClick: function(event) {
            var modalBoxInstance,
                $modalbox = event.data.modalbox,
                targetIndex = $modalbox.data('modalBoxIndex'),
                i,
                $this = $(this);

            event.preventDefault();
            event.stopPropagation(); // Stop event from bubbling up to document click listener (handled by modalOpenTrigger).

            for (i = modalBoxCounter - 1; i >= 0; i--) {
                if (i >= targetIndex) {
                    modalBoxInstance = modalBoxElements[i];
                    if (modalBoxInstance) {
                        if ($this.data('modal') === true) {
                            modalBoxInstance.exitModal(false, function onClosed() {
                                $this.modalBox();
                            });
                        } else {
                            modalBoxInstance.exitModal();
                        }
                    }
                }
            }
        },

        loadAjax: function(options) {

            var ajaxDone,
                ajaxFail,
                ajaxAlways,
                animDone;

            if (typeof options === 'string') {
                options = {
                    url: options,
                    dataType: 'html',
                    type: this.options.type
                };
            }

            // Display the loading spinner as modal content.
            if (this.$arrow) {
                this.$arrow = this.$modalbox.find('.modal-arrow').detach();
            }

            this.$modalbox.html('<div style="padding: 40px; text-align: center;"><div class="' + this.options.spinnerclass + '"></div></div>');

            if (this.$arrow) {
                this.$arrow.appendTo(this.$modalbox);
            }

            this.updatePosition();

            if (this.options.params !== null) {
                if (typeof this.options.params === 'string') {
                    options.data = $.parseJSON(this.options.params.replace(/'/g, '"'));
                } else if (typeof this.options.params === 'object') {
                    options.data = this.options.params;
                }
            }

            if (this.$arrow) {
                this.arrowPosition();
            }

            this.ajaxRequest = $.ajax(options);

            ajaxDone = function ajaxDone(data) {

                this.$modalbox.hide();
                this.$modalbox.html(data);

                if (this.$arrow) {
                    this.$arrow.appendTo(this.$modalbox);
                }
            }.bind(this);

            ajaxFail = function ajaxFail(jqXHR, textStatus) {
                var htmlMessage,
                    messengerMessage = this.options.msg_ajaxfailed;

                if (jqXHR && jqXHR.responseText && jqXHR.responseText.length > 0) {
                    htmlMessage = jqXHR.responseText;
                } else {
                    htmlMessage = this.options.msg_ajaxfailed;
                }

                if (options && options.url) {
                    messengerMessage += ' Url: ' + options.url;
                }

                if (textStatus !== 'abort') {
                    console.warn(messengerMessage);
                    returnFunction(this.options.onerror)(this, jqXHR, textStatus);
                    this.$modalbox.trigger('onError.modalBox', [this, jqXHR, textStatus]);
                }

                this.$modalbox.html('<div style="padding: 10px;">' + htmlMessage + '</div>');
            }.bind(this);

            ajaxAlways = function ajaxAlways() {

                this.createCloseButton();

                // <- Don't ask...
                this.updatePosition(); // 1
                this.updatePosition(); // 2
                // ->

                animDone = function animDone() {

                    this.$modalbox.removeClass('animated ' + this.options.animopen);
                    this.afterOpen();

                }.bind(this);

                if (css3animsupported) {
                    this.$modalbox.show(0).addClass('animated ' + this.options.animopen).on('animationend webkitAnimationEnd MSAnimationEnd', animDone);
                } else {
                    this.$modalbox.fadeIn(200, function fadeInDone() {
                        animDone();
                    });
                }

            }.bind(this);

            this.ajaxRequest.fail(ajaxFail);
            this.ajaxRequest.done(ajaxDone);
            this.ajaxRequest.always(ajaxAlways);
        },

        addContent: function() {

            var content = this.options.content,
                $newContent,
                isHttp = (content.match(/^https?:\/\//) || content.charAt(0) === '/');

            if (content.charAt(0) === '#') { // 'content' is a jQuery id, so use it to fetch the real content from the DOM.

                $newContent = $(content);

                if ($newContent.length > 0) {

                    if (this.options.getchildren) {
                        $newContent = $newContent.children();
                    }

                    if (this.options.clone) {
                        // Clone an element.
                        $newContent.clone(true, true).appendTo(this.$modalbox);
                    } else {
                        // Don't clone, just extract it from the DOM.
                        if (this.options.returncontent) {
                            this.returncontent = $($newContent[0]).parent();
                        }

                        if ($newContent.length === 0) {
                            this.$modalbox.html('<div style="padding: 10px;">No content in element: "' + content + '"</div>');
                        } else {
                            $newContent.appendTo(this.$modalbox);
                        }
                    }

                } else {
                    this.$modalbox.html('<div style="padding: 10px;">Could not find element: "' + content + '"</div>');
                }

            } else if (isHttp) { // Content is an url.

                this.loadable = true;

            } else { // Content is just plain html.

                this.$modalbox.html(content);
            }
        },

        adjustToScroll: function(pos) {

            pos.left -= $(window).scrollLeft();
            pos.left += this.$wrapper.scrollLeft();

            pos.top -= $(window).scrollTop();
            pos.top += this.$wrapper.scrollTop();

            pos.left = Math.round(pos.left);
            pos.top = Math.round(pos.top);

            return pos;
        },

        positionBottom: function(params) {

            var pos = {};

            pos.left = (this.$offspring.offset().left + this.$offspring.outerWidth() / 2) - params.modalWidth / 2;
            pos.top = params.marginY + (this.$offspring.offset().top + this.$offspring.outerHeight());

            this.arrowDirection = 'up';

            return this.adjustToScroll(pos);
        },

        positionTop: function(params) {

            var pos = {};

            pos.left = (this.$offspring.offset().left + this.$offspring.outerWidth() / 2) - params.modalWidth / 2;
            pos.top = -params.marginY + (this.$offspring.offset().top - params.modalHeight);

            this.arrowDirection = 'down';

            return this.adjustToScroll(pos);
        },

        positionLeft: function(params) {

            var pos = {};

            pos.left = this.$offspring.offset().left - params.modalWidth - params.marginX;
            pos.top = this.$offspring.offset().top + (this.$offspring.outerHeight() - params.modalHeight) / 2;

            this.arrowDirection = 'right';

            return this.adjustToScroll(pos);
        },

        positionRight: function(params) {

            var pos = {};

            pos.left = this.$offspring.offset().left + this.$offspring.outerWidth() + params.marginX;
            pos.top = this.$offspring.offset().top + (this.$offspring.outerHeight() - params.modalHeight) / 2;

            this.arrowDirection = 'left';

            return this.adjustToScroll(pos);
        },

        positionAbsolute: function(params) {

            var pos = {},
                $window = $(window);

            pos.left = ($window.width() / 2 - params.modalWidth / 2) + $window.scrollLeft();
            pos.top = ($window.outerHeight() / 2 - params.modalHeight / 2) + $window.scrollTop();

            this.arrowDirection = false;

            return this.adjustToScroll(pos);
        },

        updatePosition: function() {

            var modalWidth,
                modalHeight,
                args,
                method,
                css,
                windowWidth = $(window).width();

            if (!this || !this.options) {
                return false;
            }

            if (this.options.width !== 'auto') {
                modalWidth = this.getModalWidth();

                if (this.options.respectbrowserwidth) {
                    if (windowWidth < modalWidth + minMarginRight) {
                        modalWidth = windowWidth - minMarginRight;
                    }
                }

                this.$modalbox.width(modalWidth);

            } else {
                modalWidth = this.$modalbox.width();
            }

            modalHeight = this.$modalbox.height();

            args = {
                marginX: this.options.margin_x,
                marginY: this.options.margin_y,
                modalWidth: modalWidth,
                modalHeight: modalHeight
            };

            method = 'position' + this.options.position.charAt(0).toUpperCase() + this.options.position.substring(1);

            // Re-select offspring, in case it was just removed from and re-inserted to the dom.
            if (this.$offspring && this.$offspring.selector) {
                this.$offspring = $(this.$offspring.selector);
            }

            if (!this[method]) {
                console.warn('ModalBox: Unknown position method "' + method + '"');
                method = 'positionAbsolute';
            }
            css = this[method](args);
            this.$modalbox.css(css);

            $.extend(args, {
                left: parseInt(this.$modalbox.css('left'), 10),
                top: parseInt(this.$modalbox.css('top'), 10),
                windowWidth: windowWidth,
                windowHeight: $(window).height(),
                width: this.$modalbox.outerWidth(),
                height: this.$modalbox.outerHeight()
            });

            this.adjustToWindow(args);

            if (this.$arrow) {
                this.arrowPosition();
            }
        },

        calcArrowLeft: function() {

            var modalLeft = parseInt(this.$modalbox.css('left'), 10),
                modalWidth = this.$modalbox.outerWidth(),
                offspringLeft = this.$offspring.offset().left,
                offspringWidth = this.$offspring.outerWidth(),
                offspringCenter = offspringLeft + (offspringWidth / 2),
                arrowWidth = this.arrowWidth,
                halfOfArrow = arrowWidth / 2,
                left,
                minLeft = 6,
                maxLeft = modalWidth - arrowWidth - 6;

            left = offspringCenter - modalLeft - halfOfArrow; // Subtracting modalLeft because arrow's 0,0 is the modal's left,top.

            left -= $(window).scrollLeft();
            left += this.$wrapper.scrollLeft();

            if (this.options.position === 'bottom' && this.$closeButton) {
                maxLeft -= (this.$closeButton.outerWidth() - Math.abs(parseInt(this.$closeButton.css('right'), 10)));
            }

            if (left < minLeft) {
                left = minLeft;
            } else if (left > maxLeft) {
                left = maxLeft;
            }

            return left;
        },

        calcArrowTop: function() {

            var modalTop = parseInt(this.$modalbox.css('top'), 10),
                modalHeight = this.$modalbox.outerHeight(),
                offspringTop = this.$offspring.offset().top,
                offspringHeight = this.$offspring.outerHeight(),
                offspringCenter = offspringTop + (offspringHeight / 2),
                arrowHeight = this.arrowHeight,
                halfOfArrow = arrowHeight / 2,
                top,
                minTop = 6,
                maxTop = modalHeight - arrowHeight - 6;

            top = offspringCenter - modalTop - halfOfArrow; // Subtracting modalTop because arrow's 0,0 is the modal's left,top.

            top -= $(window).scrollTop();
            top += this.$wrapper.scrollTop();

            if (top < minTop) {
                top = minTop;
            } else if (top > maxTop) {
                top = maxTop;
            }

            return top;
        },

        arrowPosition: function() {

            var left, top;

            this.$arrow.removeClass('top bottom left right');

            if (this.arrowDirection === 'up') {

                left = this.calcArrowLeft() + (this.arrowWidth / 2);
                top = -(this.arrowHeight / 2);

                this.$arrow.css({
                    'left': Math.round(left),
                    'top': Math.round(top)
                }).addClass('bottom');

            } else if (this.arrowDirection === 'down') {

                left = this.calcArrowLeft() + (this.arrowWidth / 2);
                top = this.$modalbox.height();

                this.$arrow.css({
                    'left': Math.round(left),
                    'top': Math.round(top)
                }).addClass('top');

            } else if (this.arrowDirection === 'right') {

                left = this.$modalbox.width();
                top = this.calcArrowTop() + (this.arrowHeight / 2);

                this.$arrow.css({
                    'left': Math.round(left),
                    'top': Math.round(top)
                }).addClass('left');

            } else if (this.arrowDirection === 'left') {

                left = -(this.arrowWidth - (this.arrowWidth / 2));
                top = this.calcArrowTop() + (this.arrowHeight / 2);

                this.$arrow.css({
                    'left': Math.round(left),
                    'top': Math.round(top)
                }).addClass('right');
            }
        },

        adjustToWindow: function(params) {

            var left, css;

            if (this.options.autoadjust === true) {

                if (this.options.position === 'left' || this.options.position === 'right') {

                    // Make sure the modal is not placed outside of window. If it is, place it below its offspring.
                    if (params.top < minMarginTop || params.left < minMarginLeft || params.left + params.width > params.windowWidth - 10) {

                        css = this.positionBottom(params); // Position below if not room above.
                        this.$modalbox.css(css);
                    }
                } else if (this.options.position === 'absolute') {
                    if (params.top < minMarginTop) {
                        this.$modalbox.css('top', minMarginTop);
                    }
                } else {

                    if (params.top < minMarginTop) {
                        css = this.positionBottom(params); // Position below if not room above.
                        this.$modalbox.css(css);
                    } else if (params.top + params.height + $(window).scrollTop() > $(document).height()) {

                        if (!$('html').hasClass(this.options.noscrollclass)) { // Wrapper can scroll, i.e. there's always room below.
                            css = this.positionTop(params); // Position above if not room below.
                            this.$modalbox.css(css);
                        }
                    }
                }
            }

            if (params.left < minMarginLeft) {
                this.$modalbox.css('left', minMarginLeft);
            } else if (params.left + params.modalWidth > params.windowWidth - minMarginRight) {
                left = Math.max(minMarginLeft, params.windowWidth - minMarginRight - params.modalWidth);
                this.$modalbox.css('left', left);
            }
        },

        getModalWidth: function() {

            var windowWidth = $(window).width(),
                modalWidth = this.options.width;

            if (typeof modalWidth === 'string') {
                modalWidth = windowWidth * parseInt(this.options.width, 10) * 0.01; // Convert % to pixels.
            }

            return Math.max(this.options.minwidth, Math.min(windowWidth - 20, Math.min(Number(this.options.maxwidth), modalWidth)));
        },

        autoScroll: function() {

            if (!this.options.autoscroll || this.options.position === 'absolute') {
                return false; // Abort scroll
            }

            var modalBoxOffsetTop = this.$modalbox.offset().top,
                wrapperScrollTop = this.$wrapper.scrollTop(),
                windowHeight = $(window).height(),
                windowScrollTop = $(window).scrollTop(),
                modalHeight = this.$modalbox.height(),
                padding = 20,
                newScrollTop,
                animOptions = {
                    duration: this.options.scrollspeed,
                    easing: this.options.scrolleasing
                },
                firstModal = modalBoxElements[0],
                shouldScrollBody = false,
                i;

            if (firstModal && firstModal.options.position !== 'absolute') {
                shouldScrollBody = true;
            }

            for (i = 1; i < modalBoxElements.length; i++) {
                if (modalBoxElements[i].options.position === 'absolute') {
                    shouldScrollBody = false;
                }
            }

            if (shouldScrollBody) {

                if (modalBoxOffsetTop < windowScrollTop) { // Top of modal is hidden above the window
                    $('body,html').animate({
                        scrollTop: modalBoxOffsetTop - padding
                    }, animOptions);

                } else if ((modalBoxOffsetTop - windowScrollTop) + modalHeight > windowHeight) { // Bottom of modal is hidden below the window

                    // If the modal box is taller than the window, scroll to its top (with 20px padding above),
                    // otherwise (i.e. the whole modal fits inside the window) scroll to its bottom (with 20px padding below).
                    if (windowHeight < modalHeight) {
                        newScrollTop = modalBoxOffsetTop - padding;
                    } else {
                        newScrollTop = modalBoxOffsetTop + modalHeight - windowHeight + padding;
                    }

                    $('body,html').animate({
                        scrollTop: newScrollTop
                    }, animOptions);
                }

            } else {

                if ((modalBoxOffsetTop + wrapperScrollTop) < windowScrollTop) { // Top of modal is hidden above the window

                    this.$wrapper.animate({
                        scrollTop: modalBoxOffsetTop - padding
                    }, animOptions);

                } else if ((modalBoxOffsetTop - windowScrollTop) + modalHeight > windowHeight) { // Bottom of modal is hidden below the window

                    // If the modal box is taller than the window, scroll to its top (with 20px padding above),
                    // otherwise (i.e. the whole modal fits inside the window) scroll to its bottom (with 20px padding below).

                    if (windowHeight < modalHeight) {
                        newScrollTop = modalBoxOffsetTop - windowScrollTop + wrapperScrollTop - padding;
                    } else {
                        newScrollTop = modalBoxOffsetTop - windowScrollTop + wrapperScrollTop + modalHeight - windowHeight + padding;
                    }

                    this.$wrapper.animate({
                        scrollTop: newScrollTop
                    }, animOptions);
                }
            }
        },

        exitModal: function(instant, onClosed) {

            var animDone,
                nextModal;

            returnFunction(this.options.beforeclose)(this.$modalbox, this.$offspring, this);
            this.$modalbox.trigger('beforeClose.modalBox', [this.$modalbox, this.$offspring, this]);

            if (this.ajaxRequest) {
                this.ajaxRequest.abort();
            }

            if (modalBoxElements.length) {
                nextModal = modalBoxElements[modalBoxElements.length - 2];
                if (nextModal) {
                    if (nextModal.options.closeonbackdrop === true) {
                        nextModal.$wrapper.addClass('modal-close-on-backdrop');
                    } else {
                        nextModal.$wrapper.removeClass('modal-close-on-backdrop');
                    }
                }
            }

            if (modalBoxElements.length) {
                nextModal = modalBoxElements[modalBoxElements.length - 2];
                if (nextModal) {
                    if (nextModal.options.closeonbackdrop === true) {
                        nextModal.$wrapper.addClass('modal-close-on-backdrop');
                    } else {
                        nextModal.$wrapper.removeClass('modal-close-on-backdrop');
                    }
                }
            }

            if (instant !== true && this.options.animclose) {

                animDone = function animDone() {

                    if (this.$offspring) {
                        this.$offspring.removeClass('active');
                    }

                    if ($.isFunction(onClosed)) {
                        this.cleanUp();
                        onClosed.call(this);
                    } else {
                        this.cleanUp();
                    }
                }.bind(this);

                if (css3animsupported) {
                    this.$modalbox.addClass('animated ' + this.options.animclose).on('animationend webkitAnimationEnd MSAnimationEnd', animDone);
                } else {
                    this.$modalbox.fadeOut(200, function fadeOutDone() {
                        animDone();
                    });
                }
            } else {

                this.cleanUp();

                if (this.$offspring) {
                    this.$offspring.removeClass('active');
                }

                if ($.isFunction(onClosed)) {
                    onClosed.call(this);
                }
            }
        },

        cleanUp: function() {

            if (this.$arrow) {
                this.$arrow.remove();
            }

            if (this.$closeButton) {
                this.$closeButton.remove();
            }

            if (this.hadNoScroll === false) {
                $('html').removeClass(this.options.noscrollclass);
            } else {
                $('html').addClass(this.options.noscrollclass);
            }

            modalBoxElements.pop();
            modalBoxCounter = modalBoxElements.length;
            domElements.pop();

            returnFunction(this.options.afterclose)(this.$modalbox, this.$offspring, this);
            this.$modalbox.trigger('afterClose.modalBox', [this.$modalbox, this.$offspring, this]);

            if (this.options.returncontent === true && this.returncontent !== undefined) {
                this.$modalbox.children().appendTo(this.returncontent);
            }

            this.$modalbox.remove();

            if (modalBoxCounter === 0) {
                this.$wrapperWrapper.remove();
            }

            if (this.$wrapper.children().length === 0) {
                this.$wrapper.remove();
                modalBoxGroup--;
            }
        },

        toString: function() {
            if (this.created === true) {
                return 'ModalBox [#' + this.modalBoxIndex + ', g' + this.modalBoxGroup + ']';
            } else {
                return 'ModalBox [uninitialized]';
            }
        }
    };

    $.fn.modalBox = function(options) {

        var lowercasedOptions = {},
            option;

        if (options === 'close') {
            closeModalContainingElement(this);
            return true;
        } else if (options === 'updatePosition') {
            windowResize();
            return true;
        }

        for (option in options) {
            if (options.hasOwnProperty(option)) {
                lowercasedOptions[option.toLowerCase()] = options[option];
            }
        }

        options = lowercasedOptions;

        return this.each(function createModalInstance() {

            for (var i = 0; i < domElements.length; i++) {
                if (this === domElements[i]) {
                    console.warn('ModalBox already initialized on element!');
                    console.dir(this);
                    return false;
                }
            }

            domElements.push(this);

            // Get data-attr, convert to lowercase & remove 'modal' prefix
            var dataAttributes = $(this).data(),
                data = {},
                attr,
                propName,
                option,
                optionsKeys;

            for (attr in dataAttributes) {
                if (dataAttributes.hasOwnProperty(attr)) {
                    if (attr.indexOf('modal') === 0) {
                        propName = attr.substr(5).toLowerCase();
                        if (propName) {
                            data[propName] = dataAttributes[attr];
                        }
                    }
                }
            }

            options = $.extend(data, options);

            optionsKeys = Object.keys(options);

            for (option in optionsKeys) {
                if (optionsKeys.hasOwnProperty(option)) {
                    if (!(optionsKeys[option] in $.fn.modalBox.settings)) {
                        console.info('ModalBox option "' + optionsKeys[option] + '" is invalid.');
                    }
                }
            }

            modalBoxElements.push(Object.create(modalBoxPrototype));
            modalBoxCounter = modalBoxElements.length;
            modalBoxElements[modalBoxCounter - 1].init(options, this);
        });
    };

    $.fn.modalBox.settings = {

        // Size
        width: 'auto', // Could also be % values.
        maxwidth: 9999, // This will be maximum allowed width. (Only useful if width is in %). 9999 == we dont pixel limit, other than window.width - 2 x margins of 10px via later calculations.
        minwidth: 100, // Pixel min width of modalbox. If set, modals will not be allowed to be narrower than this.
        respectbrowserwidth: true, // Never make a modalbox wider than browser window.

        // Scrolling
        scrollspeed: 600, // In milliseconds
        scrolleasing: 'easeOutCirc',

        backdrop: 'auto', // Show backdrop?
        closeonbackdrop: true,
        position: 'bottom',
        margin_x: 15, // Pixels x-tra away from its relative element. Works more like margin.
        margin_y: 5, // Pixels y-tra away from its relative element. Works more like margin.
        nextto: null, // Place this modalbox next to another element?

        animopen: 'fadeIn',
        animclose: 'fadeOut',
        mainwrapperclass: 'modals',
        noscrollclass: 'noscroll',
        closebuttonclass: 'fa fa-times',
        spinnerclass: 'fa fa-cog fa-spin fa-5x',

        autoadjust: true,
        autoscroll: true, // Scroll to modal when opened if outside of (or partically outside of) the window.
        params: null, // Object containing data used to get/retrieve ajax / php content.
        type: 'GET',
        getchildren: true,
        clone: false,
        returncontent: true, // If true, adds extracted dom content back into the dom tree when closing the modal.
        closebutton: true,
        msg_ajaxfailed: 'Request failed. Please try again.',

        // Callbacks
        beforeopen: $.noop,
        afteropen: $.noop,
        beforeclose: $.noop,
        afterclose: $.noop,
        onerror: $.noop,

        content: false, // Html or jQuery selector
    };

    $(document)
        .on('close.modalBox', closeTopmostModal)
        .on('click', '[data-modal]', modalOpenTrigger);

    $(window)
        .on('resize', windowResize)
        .on('keydown', escapeKeyClick)
        .on('scroll', windowScroll);

    $.extend($.easing, {
        easeOutBack: function(x, t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        }
    });

    // Check if we have support for CSS3 animations.
    (function() {
        var animationstring = 'animation',
            keyframeprefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx = '';

        if (document.body.style.animationName !== undefined) {
            css3animsupported = true;
        }

        if (css3animsupported === false) {
            for (var i = 0; i < domPrefixes.length; i++) {
                if (document.body.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                    pfx = domPrefixes[i];
                    animationstring = pfx + 'Animation';
                    keyframeprefix = '-' + pfx.toLowerCase() + '-';
                    css3animsupported = true;
                    break;
                }
            }
        }
    })();

})(jQuery, window);
