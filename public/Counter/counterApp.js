// set inital value to zero
let count = 20;
// select value and buttons
const value = document.querySelector("#value");
const value2 = document.querySelector("#value")
const btns = document.querySelectorAll(".btn");

btns.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    const styles = e.currentTarget.classList;
    if (styles.contains("decrease")) {
      count--;
    } else if (styles.contains("increase")) {
      count++;
    } else if (styles.contains("reset")) {
      count = 20;
    } else if (styles.contains("godown")) {
      count--;
    } else if (styles.contains("goup")) {
      count++;
    } else if (styles.contains("startover")) {
      count = 20;
    }

    if (count > 0) {
      value.style.color = "green";
    }
    if (count < 0) {
      value.style.color = "red";
    }
    if (count === 0) {
      value.style.color = "#222";
    }
    value.textContent = count;
  });
});
