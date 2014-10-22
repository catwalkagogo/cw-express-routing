var NPath = require('path');
var Enumerable = require('linq');

var Path = (function () {
    function Path() {
    }
    Path.getFilenameWithoutExtension = function (path) {
        return NPath.basename(path, NPath.extname(path));
    };

    Path.split = function (path) {
        return Enumerable.from(NPath.normalize(path).split(NPath.sep)).where(function (seg) {
            return seg != '';
        }).toArray();
    };
    return Path;
})();

module.exports = Path;
//# sourceMappingURL=PathUtil.js.map
