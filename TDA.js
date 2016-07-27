//var distance = require("ndarray-distance")
//var ndarray = require("ndarray")

function getD(Ps) {
    var N = Ps.length;
    var D = new Module.VectorFloat();
    var d = 0.0;
    for (var i = 1; i < N; i++) {
        for (var j = 0; j < i; j++) {
            d = 0.0;
            for (var k = 0; k < Ps[i].length; k++) {
                d += (Ps[i][k]-Ps[j][k])*(Ps[i][k]-Ps[j][k]);
            }
            D.push_back(Math.sqrt(d));
        }
    }
    Module.ripserJS(D, N, 1000, 1);
}
