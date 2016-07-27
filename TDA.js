//var distance = require("ndarray-distance")
//var ndarray = require("ndarray")

//Get lower triangular Euclidean distance matrix
//(TODO: Speed this up with matrix multiplication
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
    return D;
}

function getRipsDGMs(Ps, cutoff, dimMax) {
    var N = Ps.length;
    var D = getD(Ps);
    var dgms = new Module.VectorVectorFloat();
    tic = (new Date()).getTime();
    Module.ripserJS(D, N, cutoff, dimMax, dgms);
    toc = (new Date()).getTime();
    var elapsed = (toc - tic)/1000.0;
    
    var dgmsRet = [];
    for (var i = 0; i < dgms.size()/2; i++) {
        var bptr = dgms.get(i*2);
        var dptr = dgms.get(i*2+1);
        var b = [];
        var d = [];
        for (var j = 0; j < bptr.size(); j++) {
            b.push(bptr.get(j));
            d.push(dptr.get(j));
        }
        dgmsRet.push({'births':b, 'deaths':d});
    }
    
    //Clean up allocated memory
    D.delete();
    dgms.delete();
    
    return {'dgms':dgmsRet, 'elapsed':elapsed};
}

function plotPC2D(Ps, documentElem) {
    xp = [];
    yp = [];
    for (var i = 0; i < Ps.length; i++) {
        xp.push(Ps[i][0]);
        yp.push(Ps[i][1]);
    }
    var points = {x:xp, y:yp, mode:'markers', name:'points'};
    var layout = {
      autosize: false, width: 500, height: 500,
      margin: { l: 0, r: 0, b: 0, t: 65, title:'Point Cloud' }
    };
    Plotly.newPlot(documentElem, [points], layout);
}

function plotPC3D(Ps, documentElem) {
    xp = [];
    yp = [];
    zp = [];
    for (var i = 0; i < Ps.length; i++) {
        xp.push(Ps[i][0]);
        yp.push(Ps[i][1]);
        zp.push(Ps[i][2]);
    }
    var scatterplot = { x: xp, y: yp, z: zp,             
      type: 'scatter3d', name: 'Point Cloud',
              mode: 'markers',
        marker: {
         color: 'rgb(0, 0, 200)',      
         size: 2,
        }
    };
    var layout = {
      autosize: false, width: 500, height: 500,
      margin: { l: 0, r: 0, b: 0, t: 65, title:'Point Cloud' }
    };
    Plotly.newPlot(documentElem, [scatterplot], layout); 
}
