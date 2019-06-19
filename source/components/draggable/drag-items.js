var DragItemsDefaultConfig = {
    dragItem: 'li',
    dropTo: "parent",
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

    },

    changeAttribute: function(attributeName){

    },

    destroy: function(){}
};

Metro.plugin('dragitems', DragItems);