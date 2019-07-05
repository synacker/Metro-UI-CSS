var DragItemsDefaultConfig = {
    dragItem: 'li',
    dropTargets: null,
    dragMode: "clone",
    onCanDrag: Metro.noop_true,
    onDragStart: Metro.noop,
    onDragStop: Metro.noop,
    onDragMove: Metro.noop,
    onDragItemsCreate: Metro.noop
};

Metro.dragItemsSetup = function (options) {
    DragItemsDefaultConfig = $.extend({}, DragItemsDefaultConfig, options);
};

if (typeof window["metroDragItemsSetup"] !== undefined) {
    Metro.dragItemsSetup(window["metroDragItemsSetup"]);
}

var DragItems = {
    init: function( options, elem ) {
        this.options = $.extend( {}, DragItemsDefaultConfig, options );
        this.elem  = elem;
        this.element = $(elem);
        this.avatar = null;
        this.dragItem = null;
        this.dropTargets = [elem];

        this._setOptionsFromDOM();
        this._create();

        return this;
    },

    _setOptionsFromDOM: function(){
        var that = this, element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var that = this, element = this.element, o = this.options;

        this._createStructure();
        this._createEvents();

        Utils.exec(o.onCreate, [element]);
    },

    _createStructure: function(){
        var that = this, element = this.element, o = this.options;

    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;

        element.on(Metro.events.startAll, o.dragItem, function(e_start){
            var offset, onselectstart, ondragstart;
            var width, height, shift = {
                top: 0, left: 0
            };

            var disableSelect = function(){
                onselectstart = document.body.onselectstart;
                ondragstart = document.ondragstart;
            };
            var enableSelect = function(){
                document.body.onselectstart = onselectstart;
                document.ondragstart = ondragstart;
            };

            var moveElement = function(e, el){
                var top = Utils.pageXY(e).y - shift.top;
                var left = Utils.pageXY(e).x - shift.left;
                var side;
                var elementFromPoint;

                el.css({
                    left: left,
                    top: top
                });

                elementFromPoint = document.elementsFromPoint(Utils.pageXY(e).x, Utils.pageXY(e).y).filter(function(elementFromPoint){
                    // return (el[0].parentElement === elementFromPoint.parentElement) && !$(elementFromPoint).hasClass("dragged-item");
                    return ($(elementFromPoint).parent().hasClass('drag-items-target')) && !$(elementFromPoint).hasClass("dragged-item");
                })[0];

                if (!Utils.isValue(elementFromPoint)) {

                    elementFromPoint = document.elementsFromPoint(Utils.pageXY(e).x, Utils.pageXY(e).y).filter(function(elementFromPoint){
                        return $(elementFromPoint).hasClass('drag-items-target');
                    })[0];

                    that.avatar.appendTo(elementFromPoint);

                } else {
                    var $el = $(elementFromPoint);
                    var $el_offset = $el.offset();
                    var Y = Utils.pageXY(e).y - $el_offset.top;
                    var dim = {w: $el.width(), h: $el.height()};

                    if (Y > dim.h / 2) {
                        side = 'bottom';
                    } else {
                        side = "top";
                    }

                    // console.log(side);

                    if (side === 'top') {
                        if (that.avatar.next()[0] !== elementFromPoint) {
                            that.avatar.insertBefore(elementFromPoint);
                        }
                    }
                    if (side === 'bottom') {
                        if (that.avatar.prev()[0] !== elementFromPoint) {
                            that.avatar.insertAfter(elementFromPoint);
                        }
                    }
                }

            };

            if (Utils.isRightMouse(e_start)) {
                return ;
            }

            disableSelect();

            that.dragItem = $(this);

            offset = that.dragItem.offset();

            shift.top = Utils.pageXY(e_start).y - offset.top;
            shift.left = Utils.pageXY(e_start).x - offset.left;

            width = that.dragItem.width();
            height = that.dragItem.height();

            that.avatar = $(that.dragItem).clone(true).addClass("dragged-item-avatar").insertBefore(that.dragItem);

            that.dragItem.css({
                top: offset.top,
                left: offset.left,
                position: "absolute",
                width: width,
                height: height,
                zIndex: 1000
            }).addClass("dragged-item").appendTo("body");

            $(document).on(Metro.events.moveAll, function(e_move){
                e_move.preventDefault();
                moveElement(e_move, that.dragItem);
            });

            $(document).on(Metro.events.stopAll, function(e_stop){

                enableSelect();

                $(document).off(Metro.events.moveAll);
                $(document).off(Metro.events.stopAll);

                that.dragItem.insertBefore(that.avatar).removeClass("dragged-item").removeStyleProperty("top, left, position, width, height, z-index");

                that.avatar.remove();
                that.avatar = null;
                that.mouseOffset = null;
                that.dragItem = null;
            });

            e_start.stop();
        })
    },

    changeAttribute: function(attributeName){

    },

    destroy: function(){}
};

Metro.plugin('dragitems', DragItems);