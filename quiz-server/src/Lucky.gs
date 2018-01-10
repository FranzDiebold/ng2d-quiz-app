var Lucky = (function(ns) {

  /**
   * shuffle an array or a string
   * @param {[*]|string} shuffleThis the array or string to shuffle
   * @param {number} [seed] if specified then the shuffle is repeatable
   * @param {boolean} [unShuffling] whether im unshuffling
   * @return {[*]|string} the shuffle
   */
  ns.shuffle = function(shuffleThis, seed, unShuffling) {
    if (!shuffleThis || !shuffleThis.length) {
      return [];
    }

    var target = Array.isArray(shuffleThis) ? shuffleThis.slice() : shuffleThis.split("");

    var shuffler = ns.get({
      size: target.length,
      maxSize: target.length,
      min: 0,
      max: target.length - 1,
      seed: seed
    });

    var seq = target.map(function(d, i) {
      return i;
    });

    seq.forEach(function(d, i, a) {
      var t = a[shuffler[i]];
      a[shuffler[i]] = a[i];
      a[i] = t;
    });

    var result = target.map(function(d, i, a) {
      return unShuffling ? a[seq.indexOf(i)] : a[seq[i]];
    });

    return Array.isArray(shuffleThis) ? result : result.join("");
  };

  /**
   * return a rand int between
   * @param {number} min the min
   * @param {number} max the max
   * @param {function} [func=Math.random] the random func
   * @return [number} the random
   */

  ns.getRandBetween = function(min, max, func) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor((func || Math.random)() * (max - min + 1) + min);
  };

  /**
   * generate a random array of some length of some numbers
   * @param {object} [options] the options
   * @param {number} options.max the higher character
   * @param {number} options.min the lower character
   * @param {number} options.size the min size of the string
   * @param {number} options.maxSize the max size of the string
   * @param {number} options.seed if specified generates repreatable sequence with the same seed
   * @return {[number]} the array
   */
  ns.getString = function(options) {

    var params = applyDefaults_({
      min: 'a',
      max: 'z',
      rx: null,
      size: 0,
      maxSize: 0,
      seed: 0,
      list: '',
      extendedAscii: false
    }, options);

    // we'll use this to construct the parms for the .get call
    var ap = {
      size: params.size,
      maxSize: params.maxSize,
      seed: params.seed
    };

    if (typeof params.min !== 'string' || typeof params.max !== 'string' || params.min > params.max) {
      throw 'Min and max are incompatible ' + JSON.stringify(params);
    }
    // can use a regex if necessary
    var values;
    if (params.rx) {
      ap.list = Array.apply(null, new Array(params.extendedAscii ? 256 : 128))
        .map(function(d, i) {
          return i;
        })
        .filter(function(d, i, a) {
          return String.fromCharCode(d).match(params.rx);
        });
      if (!ap.list.length) {
        throw 'Your regex didnt match anything';
      }
    } else if (params.list) {
      if (typeof params.list !== "string") {
        throw 'list of parameters should be a string';
      }
      ap.list = params.list.split("").map(function(d) {
        return d.charCodeAt(0);
      });
    } else {
      ap.min = params.min.charCodeAt(0);
      ap.max = params.max.charCodeAt(0);

    }

    // now shuffle the values
    return ns.get(ap).map(function(d) {
        return String.fromCharCode(d);
      })
      .join('');

  };

  /**
   * get a unique string
   * @param {number} [size=12] string size
   * @return {string} a string
   */
  ns.getUniqueString = function(size) {

    var now32 = new Date().getTime().toString(32);
    size = size || now32.length + 3;
    if (size < now32.length) {
      throw 'unique string must be at least ' + now32.length;
    }
    return ns.getString({
      size: size - now32.length
    }) + ns.shuffle(now32);
  };
  /**
   * generate a random array of some length of some numbers
   * @param {object} [options] the options
   * @param {number} options.max the higher number
   * @param {number} options.min the lower number
   * @param {number} options.size the min size of the array
   * @param {number} options.maxSize the max size of the array
   * @param {number} options.seed if specified generates repreatable sequence with the same seed
   * @return {[number]} the array
   */
  ns.get = function(options) {
    // default options
    var params = applyDefaults_({
      min: 0,
      max: 0,
      rx: null,
      size: 0,
      maxSize: 0,
      seed: 0,
      list: null
    }, options);

    var size = params.size;

    // if a constrained list we need to make a balanced list of all potential values
    var values;
    if (params.list) {
      values = params.list;
      if (!Array.isArray(values)) {
        throw 'list of parameters should be an array';
      }
      if (params.list.length) {
        while (values.length < size) {
          Array.prototype.push.apply(values, params.list);
        }
      }

    }

    // set seed if needed
    var oldSeed;
    if (params.seed) {
      oldSeed = Math.seed;
      var idx = 0;
      Math.seed = typeof params.seed === "string" ?
        params.seed.split("")
        .reduce(function(p, c) {
          return p + c.charCodeAt(0) / ++idx / 127;
        }, 997) : params.seed;
    }

    // decide which random to use
    var rf = params.seed ? function() {
      // thanks to http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      // I have no idea why this works, but it does
      Math.seed = (Math.seed * 9301 + 49297) % 233280;
      return Math.seed / 233280;
    } : Math.random;

    //generate the random array
    var result = values ?
      values.map(function(d, i, a) {
        return a[ns.getRandBetween(0, a.length - 1, rf)];
      }).slice(0, size) :
      Array.apply(null, new Array(size)).map(function(d) {
        return ns.getRandBetween(params.min, params.max, rf);
      });

    // restore the seeed
    if (params.seed) {
      Math.seed = oldSeed;
    }
    return result;
  };

  function applyDefaults_(defaults, given) {

    // merge with the defaults;
    var options = given ?
      Object.keys(given)
      .reduce(function(p, c) {
        p[c] = given[c];
        return p;
      }, {}) : {};

    // if a size is given, but no maxSize then assume it
    options.maxSize = options.maxSize || options.size;
    var params = Object.keys(options).reduce(function(p, c) {
      p[c] = options[c];
      return p;
    }, defaults);

    // check it makes sense
    if (params.size > params.maxSize) {
      throw 'incompatible size options' + JSON.stringify(params);
    }
    // pick a given or random size
    if (params.size < params.maxSize) {
      params.size = ns.getRandBetween(params.size, params.maxSize);
    }
    if (params.size < 0) {
      throw 'invalid size option' + params.size;
    }
    if (params.min > params.max) {
      throw 'incompatible min and max options ' + JSON.stringify(params);
    }
    return params;
  }

  /**
   * get a grid
   * @param {object} options the options
   * @return {[[]]} the grid in spreadsheet values format
   */
  ns.getGrid = function(options) {
    var params = applyDefaults_({
      size: 10,
      maxSize: 0,
      width: 6,
      maxWidth: 0,
      list: ['date', 'string', 'number', 'boolean'],
      fixed: false,
      seed: 0
    }, options);

    // set up the defaults for the various types
    params.string = applyDefaults_({
      min: 'a',
      max: 'z',
      size: 10,
      maxSize: 0,
      seed: 0,
      list: null,
      rx: null,
      inheritSeed:true
    }, options.string);

    var now = new Date();
    var then = new Date();
    then.setMonth(then.getMonth() + 1);
    params.date = applyDefaults_({
      min: now,
      max: then,
      size: 0,
      maxSize: 0,
      seed: 0,
      list: null,
      inheritSeed:true
    }, options.date);

    params.number = applyDefaults_({
      min: 0,
      max: 100,
      size: 0,
      maxSize: 0,
      seed: 0,
      list: null,
      inheritSeed:true
    }, options.number);
    params.boolean = applyDefaults_({
      min: 0,
      max: 1,
      size: params.size,
      maxSize: params.maxSize,
      seed: 0,
      list: [true, false],
      inheritSeed:true
    }, options.boolean);
    // check the list is good
    if (!params.list || !Array.isArray(params.list) || !params.list.every(function(d) {
        return ['boolean', 'string', 'number', 'date'].indexOf(d) !== -1;
      })) {
      throw 'invalid list for grid';
    }
    // get the columns
    var columns = params.fixed ?
      params.list :
      ns.get({
        size: params.width,
        maxSize: params.maxWidth,
        list: params.list,
        seed: params.seed
      });

    // use this as the model
    var stripe = ns.get({
      size: params.size,
      maxSize: params.maxSize,
      seed: params.seed
    });

    columns.forEach(function(d) {
      params[d].seed = params[d].seed || (params[d].inheritSeed ? params.seed : 0);
      if (d !== "string") {
        params[d].size = params[d].maxSize = stripe.length;
      }
      if (d === "date") {
        params[d].min = params[d].min.getTime();
        params[d].max = params[d].max.getTime();
      }
    });
    // now get the data
    var data = columns.map(function(col) {
      var result = (col === "string") ?
        stripe.map(function(d) {
          return ns.getString(params[col]);
        }) : ns.get(params[col]);
      return col === "date" ? result.map(function(d) {
        return new Date(d);
      }) : result;
    });

    // now transpose the columns and add columns headings
    return stripe.reduce(function(p, c) {
      p.push(columns.map(function(d, i) {
        return data[i][p.length - 1];
      }));
      return p;
    }, [columns.map(function(d, i) {
      return (i + 1) + "-" + d;
    })]);

  };
  return ns;
})(Lucky || {});
