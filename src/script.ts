const gameConfig = {
    gameDuration: 60,
    moleSpeed: 800,
    countdownSpeed: 1000,
    hitStunDuration: 1000,
};

class Game {
    //variables invisibles
    private score: number;
    private timeLeft: number;
    private isGameActive: boolean;
    private moleTimerId: number | null;
    private countdownTimerId: number | null;

    //variables visibles
    private scoreBoard: HTMLElement | null;
    private timeLeftDisplay: HTMLElement | null;
    private startButton: HTMLElement | null;
    private holes: NodeListOf<HTMLDivElement>;
    private stunnedMole: Set<string>;

    constructor() {
        //variables
        this.score = 0;
        this.timeLeft = gameConfig.gameDuration;
        this.isGameActive = false;
        this.moleTimerId = null;
        this.countdownTimerId = null;
        this.stunnedMole = new Set();

        //DOM
        this.scoreBoard = document.getElementById("score");
        this.timeLeftDisplay = document.getElementById("time-left");
        this.startButton = document.getElementById("start-button");
        this.holes = document.querySelectorAll(".hole");

        //gestion des erreurs
        if (!this.scoreBoard || !this.timeLeftDisplay || !this.startButton) {
            throw new Error("Rechagez la page, et vérifiez vos extentions");
        }

        //si clique sur start game, alors ont écoute les cliques sur chaques trous
        this.startButton.addEventListener("click", this.startGame.bind(this));
        this.holes.forEach((hole) =>
            hole.addEventListener("click", this.whack.bind(this, hole))
        );
    }

    public startGame(): void {
        //init
        this.score = 0;
        this.timeLeft = gameConfig.gameDuration;
        this.isGameActive = true;

        if (this.scoreBoard) this.scoreBoard.textContent = this.score.toString();
        if (this.timeLeftDisplay)
            this.timeLeftDisplay.textContent = this.timeLeft.toString();

        //nettoyage
        if (this.moleTimerId) clearInterval(this.moleTimerId);
        if (this.countdownTimerId) clearInterval(this.countdownTimerId);

        //timers
        this.moleTimerId = setInterval(
            this.showRandomMole.bind(this),
            gameConfig.moleSpeed
        );
        this.countdownTimerId = setInterval(
            this.countDown.bind(this),
            gameConfig.countdownSpeed
        );
    }

    private showRandomMole(): void {
        this.holes.forEach((hole) => hole.classList.remove("mole"));

        const avaibleHoles = Array.from(this.holes).filter(hole => !this.stunnedMole.has(hole.id)); 

        if (avaibleHoles.length > 0) {
            const randomHole = avaibleHoles[Math.floor(Math.random() * avaibleHoles.length)];
            randomHole.classList.add("mole");
        }
    }

    private whack(hole: HTMLDivElement): void {
        if (!this.isGameActive || !hole.classList.contains("mole")) {
            return;
        }

        this.score++;
        if (this.scoreBoard) this.scoreBoard.textContent = this.score.toString();
        hole.classList.remove("mole");
        hole.classList.add("mole-hit");
        this.stunnedMole.add(hole.id);

        setTimeout(() => {
            hole.classList.remove("mole-hit");
            this.stunnedMole.delete(hole.id);
        }, gameConfig.hitStunDuration);

        if (this.moleTimerId) clearInterval(this.moleTimerId);
        this.moleTimerId = setInterval(this.showRandomMole.bind(this), gameConfig.moleSpeed);
        this.showRandomMole();
    }

    private countDown(): void {
        this.timeLeft--;
        if (this.timeLeftDisplay) this.timeLeftDisplay.textContent = this.timeLeft.toString();

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    private endGame(): void {
        if (this.countdownTimerId) clearInterval(this.countdownTimerId);
        if (this.moleTimerId) clearInterval(this.moleTimerId);
        this.isGameActive = false;

        alert("Partie terminée ! Votre score : " + this.score);
        this.holes.forEach((hole) => hole.classList.remove("mole"));
    }
}

//lancement
const tapeTaupeGame = new Game();

//souris
const customCursor: HTMLElement | null =
    document.getElementById("custom-cursor");

if (customCursor) {
    window.addEventListener("mousemove", (Event: MouseEvent) => {
        customCursor.style.left = Event.clientX + "px";
        customCursor.style.top = Event.clientY + "px";
    });

    window.addEventListener("mousedown", () => {
        customCursor.classList.add("clicked");
        setTimeout(() => {
            customCursor.classList.remove("clicked");
        }, 100);
    });
}


////BROUILLON TS en logique non objet
// let score: number = 0;
// let timeLeft: number = 60;
// let hitPosition: string | null = null;
// let gameTimerId: number | null = null;
// let moleTimerId: number | null = null;
// let countdownTimerId: number | null = null;
// let isGameActive: boolean = false;

// const scoreBoard: HTMLElement | null = document.getElementById("score");
// const timeLeftDisplay: HTMLElement | null = document.getElementById("time-left");
// const startButton: HTMLElement | null = document.getElementById("custom-cursor");

// ///souris///
// //curseur
// const customCursor: HTMLElement | null =
//   document.getElementById("custom-cursor");

// // position curseur
// if (customCursor) {
//   window.addEventListener("mousemove", (Event: MouseEvent) => {
//     customCursor.style.left = Event.clientX + "px";
//     customCursor.style.top = Event.clientY + "px";
//   });

//   // animation curseur

//   window.addEventListener("mousedown", () => {
//     customCursor.classList.add("clicked");
//     setTimeout(() => {
//       customCursor.classList.remove("clicked");
//     }, 100);
//   });
// }

// ///animation des taupes///
// // selection trous + taupes
// const holes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".hole");
// const startButton: HTMLElement | null = document.getElementById("start-button");
// const speed = 1000;

// let moleAnimationId: number | null = null;

// function showRandomMole() {
//   //reinit
//   holes.forEach((hole) => {
//     hole.classList.remove("mole");
//   });

//   //choisi le trou
//   const randomIndex = Math.floor(Math.random() * holes.length);
//   const randomHole = holes[randomIndex];

//   randomHole.classList.add("mole");
// }

// //demarrage
// function startGame() {
//   if (moleAnimationId) {
//     clearInterval(moleAnimationId);
//   }

//   moleAnimationId = setInterval(showRandomMole, speed);
// }

// startButton.addEventListener("click", startGame);

// holes.forEach((hole) => {
//   hole.addEventListener("click", () => {
//     if (hole.classList.contains("mole")) {
//       hole.classList.remove("mole");
//     }
//   });
// });
