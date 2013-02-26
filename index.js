// underscore functions
// defaults


(function(name, context, definition) {

    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function' && define.amd) define(definition);
    else context[name] = definition();

})('sandbox', this, function() {

    "use strict";

    // some helper functions
    var nativeForEach = [].forEach,
        slice = [].slice,
        has = {}.hasOwnProperty;

    function each(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if (has.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    }

    function extend(obj) {
        each(slice.call(arguments, 1), function(source) {
            each(source, function(val, prop) {
                if (has.call(source, prop)) {
                    obj[prop] = val;
                }
            });
        });
        return obj;
    }

    function isFunction(f) {
        return typeof f === 'function';
    }


    var isArray = Array.isArray || function(obj) {
            return {}.toString.call(obj) == '[object Array]';
        };


    function indexOf(arr, el) {
        return arr.indexOf(el);
        // todo - fallback for <= ie8
    }


    function Foo(config) {
        this.config = extend({}, config || {})
        this.modules = extend({}, foo.modules, this.config.modules || {});
        this.attached = []; // already attached to this instance
    }

    extend(Foo.prototype, {
        use: function() {
            var t = this,
                args = slice.call(arguments, 0),
                last = args[args.length - 1],
                // possible callback
                fn = isFunction(last) ? last : function() {},
                modules = isFunction(last) ? slice.call(args, 0, args.length - 1) : args,

                // use to calculate dependencies
                deps = [],
                _deps = [];

            function resolve(name) {
                if (indexOf(_deps, name) >= 0) {
                    return;
                    // no op, already parsed
                } else {
                    // use _deps as comparison because deps should get updated only AFTER a a module is reolved. 
                    _deps.push(name);
                    var uses = t.modules[name].options.uses || [];
                    if (!isArray(uses)) {
                        uses = [uses];
                    }
                    each(uses, function(u) {
                        resolve(u);
                    });
                    deps.push(name);
                }
            }

            // recursively update deps with required modules
            each(modules, function(m) {
                resolve(m);
            });

            each(deps, function(d) {
                if (indexOf(t.attached, d) >= 0) {
                    return;
                } else {
                    t.modules[d].fn(t);
                    t.attached.push(d);
                }
            });
            fn(this); //todo - scope?
            return this;

        }
    });

    var foo = function(config) {
        return new Foo(config);
    };

    extend(foo, {
        add: function(name, fn, options) {
            this.modules || (this.modules = {});
            this.modules[name] = {
                name: name,
                fn: fn || function() {},
                options: options || {}
            };
        }
    });



    return foo;

});