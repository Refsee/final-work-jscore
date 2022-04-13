$(function () {
  const posPazzle = [
    "0px 0px",
    "-100px 0px",
    "-200px 0px",
    "-300px 0px",
    "0px -100px",
    "-100px -100px",
    "-200px -100px",
    "-300px -100px",
    "0px -200px",
    "-100px -200px",
    "-200px -200px",
    "-300px -200px",
    "0px -300px",
    "-100px -300px",
    "-200px -300px",
    "-300px -300px",
  ];

  let flag = true;
  let time = 60;
  let timeInterval;

  createPuzzle();
  addDragDrop();

  $(".btn-start").on("click", startGame );
  $(".btn-result").on("click", openModal);
  $(".btn-new").on("click", newGame );

  $(".btn-close").on("click", closeModal);
  $(".btn-check").on("click", checkResult);

  function createPuzzle() {
    let positionPazzle = [...posPazzle];
    for (let i = 0; i < 16; i++) {
      const el = positionPazzle.splice(i, 1)[0];
      const index = Math.floor(Math.random() * 16);
      positionPazzle.splice(index, 0, el);
    }
    
    const boxForPuzzle = $(".start .box");
    for (let i = 0; i < 16; i++) {
      $('<div class="puzzle"></div>').appendTo(boxForPuzzle[i]);
      $(".start .box .puzzle")[i].style.backgroundPosition = positionPazzle[i];
    }
  }

  function addDragDrop() {
    $(".puzzle").draggable({ containment: ".drag-container", revert: true, revertDuration: 0,
      start: function () {
        $(this).addClass("z-max");
      },
      stop: function () {
        $(this).removeClass("z-max");
      },
    });

    $(".end .box").droppable({
      over: function () {
        $(this).addClass("hover");
      },
      out: function () {
        $(this).removeClass("hover");
      },
      drop: function (event, ui) {
        if ($(this)[0].children.length == 0) {
          $(this).append(ui.draggable);
          $(this).removeClass("hover");
        }
        if (flag)startGame()
      },
    });
  }

  function startGame() {
    flag = false;
    timeInterval = setInterval(timer, 1000);
    $(".btn-start").attr("disabled", "true");
    $(".btn-result").removeAttr("disabled");
  }

  function newGame() {
    flag = true;
    $(".btn-result").attr("disabled", "true");
    $(".btn-start").removeAttr("disabled");
    removePuzzle();
    createPuzzle();
    addDragDrop();
    resetGame();
  }

  function timer() {
    time--;
    let str = `00:${time > 9 ? time : "0" + time}`;
    $(".time").text(str);
    $(".time-modal").text(str);
    if (time == 0) {
      clearInterval(timeInterval);
      openModal();
      checkResult();
    }
  }

  function resetGame() {
    clearInterval(timeInterval);
    time = 60;
    $(".time").text("01:00");
    $(".modal h2").text("You still have time, you sure? ");
    $(".modal h2").append('<span class="time-modal">01:00</span>');
  }

  function removePuzzle() {
    $(".end .box .puzzle").remove();
    $(".start .box .puzzle").remove();
  }


  function checkResult() {
    clearInterval(timeInterval);
    let puzzle = $(".end .box .puzzle");
    if (puzzle.length == 16) {
      for (let i = 0; i < 16; i++) {
        if (puzzle[i].style.backgroundPosition != posPazzle[i]) {
          $(".modal h2").text("It's a pity, but you lost");
          break;
        } else {
          $(".modal h2").text("Woohoo, well done, you did it!");
        }
      }
    } else {
      $(".modal h2").text("It's a pity, but you lost");
    }
    $(".btn-check").removeClass("btn-hide");
    $(".btn-start").attr("disabled", "true");
    $(".btn-result").attr("disabled", "true");
  }

  function openModal() {
    $(".modal-container").addClass("hide");
  }

  function closeModal() {
    $(".modal-container").removeClass("hide");
    $(".btn-check").addClass("btn-hide");
  }
});
