import { ElementsPrototype } from "../utils/ElementPrototype";
import { Format } from "../utils/Format";

export class BattleShipsController {
  constructor() {
    ElementsPrototype.run();
    Format.loadElements(this);
    this.initEvents();
  }

  initEvents() {
    const userSquares = [];
    const computerSquares = [];
    let isHorizontal = true;
    const width = 10;

    //ShipCotainers
    const destroyer = this.el.destroyer;
    const submarine = this.el.submarine;
    const cruiser = this.el.cruiser;
    const battleship = this.el.battleship;
    const carrier = this.el.carrier;
    const userGrid = this.el.userGrid;
    const computerGrid = this.el.computerGrid;
    const displayGrid = this.el.displayGrid;

    let ships = this.el.displayGrid.querySelectorAll(".ship");

    this.createBoards(userGrid, userSquares, width);
    this.createBoards(computerGrid, computerSquares, width);

    //Ships
    const shipArray = [
      {
        name: "destroyer",
        directions: [
          [0, 1],
          [0, width],
        ],
      },
      {
        name: "submarine",
        directions: [
          [0, 1, 2],
          [0, width, width * 2],
        ],
      },
      {
        name: "cruiser",
        directions: [
          [0, 1, 2],
          [0, width, width * 2],
        ],
      },
      {
        name: "battleship",
        directions: [
          [0, 1, 2, 3],
          [0, width, width * 2, width * 3],
        ],
      },
      {
        name: "carrier",
        directions: [
          [0, 1, 2, 3, 4],
          [0, width, width * 2, width * 3, width * 4],
        ],
      },
    ];

    //Draw the computers ships in random locations
    function generateComputerShips(ship) {
      let direction;
      let randomDirection = Math.floor(Math.random() * ship.directions.length);
      let current = ship.directions[randomDirection];

      if (randomDirection === 0) direction = 1;
      if (randomDirection === 1) direction = 10;
      let randomStart = Math.abs(
        Math.floor(
          Math.random() * computerSquares.length -
            ship.directions[0].length * direction
        )
      );

      const isTaken = current.some((index) =>
        computerSquares[randomStart + index].classList.contains("taken")
      );
      const isAtRightEdge = current.some(
        (index) => (randomStart + index) % width === width - 1
      );
      const isAtLeftEdge = current.some(
        (index) => (randomStart + index) % width === 0
      );

      if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
        current.forEach((index) =>
          computerSquares[randomStart + index].classList.add("taken", ship.name)
        );
      } else {
        generateComputerShips(ship);
      }
    }

    generateComputerShips(shipArray[0]);
    generateComputerShips(shipArray[1]);
    generateComputerShips(shipArray[2]);
    generateComputerShips(shipArray[3]);
    generateComputerShips(shipArray[4]);

    //Rotate the ships
    function rotate() {
      if (isHorizontal) {
        destroyer.classList.toggle("destroyer-container-vertical");
        submarine.classList.toggle("submarine-container-vertical");
        cruiser.classList.toggle("cruiser-container-vertical");
        battleship.classList.toggle("battleship-container-vertical");
        carrier.classList.toggle("carrier-container-vertical");
        isHorizontal = false;
        return;
      }
      if (!isHorizontal) {
        destroyer.classList.toggle("destroyer-container-vertical");
        submarine.classList.toggle("submarine-container-vertical");
        cruiser.classList.toggle("cruiser-container-vertical");
        battleship.classList.toggle("battleship-container-vertical");
        carrier.classList.toggle("carrier-container-vertical");
        isHorizontal = true;
        return;
      }
    }

    this.el.rotateButton.on("click", rotate);

    //Move arround user ship
    ships.forEach((ship) => ship.on("dragstart", dragStart));
    userSquares.forEach((square) => square.on("dragstart", dragStart));
    userSquares.forEach((square) => square.on("dragover", dragOver));
    userSquares.forEach((square) => square.on("dragenter", dragEnter));
    userSquares.forEach((square) => square.on("dragleave", dragLeave));
    userSquares.forEach((square) => square.on("drop", dragDrop));
    userSquares.forEach((square) => square.on("dragend", dragEnd));

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach((ship) =>
      ship.on("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
      })
    );

    function dragStart(e) {
      draggedShip = this;
      draggedShipLength = [...this.childNodes].filter(
        (element) => element.nodeName !== "#text"
      ).length;
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
    }

    function dragLeave() {
      // console.log('drag leave')
    }

    function dragDrop() {
      // let allShipsPlaced;
      let shipNameWithLastId = draggedShip.lastElementChild.id;
      let shipClass = shipNameWithLastId.slice(0, -2);
      let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
      let shipLastId = lastShipIndex + parseInt(this.dataset.id);

      const notAllowedVertical = [
        99,
        98,
        97,
        96,
        95,
        94,
        93,
        92,
        91,
        90,
        89,
        88,
        87,
        86,
        85,
        84,
        83,
        82,
        81,
        80,
        79,
        78,
        77,
        76,
        75,
        74,
        73,
        72,
        71,
        70,
        69,
        68,
        67,
        66,
        65,
        64,
        63,
        62,
        61,
        60,
      ];

      let newNotAllowedVertical = notAllowedVertical.splice(
        0,
        10 * lastShipIndex
      );

      let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
      shipLastId = shipLastId - selectedShipIndex;

      const preFillSquare = [];
      if (!isHorizontal) {
        for (let i = 0; i < draggedShipLength; i++) {
          if (selectedShipIndex === 0) {
            preFillSquare.push(parseInt(this.dataset.id) + width * i);
          } else {
            preFillSquare.push(
              parseInt(this.dataset.id) + width * i - selectedShipIndex * 10
            );
          }
        }
      }

      if (
        isHorizontal &&
        allowHorizontal(this.dataset.id, shipLastId, selectedShipIndex)
      ) {
        for (let i = 0; i < draggedShipLength; i++) {
          const squareSelected =
            userSquares[parseInt(this.dataset.id) - selectedShipIndex + i];
          if (squareSelected.classList.value.includes("taken")) {
            return;
          }
          squareSelected.classList.add("taken", shipClass);
        }
      } else if (
        !isHorizontal &&
        allowVertical(this.dataset.id, selectedShipIndex, preFillSquare)
      ) {
        const filled = preFillSquare.some((position) =>
          userSquares[position].classList.value.includes("taken")
        );
        if (!filled) {
          preFillSquare.forEach((position) => {
            userSquares[position].classList.add("taken", shipClass);
          });
        }
      } else return;

      displayGrid.removeChild(draggedShip);
    }

    function allowHorizontal(
      positionSelected,
      lastPositionSquare,
      selectedShipIndex
    ) {
      const firtsDigit = parseInt(positionSelected.charAt(0));
      const sizePosition = positionSelected.length;
      positionSelected = parseInt(positionSelected);

      const firstRowPosition = (firtsDigit + 1) * 10 - 10;
      const lastRowPosition = (firtsDigit + 1) * 10 - 1;

      if (sizePosition === 1 && lastPositionSquare <= 10) {
        return true;
      } else if (
        sizePosition === 2 &&
        positionSelected - selectedShipIndex >= firstRowPosition &&
        lastPositionSquare <= lastRowPosition
      ) {
        return true;
      }

      return false;
    }

    function allowVertical(positionSelected, selectedShipIndex, preFillSquare) {
      const sizePosition = positionSelected.length;

      if (sizePosition === 1 && selectedShipIndex === 0) {
        return true;
      } else if (
        sizePosition === 2 &&
        preFillSquare.every((position) => position <= 99)
      ) {
        return true;
      }

      return false;
    }

    function dragEnd() {
      // console.log('dragend')
    }

    this.el.startButton.on("click", (e) => {
      e.preventDefault();
    });
  }

  createBoards(grid, squares, width) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }
}
