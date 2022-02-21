let str = {
  score: 0,
  E_score: document.getElementById("str-score"),
  bonus: 0,
  E_bonus: document.getElementById("str-bonus"),
};

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
    this.UpdateStats();
  }

  UpdateStats() {
    this.bonus = (this.score >> 1) - 5;
    this.E_score.innerHTML = this.score;
    this.E_bonus.innerHTML =
      this.bonus >= 0 ? `+${this.bonus}` : `${this.bonus}`;
  }

  ChangeTo(value) {
    this.score = value;
    this.UpdateStats();
  }

  static Roll() {
    let sum = 0;
    let lowest = 0;

    for (let i = 0; i < 4; i++) {
      let roll = RollDice(1, 6);
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

function RollDice(amount, dice) {
  let result = 0;
  for (let i = 0; i < amount; i++) {
    result = Math.floor(Math.random() * dice + 1);
  }
  return result;
}

// ------------------------------------------------------------ Roll Dice Buttons and Pop-Up ---------------------------------------------------------

const RollType = {
  Skill: 0,
  Save: 1,
  Proficiency: 2,
};

let currentRollResult = 0;
let resultElement;

let rollPopUp = document.getElementById("roll-dice-popup");
let rollDisplay = document.getElementById("display-roll-results");

let genericRoll = document.getElementById("generic-roll");
genericRoll.addEventListener("click", function(){
  DisplayRoll();
  AddDiceRoll(20, 1, "Ayo")
  AddRollBonus(2, "Str Bonus")
});

function DisplayRoll() 
{
  currentRollResult = 0;
  rollDisplay.innerHTML = "";

  resultElement = document.createElement("h1");
  resultElement.innerHTML = `${currentRollResult} = `;
  rollDisplay.appendChild(resultElement);

  rollPopUp.classList.remove("hidden");
}

function UpdateResult() 
{
  resultElement.innerHTML = `${currentRollResult} = `;
}

let closeRollPopUp = document.getElementById("roll-dice-close");
closeRollPopUp.addEventListener("click", HideRoll);

function HideRoll() {
  rollPopUp.classList.add("hidden");
}

function AddDiceRoll(Sides, Amount, Title) 
{
  for (let i = 0; i < Amount; i++) {
    const roll = RollDice(1, Sides);

    let container = document.createElement("div");
    let title = document.createElement("p");
    let dice = document.createElement("p");
    let result = document.createElement("h1");
    
    rollDisplay.appendChild(container);
    container.classList.add("center");
    container.appendChild(title);
    title.innerHTML = Title;
    container.appendChild(result);
    result.innerHTML = roll;
    container.appendChild(dice);
    dice.innerHTML = `(${Sides})`;

    currentRollResult += roll;
  }
  UpdateResult();
}

function AddRollBonus(Bonus, Title)
{
  let container = document.createElement("div");
    let title = document.createElement("p");
    let bonus = document.createElement("h1");
    
    rollDisplay.appendChild(container);
    container.classList.add("center");
    container.appendChild(title);
    title.innerHTML = Title;
    container.appendChild(bonus);
    if (Bonus <= 0) {
      bonus.innerHTML = `+${Bonus}`;
    }
    else 
    {
      bonus.innerHTML = Bonus;
    }
    currentRollResult += Bonus;
    UpdateResult();
}

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
acceptStatsButton.addEventListener("click", AcceptStats);

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
    new Stat(rolledStats[i], choseStats[i].value);
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
