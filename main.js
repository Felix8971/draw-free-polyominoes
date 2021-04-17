"use strict";
//Calcul number of free polyominoes (or square animals) with n cells

/*
   Convention notation matrice:
   M = [
       [ V[0][0], V[0][1], V[0][2] ],
       [ V[1][0], V[1][1], V[1][2] ],
       [ V[2][0], V[2][1], V[2][2] ]
       ];

       example: M = [
         [1,1,0],
         [0,1,1]
         [0,1,0]
         [0,1,0]
       ];
*/
//let x: string = "";
// const generation = [ // array of array of matrice
//     [M0, M1, M2, M3],//one arrangment
//     [M0, M1, M2, M3],
//     [M0, M1, M2, M3],
//     //...
// ];
//Generation n = set of polyominoes we can make with N squares 
var SIZE_MAX = 9; //nombre max de carre dans l'arrangement
var WITH_MIRROR = true; //if true the mirror images of an arrangment will be considere to be te same arrangment (reflexion)
var ON = 1;
var OFF = 0;
var generationList = [];
var initMatrix = function (nbLine, nbCol) {
    var arr = new Array(nbLine); // create an empty array of length nbLine
    for (var i = 0; i < nbLine; i++) {
        arr[i] = new Array(nbCol); // make each element an array of length nbCol
        for (var j = 0; j < nbCol; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
};
var copy2DMatrix = function (M) {
    var copy = new Array(M.length);
    for (var i = 0; i < M.length; ++i) {
        copy[i] = M[i].slice(0);
    }
    return copy;
};
var rangMatrix = function (M) {
    var rang = 0;
    for (var i = 0; i < M.length; i++) {
        for (var j = 0; j < M[i].length; j++) {
            if (M[i][j]) {
                rang++;
            }
        }
    }
    return rang;
};
var areEqual = function (M0, M1) {
    if (M0.length !== M1.length || M0[0].length !== M1[0].length) {
        return false;
    }
    else {
        for (var i = 0; i < M0.length; i++) {
            for (var j = 0; j < M0[i].length; j++) {
                if (M0[i][j] !== M1[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
};
var rotation90 = function (E0) {
    var E90;
    // const nbLine = E0.length;
    // const nbCol = E0[0].length;
    E90 = initMatrix(E0[0].length, E0.length);
    //Rotation 90 deg
    for (var i = 0; i < E90.length; i++) {
        for (var j = 0; j < E90[i].length; j++) {
            E90[i][j] = E0[j][i];
        }
        E90[i] = E90[i].reverse();
    }
    return E90;
};
var rotationMoins90 = function (E0) {
    var E90;
    // const nbLine = E0.length;
    // const nbCol = E0[0].length;
    E90 = initMatrix(E0[0].length, E0.length);
    //Rotation 90 deg
    for (var i = 0; i < E90.length; i++) {
        for (var j = 0; j < E90[i].length; j++) {
            E90[i][j] = E0[j][i];
        }
    }
    return E90.reverse();
};
var mirrorImage = function (E0) {
    var E0_mir = copy2DMatrix(E0);
    for (var i = 0; i < E0.length; i++) {
        E0_mir[i] = E0_mir[i].reverse();
    }
    return E0_mir;
};
var getEquivalentMatrices = function (E0, includeMirrorImage) {
    var equivalentMatrices = [E0];
    //console.log('E0=', E0);
    //let take90: boolean = false;
    //let take180: boolean = false;
    //let take270: boolean = false;
    var E90 = rotation90(E0);
    var E180 = rotation90(E90);
    var E270 = rotation90(E180);
    //if (!areEqual(E0, E90)) {
    equivalentMatrices.push(E90);
    //take90 = true;
    //}
    //if (!areEqual(E180, E0) && !areEqual(E180, E90)) {
    equivalentMatrices.push(E180);
    //take180 = true;
    //}
    //if (!areEqual(E270, E0) && !areEqual(E270, E90) && !areEqual(E270, E180)) {
    equivalentMatrices.push(E270);
    //take270 = true;
    //}
    if (includeMirrorImage) {
        var E0_mir = mirrorImage(E0);
        equivalentMatrices.push(E0_mir);
        equivalentMatrices.push(mirrorImage(E90));
        equivalentMatrices.push(mirrorImage(E180));
        equivalentMatrices.push(mirrorImage(E270));
    }
    return equivalentMatrices;
};
// let M1: Matrix = [
//     [0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]
// ];
// let U = JSON.parse(JSON.stringify(M1));
// console.log(areEqual(M1, U));
// let M2: Matrix = [
//     [1, 1, 1],
//     [0, 1, 0],
//     [0, 1, 0],
//     [0, 1, 0],
// ];
//let R: Matrix = rotationMoins90(rotation90(M1));
//console.log(areEqual(M1, R));
//Add a layer of empty pixels around the matrix M
var dress = function (M) {
    var D = copy2DMatrix(M);
    D.map(function (line) {
        line.push(OFF);
        line.unshift(OFF);
    });
    var emptyLine = new Array(D[0].length);
    for (var i = 0; i < D[0].length; i++) {
        emptyLine[i] = OFF;
    }
    D.push(emptyLine);
    D.unshift(emptyLine);
    return D;
};
// const dress2 = (M: Matrix) => {
//     let D: Matrix = copy2DMatrix(M);
//     D.map(line => {
//         line.push(0);
//         line.push(0);
//         line.unshift(0);
//         line.unshift(0);
//     });
//     let emptyLine = new Array(D[0].length);
//     for (let i = 0; i < D[0].length; i++) {
//         emptyLine[i] = 0;
//     }
//     D.push(emptyLine);
//     D.push(emptyLine);
//     D.unshift(emptyLine);
//     D.unshift(emptyLine);
//     return D;
// }
// let M: Matrix = [
//     [1, 1]
// ];
// let D1 = dress(dress(M));
// console.log(D1);
//Enleve 1 couche de pixels autour de M
// const strip = (M: Matrix) => {
//     let U = copy2DMatrix(M);
//     U.map(line => {
//         line.pop();
//         line.shift();
//     });
//     U.pop();
//     U.shift();
//     return U;
// }
//voir si faire la somme est plus rapide
var isAnEmptyLine = function (L) {
    for (var i = 0; i < L.length; i++) {
        if (L[i]) {
            return false;
        }
    }
    return true;
};
//Enleve toutes les lignes et les colonnes vides autour de la matrice
var crop = function (E) {
    //Enlever les lignes du haut tant qu'elles sont vides
    var canRemove = true;
    while (canRemove) {
        if (isAnEmptyLine(E[0])) {
            E.shift();
        }
        else {
            canRemove = false;
        }
    }
    //Enlever les lignes du bas tant qu'elles sont vides
    canRemove = true;
    while (canRemove) {
        if (isAnEmptyLine(E[E.length - 1])) {
            E.pop();
        }
        else {
            canRemove = false;
        }
    }
    //Enlever les colonnes a gauche et a droite tant qu'elles sont vides
    //faire rotation90 degre et:
    var E90 = rotation90(E);
    //Enlever les lignes du haut si elles sont vides
    canRemove = true;
    while (canRemove) {
        if (isAnEmptyLine(E90[0])) {
            E90.shift();
        }
        else {
            canRemove = false;
        }
    }
    //Enlever les lignes du bas si elles sont vides
    canRemove = true;
    while (canRemove) {
        if (isAnEmptyLine(E90[E90.length - 1])) {
            E90.pop();
        }
        else {
            canRemove = false;
        }
    }
    //faire rotation -90 (revient a l'orientation initiale)
    var C = rotationMoins90(E90);
    return C;
};
//let D = dress(M1);
//console.log(D);
// let U = strip(D);
// console.log(U);
// let D: Matrix = [
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 1, 2, 3, 0, 0],
//     [0, 0, 5, 6, 0, 0],
//     [0, 7, 8, 9, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
// ];
// let C = crop(D);
// console.log(C);
//console.log(areEqual(M1, M2));
//console.log(M);
//let E = getEquivalentMatrices(M1, WITH_MIRROR);
//console.log(E);
// idee optimisation: determiner une liste EquivalentMatrices reduite si des matrices sont identiques par rotation + 
// calculer l'axe de symetrie de chaque matrice (si il y en a un) afin de parcourir moins de pixel par la suite 
var N = 0;
//Recursive function used to calculate generation n + 1 from generation n
var getNewGeneration = function (generation) {
    var t0 = Date.now();
    var newGeneration = [];
    N++;
    //Pour chaque element de la generation N on essaye de construire une nouvel element pour la generation N + 1
    for (var k = 0; k < generation.length; k++) {
        //generation[k]
        var equivalentMatrices = generation[k]; //array of matrices representing the same arrangement
        var E0 = equivalentMatrices[0]; // we use only the first matrix in the arrangment to create a N + 1 arr
        ///console.log('E0=', E0);
        //Try to add a new pixel to the matrix 
        //ajouter 2 couches de pixel autour de E0 
        var E0_2 = dress(dress(E0));
        for (var i = 1; i < E0_2.length - 1; i++) {
            for (var j = 1; j < E0_2[i].length - 1; j++) {
                if (E0_2[i][j] === OFF) {
                    //regarder en haut, en bas, a droite et a gauche si il y un pixel occupe (bit = 1)
                    if (E0_2[i + 1][j] || E0_2[i - 1][j] || E0_2[i][j + 1] || E0_2[i][j - 1]) {
                        // Au moins 1 pixel occupe sur l'un des 4 points cardinaux 
                        // donc on peut creer un nouveau pixel en (i,j)
                        E0_2[i][j] = ON;
                        var E = crop(copy2DMatrix(E0_2));
                        E0_2[i][j] = OFF; //we cancel the change so that we can reuse the matrix E0_2 for the next pixel
                        //tester si l'arrangement E existe deja dans newGeneration
                        var exist = false;
                        for (var p = 0; p < newGeneration.length; p++) {
                            for (var q = 0; q < newGeneration[p].length; q++) {
                                if (areEqual(E, newGeneration[p][q])) {
                                    exist = true;
                                    break;
                                }
                            }
                            ;
                            if (exist)
                                break;
                        }
                        if (!exist) { //calculer conf equivalentes et ajouter a newGeneration
                            var equivalentMatrice = getEquivalentMatrices(E, WITH_MIRROR);
                            newGeneration.push(equivalentMatrice);
                        }
                    }
                }
            }
        }
    }
    //print result
    var delta_t = (Date.now() - t0) / (1000);
    document.getElementById('log').innerHTML += `<div>${N + 1} cells: found  ${newGeneration.length} free polyominoes in  ${delta_t} s<div>`;
    console.log((N + 1) + " cells: found ", newGeneration.length, " free polyominoes in ", delta_t, "s");
    //console.log("Generation ", N, newGeneration);
    let g = []
    newGeneration.map(x => {
        g.push(x[0]);
    });

    //console.log("Free polyominoes with " + (N + 1) + " cells: ", g);

    //insert a separation line
    if (N > 1) {
        const separationLine = document.createElement('div');
        separationLine.className = 'separator-line';
        document.getElementById('main').appendChild(separationLine);
    }
    //insert all polyominoes found with N + 1 cell

    const nbcellLabel = document.createElement('div');
    nbcellLabel.className = 'nb-cell';
    document.getElementById('main').appendChild(nbcellLabel);
    nbcellLabel.innerHTML += (N + 1) + ' cells: ';
    nbcellLabel.innerHTML += g.length + ' free polyominoes';

    g.map((p, index) => {
        drawPolyomino(p, N + 1, index);
    });

    //test d'arret 
    if (N >= SIZE_MAX - 1) {
        let runBtn = document.getElementById("run-btn");
        runBtn.innerHTML = "Calculate";
        return;
    }
    getNewGeneration(newGeneration);
};

var drawPolyomino = (p, n, index) => {
    const polyomino = document.createElement('div');
    polyomino.className = 'polyomino';
    document.getElementById('main').appendChild(polyomino);

    p.map(x => {
        const line = document.createElement('div');
        line.className = 'line';
        polyomino.appendChild(line);
        x.map(c => {
            if (c) {
                const cell = document.createElement('div');
                cell.className = 'cell white';
                line.appendChild(cell);
            } else {
                const cell = document.createElement('div');
                cell.className = 'cell';
                line.appendChild(cell);
            }
        });
    });

    const name = document.createElement('div');
    name.className = 'name';
    name.innerHTML += n + '.' + index;
    polyomino.appendChild(name);
}

var generation1 = [
    //EquivalentMatrices list for the first arrangement
    [
        [[ON]],
    ],
];

generationList.push(generation1);
//console.log("generation length=", 1);
// generation1.map(item => {
//     getEquivalentMatrices
// });
let runBtn = document.getElementById("run-btn");
//runBtn.innerHTML = "Running...";

getNewGeneration(generation1);
console.log("----- END -----");
console.log(generationList);


runBtn && runBtn.addEventListener("click", function (event) {
    let runBtn = document.getElementById("run-btn");
    runBtn.innerHTML = "Running...";
    document.getElementById('main').innerHTML = 'Loading...';
    setTimeout(() => {
        generationList = [];
        N = 0;
        document.getElementById('main').innerHTML = `
        <div id="log">
            <div>1 cell: found 1 free polyominoes in 0 s</div>
        </div>
        <div class="separator-line"></div>
        <div class="nb-cell">1 cell: 1 free polyominoe</div>
            <div class="polyomino">
                <div class="line">
                    <div class="cell white"></div>
                </div>
            <div class="name">1.0</div>
        </div>
        <div class="separator-line"></div>`;
        var e = document.getElementById("max-number-of-cell");
        SIZE_MAX = parseInt(e.value);

        getNewGeneration(generation1);
    }, 100);

});

// generation length= 4655
// dt= 4.022
// generation length= 17073
// dt= 120.959
// version optimisee =>
// Generation  8 : found  1285  free polyominoes in  0.207 s
// Generation  9 : found  4655  free polyominoes in  2.507 s
// Generation  10 : found  17073  free polyominoes in  63.863 s
//same result found here:  https://oeis.org/search?q=1%2C+1%2C+2%2C+5%2C+12%2C+35%2C+108&language=english&go=Search
//Formula: https://www.mathpages.com/home/kmath039.htm
//http://villemin.gerard.free.fr/Puzzle/minoPoly.htm
