///souris///
//curseur
const customCursor = document.getElementById("custom-cursor") as HTMLDivElement;

// position curseur
window.addEventListener("mousemove", (Event: MouseEvent) => {
    customCursor.style.left = Event.clientX + "px";
    customCursor.style.top = Event.clientY + "px";
});

// animation curseur
window.addEventListener("mousedown", () => {
    customCursor.classList.add("clicked");
});
window.addEventListener("mouseup", () => {
    customCursor.classList.remove("clicked");
});

///animation des taupes///
// selection trous + taupes
const holes = document.querySelectorAll(".hole") as NodeListOf<HTMLDivElement>;
const startButton = document.getElementById(
    "start-button"
) as HTMLButtonElement;
const speed = 1000;

let moleAnimationId: number | null = null;

function showRandomMole() {
    //reinit
    holes.forEach((hole) => {
        hole.classList.remove("mole");
    });

    //choisi le trou
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    randomHole.classList.add("mole");
}

//demarrage
function startGame() {
    if (moleAnimationId) {
        clearInterval(moleAnimationId);
    }

    moleAnimationId = setInterval(showRandomMole, speed);
}

startButton.addEventListener("click", startGame);

