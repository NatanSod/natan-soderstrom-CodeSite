class Stat {
  stat;
  score;
  E_score;
  bonus;
  E_bonus;

  constructor(score, stat) {
    this.stat = stat;
    this.score = score;
    // I am cool! Instead of dividing by 2 and rounding down I instead bit-shifted to the right!
    // It's cool because it does both in one and is less computationally demanding! (Or so I hear)
    this.bonus = (score >> 1) - 5;
    this.E_score = document.getElementById(`${stat}-score`);
    console.log(this.E_score);
    this.E_bonus = document.getElementById(`${stat}-bonus`);
    this.Update();
  }

  Update() {
    this.bonus = (this.score >> 1) - 5;
    this.E_score.innerHTML = this.score;
    this.E_bonus.innerHTML =
      this.bonus >= 0 ? `+${this.bonus}` : `${this.bonus}`;
  }

  ChangeTo(value) {
    this.score = value;
    this.Update();
  }

  static Roll() {
    let sum = 0;
    let lowest = 0;

    for (let i = 0; i < 4; i++) {
      let roll = Dice.Roll(1, 6);
      if (roll < lowest || lowest === 0) {
        sum += lowest;
        lowest = roll;
      } else {
        sum += roll;
      }
    }

    return sum;
  }
}

class Character {
  name;
  str = new Stat(10, "str");
  dex = new Stat(10, "dex");
  con = new Stat(10, "con");
  int = new Stat(10, "int");
  wis = new Stat(10, "wis");
  cha = new Stat(10, "con");

  constructor() {}

  AssignStat(score, name) {
    switch (name) {
      case "str":
        this.str.ChangeTo(score);
        break;
      case "dex":
        this.dex.ChangeTo(score);
        break;
      case "con":
        this.con.ChangeTo(score);
        break;
      case "int":
        this.int.ChangeTo(score);
        break;
      case "wis":
        this.wis.ChangeTo(score);
        break;
      case "cha":
        this.cha.ChangeTo(score);
        break;
    }    
  }  

  static from(json) {
    return Object.assign(new Character(), json);
  }  

  ayp() {
    console.log("a");
  }  
}  

let currentCharacter = new Character();
// currentCharacter = Character.from(insert json here);
// ------------------------------------------------------------ Roll Dice Buttons and Pop-Up ---------------------------------------------------------

class Dice {
  static Roll(amount, dice) {
    let result = 0;
    for (let i = 0; i < amount; i++) {
      result = Math.floor(Math.random() * dice + 1);
    }
    return result;
  }

  static currentRollResult = 0;
  static resultElement;

  static popUp = document.getElementById("roll-dice-popup");
  static rollDisplay = document.getElementById("display-roll-results");

  static genericRoll = document.getElementById("generic-roll");

  static Display() {
    Dice.currentRollResult = 0;
    Dice.rollDisplay.innerHTML = "";

    Dice.resultElement = document.createElement("h1");
    Dice.resultElement.innerHTML = `${Dice.currentRollResult} = `;
    Dice.rollDisplay.appendChild(Dice.resultElement);

    Dice.popUp.classList.remove("hidden");
  }

  static UpdateResult() {
    Dice.resultElement.innerHTML = `${Dice.currentRollResult} = `;
  }

  static closePopUp = document.getElementById("roll-dice-close");

  static Hide() {
    Dice.popUp.classList.add("hidden");
  }

  static AddRoll(Sides, Amount, Title) {
    for (let i = 0; i < Amount; i++) {
      const roll = Dice.Roll(1, Sides);

      let container = document.createElement("div");
      let title = document.createElement("p");
      let dice = document.createElement("p");
      let result = document.createElement("h1");

      Dice.rollDisplay.appendChild(container);
      container.classList.add("center");
      container.appendChild(title);
      title.innerHTML = Title;
      container.appendChild(result);
      result.innerHTML = roll;
      container.appendChild(dice);
      dice.innerHTML = `(${Sides})`;

      Dice.currentRollResult += roll;
    }
    Dice.UpdateResult();
  }

  static AddBonus(Bonus, Title) {
    let container = document.createElement("div");
    let title = document.createElement("p");
    let bonus = document.createElement("h1");

    Dice.rollDisplay.appendChild(container);
    container.classList.add("center");
    container.appendChild(title);
    title.innerHTML = Title;
    container.appendChild(bonus);
    if (Bonus >= 0) {
      bonus.innerHTML = `+${Bonus}`;
    } else {
      bonus.innerHTML = Bonus;
    }
    Dice.currentRollResult += Bonus;
    Dice.UpdateResult();
  }
}

Dice.genericRoll.addEventListener("click", function () {
  Dice.Display();
  Dice.AddRoll(20, 1, "Ayo");
  Dice.AddBonus(currentCharacter.str.bonus, "Str Bonus");
});

Dice.closePopUp.addEventListener("click", Dice.Hide);

// ------------------------------------------------------------ Assign Stats From Dice Pop-Up --------------------------------------------------------

let changeStats = document.getElementById("change-stats");
changeStats.addEventListener("click", ShowChangeStats);

let closeStats = document.getElementById("roll-stats-close");
closeStats.addEventListener("click", HideChangeStats);

let rollPopupWindow = document.getElementById("roll-stats-popup");

let statHolders = [];
let choseStats = [];
for (let i = 1; i <= 6; i++) {
  statHolders.push(document.getElementById(`stat${i}show`));
  choseStats.push(document.getElementById(`stat${i}`));
}

choseStats[0].addEventListener("input", UpdateOptions);
choseStats[1].addEventListener("input", UpdateOptions);
choseStats[2].addEventListener("input", UpdateOptions);
choseStats[3].addEventListener("input", UpdateOptions);
choseStats[4].addEventListener("input", UpdateOptions);
choseStats[5].addEventListener("input", UpdateOptions);

let rollStatsButton = document.getElementById("roll-stats");
rollStatsButton.addEventListener("click", RollNewStats);

let acceptStatsButton = document.getElementById("accept-stats");
acceptStatsButton.addEventListener("click", function () {
  AcceptStats();
});

let rolledStats = [];

function ShowChangeStats() {
  rollPopupWindow.classList.remove("hidden");
  if (rolledStats.length === 0) {
    RollNewStats();
    UpdateOptions();
  }
}
function HideChangeStats() {
  rollPopupWindow.classList.add("hidden");
}

function RollNewStats() {
  rolledStats = [];
  for (let i = 0; i < statHolders.length; i++) {
    let roll = Stat.Roll();
    rolledStats.push(roll);
    statHolders[i].innerHTML = roll;
  }
}

function AcceptStats() {
  for (let i = 0; i < rolledStats.length; i++) {
    currentCharacter.AssignStat(rolledStats[i], choseStats[i].value);
  }
  rollPopupWindow.classList.add("hidden");
}

function UpdateOptions() {
  let availableStats = ["str", "dex", "con", "int", "wis", "cha"];

  choseStats.forEach((choice) => {
    // If a choice has been made, then all other options will be temporarily removed from that select element.
    // The selected option will also be removed from the "availableStats" array.
    if (choice.value != "--") {
      // If the chosen option is removed then it would be instantly unselected.
      availableStats.splice(availableStats.indexOf(choice.value), 1);

      for (let i = 0; i < choice.options.length; i++) {
        if (choice.options[i].value != choice.value) {
          choice.options.remove(i);
          i--;
        }
      }
    }
    // If a choice hasn't been made, then all options will be temporarily removed from that select element.
    else {
      choice.options.length = 0;
    }
  });
  // Every selected option has now been removed from the "availableStats" array,
  // leaving only the unselected ones.
  console.log(availableStats);

  // Add back every option which hasn't been selected.
  choseStats.forEach((choice) => {
    // The "no option selected" option isn't in the "availableStats" array, so it needs to be added "manually".
    var option = document.createElement("option");
    option.value = "--";
    option.innerHTML = "--";
    choice.appendChild(option);
    availableStats.forEach((stat) => {
      var option = document.createElement("option");
      option.value = stat;
      option.innerHTML = stat;
      choice.appendChild(option);
    });
  });

  if (availableStats.length === 0) {
    acceptStatsButton.classList.remove("hidden");
  } else {
    acceptStatsButton.classList.add("hidden");
  }
}
