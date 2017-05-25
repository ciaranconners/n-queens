/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/
// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting
// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

var incorrectSolution = [
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0 ]
  ];

var hasAnyRowConflicts = function(rows) {
  for (let x of rows) {
    var sum = x.reduce(function(a, v) {
      return a + v;

    });
    if (sum > 1) {
      return true;
    }
  }
  return false;
};

var hasColConflictAt = function(colIndex, rows) {
  var counter = 0;
  for (let i = 0; i < rows.length; i++) {
    counter += rows[i][colIndex];
  }
  if (counter > 1) {
    return true;
  }
  return false;
};

var hasAnyColConflicts = function(rows) {
  for (let i = 0; i < rows.length; i++) {
    if (hasColConflictAt(i, rows)) {
      return true;
    }
  }
  return false;
};

var getFirstRowColumnIndexForMajorDiagonalOn = function(rowIndex, colIndex) {
  return colIndex - rowIndex;
};

var getFirstRowColumnIndexForMinorDiagonalOn = function(rowIndex, colIndex) {
  return colIndex + rowIndex;
};

var hasMajorDiagonalConflictAt = function(majorDiagonalColumnIndexAtFirstRow, rows) {
  var counter = 0;
  for (let i = 0; i < rows.length; i++) {
    for (let x = 0; x < rows[i].length; x++) {
      var index = getFirstRowColumnIndexForMajorDiagonalOn(i, x);
      if (rows[i][x] === 1 && index === majorDiagonalColumnIndexAtFirstRow) {
        counter++;
      }

    }
  }
  if (counter > 1) {
    return true;
  }
  return false;
};

var hasAnyMajorDiagonalConflicts = function(rows) {
  for (i = 0; i < rows.length; i++) {
    if (hasMajorDiagonalConflictAt(i, rows) || hasMajorDiagonalConflictAt(-i, rows)) {
      return true;
    }
  }
  return false;
};

var hasMinorDiagonalConflictAt = function(minorDiagonalColumnIndexAtFirstRow, rows) {
  var counter = 0;
  for (let i = 0; i < rows.length; i++) {
    for (let x = 0; x < rows[i].length; x++) {
      var index = getFirstRowColumnIndexForMinorDiagonalOn(i, x);
      if (rows[i][x] === 1 && index === minorDiagonalColumnIndexAtFirstRow) {
        counter++;
      }
    }
  }
  if (counter > 1) {
    return true;
  }
  return false;
};

var hasAnyMinorDiagonalConflicts = function(rows) {
  for (i = 0; i < rows.length * 2; i++) {
    if (hasMinorDiagonalConflictAt(i, rows) || hasMinorDiagonalConflictAt(-i, rows)) {
      return true;
    }
  }
  return false;
};

window.findNRooksSolution = function(n) {
  var solution = [];
  var possible = [];
  var recursiveRow = function(rows, set) {
    if (rows === 0) {
      var sum = set.reduce(function(a, v) {
        return a + v;
      });
      if (sum > 1 || sum === 0) {
        return;
      } else {
        possible.push(set);
        return;
      }
    }
    for (let i = 0; i < 2; i++) {
      recursiveRow(rows - 1, set.concat(i));
    }
  };
  recursiveRow(n, []);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return possible;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount;
  var possible = [];
  var boards = [];
  var recursiveRow = function(rows, set) {
    if (rows === 0) {
      var sum = set.reduce(function(a, v) {
        return a + v;
      });
      if (sum > 1 || sum === 0) {
        return;
      } else {
        possible.push(set);
        return;
      }
    }
    for (let i = 0; i < 2; i++) {
      recursiveRow(rows - 1, set.concat(i));
    }
  };
  var filter = function(boards) {
    var results = [];
    for (var i = 0; i < boards.length; i++) {
      /*if (hasAnyRowConflicts(arrays[i])) {
        arrays.splice(i, 1);
      }*/
      if (!hasAnyColConflicts(boards[i])) {
        results.push(boards[i]);
      }
      // if (hasAnyColConflicts(boards[i])) {
      //   boards.splice(i, 1);
      // }
    }
    return results;
  };
  var rowcombos = function(numberOfPossibilities, board) {
    if (numberOfPossibilities === 0) {
      boards.push(board);
      return;
    }
    for (var i = 0; i < possible.length; i++) {
      // board.concat(rowcombos(numberOfPossibilities-1, possible[i]));
      rowcombos(numberOfPossibilities - 1, board.concat([possible[i]])); // concat causes them to lose their brackets
    }
  };
  recursiveRow(n, []);
  rowcombos(possible.length, []);
  boards = filter(boards);

  solutionCount = boards.length;
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  if (n === 0) {
    return [];
  } else if (n === 2) {
    return [[0, 0], [0, 0]];
  } else if (n === 3) {
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }
  var solution = undefined;
  var possible = [];
  var boards = [];
  var recursiveRow = function(rows, set) {
    if (rows === 0) {
      var sum = set.reduce(function(a, v) {
        return a + v;
      });
      if (sum > 1 || sum === 0) {
        return;
      } else {
        possible.push(set);
        return;
      }
    }
    for (let i = 0; i < 2; i++) {
      recursiveRow(rows - 1, set.concat(i));
    }
  };

  var rowcombos = function(numberOfPossibilities, board) {
    if (numberOfPossibilities === 0) {
      boards.push(board);
      return;
    }
    for (var i = 0; i < possible.length; i++) {
      // board.concat(rowcombos(numberOfPossibilities-1, possible[i]));
      rowcombos(numberOfPossibilities - 1, board.concat([possible[i]])); // concat causes them to lose their brackets
    }
  };

  var filter = function(boards) {
    // var results = [];
    for (var i = 0; i < boards.length; i++) {
      /*if (hasAnyRowConflicts(arrays[i])) {
        arrays.splice(i, 1);
      }*/
      if (!hasAnyColConflicts(boards[i]) && !hasAnyMajorDiagonalConflicts(boards[i]) && !hasAnyMinorDiagonalConflicts(boards[i])) {
        //results.push(boards[i]);
        return boards[i];
      }
      // if (hasAnyColConflicts(boards[i])) {
      //   boards.splice(i, 1);
      // }
    }
  };


  recursiveRow(n, []);
  rowcombos(possible.length, []);
  solution = filter(boards);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  // return solution;
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 2 || n === 3) {
    return 0;
  } else if (n === 0) {
    return 1;
  }
  var solution;
  var possible = [];
  var boards = [];
  var recursiveRow = function(rows, set) {
    if (rows === 0) {
      var sum = set.reduce(function(a, v) {
        return a + v;
      });
      if (sum > 1 || sum === 0) {
        return;
      } else {
        possible.push(set);
        return;
      }
    }
    for (let i = 0; i < 2; i++) {
      recursiveRow(rows - 1, set.concat(i));
    }
  };

  var rowcombos = function(numberOfPossibilities, board) {
    if (numberOfPossibilities === 0) {
      boards.push(board);
      return;
    }
    for (var i = 0; i < possible.length; i++) {
      rowcombos(numberOfPossibilities - 1, board.concat([possible[i]]));
    }
  };

  var filter = function(boards) {
    var results = [];
    for (var i = 0; i < boards.length; i++) {
      if (!hasAnyColConflicts(boards[i]) && !hasAnyMajorDiagonalConflicts(boards[i]) && !hasAnyMinorDiagonalConflicts(boards[i])) {
        results.push(boards[i]);
      }
    }
    return results;
  };

  recursiveRow(n, []);
  rowcombos(possible.length, []);
  solution = filter(boards);
  console.log('Single solution for ' + n + ' queens:');
  return solution.length;
};