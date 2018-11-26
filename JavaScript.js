var fn;
var sigma;
var alpha;
var h;
var x = new Array(2);
var fi;
var gradArrX = [];
var gradArrY = [];
var xArray = [];
var yArray = [];
var funcXY = [];
var lambdaArray = [];
var GradArray = [];
var count;
var newPointX;
var newPointY;
var antigradX;
var antigradY;
var condition = false;

function ChangeFunctionToL(fn, GradArray, x) {
    var xL = "(" + CalculateNewPointX(x, GradArray) + ")";
    var yL = "(" + CalculateNewPointY(x, GradArray) + ")";
    var new1 = fn.toString().replace(/x/g, xL.toString());
    var new2 = new1.toString().replace(/y/g, yL.toString());
    return new2;
}
function CalculateNewPointX(x, GradArray) {
    antigradX = x[0].toString() + "-" + "(" + GradArray[0].toString() + ")";
    newPointX = antigradX + "*l";
    return newPointX;
}
function CalculateNewPointY(x, GradArray) {
    antigradY = x[1].toString() + "-" + "(" + GradArray[1].toString() + ")";
    newPointY = antigradY + "*l";
    return newPointY;
}
function Nerdamer(fn, GradArray, x) {
    var f = ChangeFunctionToL(fn, GradArray, x).toString();
    var pr = math.derivative(f, 'l');
    var f1 = pr.toString() + "=0";
    if (f1.toString().includes("l")) {
        var lambda = nerdamer.solve(f1, 'l');
        var removeLeftSeparator = lambda.toString().replace(/[\[ ]/g, "");
        var removeRightSeparator = removeLeftSeparator.toString().replace(/[\] ]/g, "");
        var splitLambdaResults = removeRightSeparator.toString().split(",");
        var newLambda1;
        var newLambda2;
        var timeResult1;
        var timeResult2;
        var fixResult1;
        var fixResult2;
        if (splitLambdaResults[0].includes("+")) {
            var splitResult1 = splitLambdaResults[0].toString().split("+");
            newLambda1 = splitResult1[1];
        }
        if (splitLambdaResults.length > 1) {
            if (splitLambdaResults[1].includes("+")) {
                var splitResult2 = splitLambdaResults[1].toString().split("+");
                newLambda2 = splitResult2[1];
            }

            else {
                newLambda1 = splitLambdaResults[0];
                newLambda2 = splitLambdaResults[1];

            }
        }
        else {
            newLambda1 = splitLambdaResults[0];
            newLambda2 = splitLambdaResults[0];
        }
        with (Math) {
            timeResult1 = eval(newLambda1);
            timeResult2 = eval(newLambda2);
            fixResult1 = timeResult1.toFixed(4);
            fixResult2 = timeResult2.toFixed(4);
        }
        var timeResult;
        if (fixResult1 > fixResult2) {
            timeResult = fixResult1;
        }
        else {
            timeResult = fixResult2;
        }
        var result = "(" + timeResult.toString() + ")";
    } else if (f1.toString = "0=0") {
        condition = true;
        result = 0;
    }
    else {
        document.getElementById('err').innerHTML = 'Error';
        return;
    }
    
    return result;
}
function ReCalculateX(l, x) {
    var pointX = newPointX.toString().replace(/l/g, l.toString());
    var pointY = newPointY.toString().replace(/l/g, l.toString());
    with (Math) {
        x[0] = eval(pointX);
        x[1] = eval(pointY);
        x[0] = x[0].toFixed(4);
        x[1] = x[1].toFixed(4);
    }
    return x;
}
function CalculateMinPoint(obj) {
    fn = obj.f.value;
    sigma = obj.e1.value;
    alpha = obj.e1.value;
    h = obj.h.value-1;
    x[0] = obj.x00.value;
    x[1] = obj.x01.value;
    var n = x.length;
    var g0 = g(x);
    count = 1;
    funcXY[0] = g(x);
    var x0 = new Array(2);
    x0[0] = x[0];
    x0[1] = x[1];
    xArray[0] = x[0];
    yArray[0] = x[1];
    GradArray[0] = CalculateGradX(x);//Вычисляет градиент x
    GradArray[1] = CalculateGradY(x);
    gradArrX[0] = GradArray[0];
    gradArrY[0] = GradArray[1];//Вычисляет градиент y
    //Вычисляет градиент y
    var l = 0;
    lambdaArray[0] = l;
    var norm = CalculateNorm(GradArray, n);
    
    var h1 = 0;
    while (h1 < h && condition == false) {
        //Calculate next value
        var g0 = g(x);
        if (Nerdamer(fn, GradArray, x) != null) {
            l = Nerdamer(fn, GradArray, x);
            lambdaArray[count] = l;
            x = ReCalculateX(l, x);
            //Calculate next gradient
            GradArray[0] = CalculateGradX(x);//Вычисляет градиент x
            GradArray[1] = CalculateGradY(x);
            gradArrX[count] = GradArray[0].toFixed(4);
            gradArrY[count] = GradArray[1].toFixed(4);
            //Calculate next norm
            norm = CalculateNorm(GradArray, n, norm);
            var g1 = g(x);
            if (Math.abs(g1 - g0) < sigma && Math.sqrt(Math.pow((x[0] - x0[0]), 2) + Math.pow((x[1] - x0[1]), 2)) < alpha) {
                condition = true;
            }
            x0[0] = x[0];
            x0[1] = x[1];
            xArray[count] = x0[0];
            yArray[count] = x0[1];
            funcXY[count] = g(x);

            count++;
            h1++;
        }
        else { break;}
    }
    document.getElementById('gX').innerHTML = 'gradX';
    document.getElementById('gY').innerHTML = 'gradY';
    document.getElementById('lb').innerHTML = 'lambda';
    document.getElementById('fXY').innerHTML = 'funcXY';
    document.getElementById('xArr').innerHTML = 'X';
    document.getElementById('yArr').innerHTML = 'Y';

    for (i = 0; i < count; i++) {   
        document.getElementById('gradArrX').innerHTML +=  gradArrX[i] + '</br>';
        document.getElementById('gradArrY').innerHTML +=  gradArrY[i] + '</br>';
        document.getElementById('lambdaArray').innerHTML +=  lambdaArray[i] + '</br>';
        document.getElementById('funcXY').innerHTML += funcXY[i] + '&nbsp' + '</br>';
        document.getElementById('xArray').innerHTML += xArray[i] + '&nbsp' + '</br>';
        document.getElementById('yArray').innerHTML += yArray[i] + '&nbsp' + '</br>';
     
    }
    document.getElementById('x0').innerHTML += 'Минимум в точке х = '+ x[0] + '</br>';
    document.getElementById('x1').innerHTML +='y = '+ x[1] + '</br>';
    document.getElementById('count0').innerHTML += 'Количество шагов ' + count + '</br>';
    document.getElementById('description').innerHTML += '1. Получаем градиент функции ' + gradArrX[0] + '</br>'+ 2. ;
}
function clearBox() {
    document.getElementById("gX").innerHTML = "";
    document.getElementById("gY").innerHTML = "";
    document.getElementById("lb").innerHTML = "";
    document.getElementById("fXY").innerHTML = "";
    document.getElementById("gradArrX").innerHTML = "";
    document.getElementById("gradArrY").innerHTML = "";
    document.getElementById("lambdaArray").innerHTML = "";
    document.getElementById("funcXY").innerHTML = "";
    document.getElementById("x0").innerHTML = "";
    document.getElementById("x1").innerHTML = "";
    document.getElementById("count0").innerHTML = "";  
    document.getElementById("err").innerHTML = ""; 
    document.getElementById("xArr").innerHTML = "";  
    document.getElementById("yArr").innerHTML = "";  
    document.getElementById("xArray").innerHTML = "";
    document.getElementById("yArray").innerHTML = ""; 

}
function GradX(x, y) {
    var res1 = 0;
    res1 = math.derivative(fn, 'x').eval({ x: x, y: y });
    return res1;
}
function GradY(x, y) {
    var res2 = math.derivative(fn, 'y').eval({ x: x, y: y });
    return res2;
}
function CalculateGradX(x) {
    return GradX(x[0], x[1]);
    // body...
}
function CalculateGradY(x) {
    return GradY(x[0], x[1]);
    // body...
}
function GradientXY(x, h, fi, c) {
    fi[0] = CalculateGrddX(x);
    fi[1] = CalculateGrsdY(x);
    gradArrX[c] = fi[0];
    gradArrY[c] = fi[1];
    return fi;
}
function CalculateNorm(GradArray, n, norm1) {
    norm1 = 0;
    for (var i = 0; i < n; ++i) {
        norm1 += GradArray[i] * GradArray[i];
    }
    norm1 = Math.sqrt(norm1);
    return norm1;
}
function CalculatePointX(b, fi, n) {
    //Calculate next value
    for (var j = 0; j < n; ++j) {
        x[j] -= b * fi[j];
    }
    return x;
}
// Provides a rough calculation of gradient g(x).
function fun(x, y) {
    var res = 0;
    with (Math) {
        res = eval(fn);
    }
    return res;
}
// Method to provide function g(x).
function g(x) { 

    var g = fun(x[0], x[1]);
    var res1;
    with (Math) {
        res1 = eval(g);
    }
    
    return res1;
}
