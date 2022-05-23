const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const book = document.querySelector(".book");
const successModal = document.querySelector("#modal");

//Iterable
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let i = this.start;
    return {
      next: () => {
        if (i > this.end) return { done: true };
        const value = i;
        i += this.step;
        return { value };
      },
    };
  }
}

populateUI();
let ticketPrice = +movieSelect.value;

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

//create seats
function createSeats() {
  for (let i of new Range(1, 5)) {
    const rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row");
    container.appendChild(rowDiv);
  }

  document.querySelectorAll(".row").forEach((row, row_index) => {
    for (let i of new Range(1, 8)) {
      const seatDiv = document.createElement("div");
      seatDiv.setAttribute("class", `seat`);

      seatDiv.setAttribute("id", `row_${row_index}_col_${i}`);
      row.appendChild(seatDiv);
    }
  });
}

createSeats();

//book
book.onclick = () => {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  if (selectedSeats.length) {
    successModal.showModal();
  } else {
    alert("Select seats first");
  }
};

// update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatsIndex = [...selectedSeats].map((seat) => {
    const seat_id = seat.id;
    const row = +seat_id.split("_")[1];
    const col = +seat_id.split("_")[3];
    console.log(row, col);
    // return [...seats].indexOf(seat);
    return {row,col}
  });

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  //copy selected seats into arr
  // map through array
  //return new array of indexes

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
}

// get data from localstorage and populate ui
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Movie select event
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// intial count and total
updateSelectedCount();
