var $grille = $("#grille");
var ROWS;
var COLS;
var timer;
var nb_mine = 0;
var tabmine;





// définir le nombre de bombes
// intégrer le timer
// réageancer le css

// CREATION DE GRILLE
function debutant() { // 9 cases et 10 mines
  start();
  nb_mine = 10;

  newGrille(9, 9);

}

function intermediaire() {
  start();// 16 cases et 40 mines
  nb_mine = 40;

  newGrille(16, 16);
}

function expert() {
  nb_mine = 100;

  //22 cases et 100 mines

  newGrille(22, 22);
  start();
}
function set_boat(i, j){


  switch (getRandomInt(4)) {
    case 1:
    for(var a = 0; a++ ; a < 4){
     if( $(`.col.hidden[data-row=${i+a}][data-col=${j}]`).hasClass("mine")){
     }else{
      $(`.col.hidden[data-row=${i+a}][data-col=${j}]`).addClass("boat");
    }
    }
    break;
  case 2 :
  for(var a = 0; a++ ; a < 4){
    if( $(`.col.hidden[data-row=${i-a}][data-col=${j}]`).hasClass("mine")){
    }else{
     $(`.col.hidden[data-row=${i-a}][data-col=${j}]`).addClass("boat");
   }
   }
  
  break;
  case 3:
  for(var a = 0; a++ ; a < 4){
    if( $(`.col.hidden[data-row=${i}][data-col=${j-a}]`).hasClass("mine")){
    }else{
     $(`.col.hidden[data-row=${i}][data-col=${j-a}]`).addClass("boat");
   }
   }
    break;
    case 4:  
    for(var a = 0; a++ ; a < 4){
      if( $(`.col.hidden[data-row=${i}][data-col=${j+a}]`).hasClass("mine")){
      }else{
       $(`.col.hidden[data-row=${i}][data-col=${j+a}]`).addClass("boat");
     }
     }
    break;

  }
}

function maitre() {
  start(); // 30 cases et 200 mines
  nb_mine = 250;
  newGrille(30, 30);
}
function translation_time(time_now) { // milliseconde -> seconde
  var minute, seconde, milliseconde;

  milliseconde = time_now % 1000;// determine le nombre de milliseconde
  seconde = ((time_now - milliseconde) / 1000) % 60;//determine le nombre de seconde
  minute = (time_now - milliseconde - seconde * 1000) / 60000;
  //determine sans dépasser  le seconde
  time_stamp = minute + " min <br>" + seconde + " s <br>" + milliseconde + " ms";
  document.getElementById("timer").innerHTML = time_stamp;
}
// TIMER
function start() {
  var time_now = 0;
  var startdate = Date.now();
  timer = setInterval(function () { time_now = Date.now() - startdate; translation_time(time_now); }, 50);
}

function restart() {
  clearInterval(timer);
  timer = 0;
  document.getElementById("timer").innerHTML = "";



}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}






// ALGO DE DEMINEUR
function newGrille(rows, cols) {
  var nbrofmine = 0;
  $grille.empty();// suprimer la grille

  for (var i = 0; i < rows; i++) {
    var $row = $("<div>").addClass("row");

    for (var j = 0; j < cols; j++) {
      var $col = $("<div>")
        .addClass("col hidden")
        .attr("data-row", i)
        .attr("data-col", j);

      if (getRandomInt(10) == 1 && nbrofmine < nb_mine) {
        nbrofmine++;
        $col.addClass("mine");

      }

      $row.append($col);
    }
    $grille.append($row);
  }
  while (nbrofmine < nb_mine) {
    rdm1 = getRandomInt(rows);
    rdm2 = getRandomInt(cols);
    if (!$(`.col.hidden[data-row=${rdm1}][data-col=${rdm2}]`).hasClass("mine")) {
      $(`.col.hidden[data-row=${rdm1}][data-col=${rdm2}]`).addClass("mine");
      nbrofmine++;
    }
    console.log($(`.col.hidden[data-row=${rdm1}][data-col=${rdm2}]`).hasClass("mine"));
  }
}



$grille.on("contextmenu", ".col.hidden", function () {

  var $case = $(this);

  $case.append(
    $("<i>").addClass("fa fa-flag")
  );


});

function gameOver(isWin) {
  var message = null;
  var icon = null;
  if (isWin) {
    message = "Waw t'es un boss!";
    icon = "fa fa-flag";
  } else {
    message = " T'es trop naze!";
    icon = "fa fa-bomb";
  }
 restart();

  $(".col.mine").append(
    $("<i>").addClass(icon)
  );
  $(".col:not(.mine)")
    .html(function () {
      var $case = $(this);
      var count = countMineAutour(
        $case.data("row"),
        $case.data("col"),
      );
      return count === 0 ? "" : count;
    })
  $(".col.hidden").removeClass("hidden");
  setTimeout(function () {
    alert(message);
  }, 1000);
}



function helper(i, j) {
  if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;

  var $case = $(`.col.hidden[data-row=${i}][data-col=${j}]`);
  var mineCount = countMineAutour(i, j);
  if (
    !$case.hasClass("hidden") ||
    $case.hasClass("mine")
  ) {
    return;
  }

  $case.removeClass("hidden");

  if (mineCount) {
    $case.text(mineCount);
    return;
  }

  if($case.hasClass("boat")){
var counter = 0;
  for (var di = -3; di <= 3; di++) {
    for (var dj = -2; dj <= 2; dj++) {

      if($(`.col.hidden[data-row=${i+di}][data-col=${j+dj}]`).hasClass("boat").not('.hidden')){
        counter++;
      if($(`.col.hidden[data-row=${i+di}][data-col=${j+dj}]`).hasClass("mine") && counter > 1 || counter == 4 ){
        for (var di = -3; di <= 3; di++) {
          for (var dj = -2; dj <= 2; dj++) {
        helper(i + di, j + dj);}
      }
      }
     
       
      }
    
    }
  }
}
}



function countMineAutour(i, j) {
  var count = 0;
  for (var di = -1; di <= 1; di++) { //decale
    for (var dj = -1; dj <= 1; dj++) {
      var ni = i + di;
      var nj = j + dj;
      if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
      var $case = $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
      if ($case.hasClass("mine")) count++;
    }
  }
  return count;
}

$grille.on("click", ".col.hidden", function () {
  var $case = $(this);
  var row = $case.data("row");
  var col = $case.data("col");

  if ($case.hasClass("mine")) {
    gameOver(false);
  } else {
    helper(row, col);
    var isGameOver = $(".col.hidden").length === $(".col.mine").length
    if (isGameOver) gameOver(true);
  }
})
