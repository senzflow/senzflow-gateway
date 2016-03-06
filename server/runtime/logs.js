
var MAXLENGTH = 100;

function Logs() {

    var logs = [];

    function append() {
        var args = [].slice.call(arguments);
        var level = args.shift();
        var who = args.shift();
        var first = args.shift();
        logs.unshift("[" + level + "] " + who + " - " + new Date() + " " + args.join(" "));
        if (logs.length > MAXLENGTH) {
            logs.length = MAXLENGTH
        }
    }

    this.info = function() {
        append.apply(null, ["INFO"].concat([].slice.call(arguments)))
    };

    this.debug = function() {
        append.apply(null, ["DEBUG"].concat([].slice.call(arguments)))
    };

    this.error = function() {
        append.apply(null, ["ERROR"].concat([].slice.call(arguments)))
    };

    this.warn = function() {
        append.apply(null, ["WARN"].concat([].slice.call(arguments)))
    };

    this.collect = function() {
        return logs
    };

    this.clean = function() {
        logs.length = 0
    }
}

module.exports = new Logs();