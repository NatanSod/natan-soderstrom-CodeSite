// @ts-check

// You may wonder "Why is there comments on both sides of the code that if they weren't comments would put everything in a giant function?"
// Well, it's a little trick I learnt when trying to "hack a website"
// (It was a challenge that was advertise by the website itself, so they knew people would be doing it and I didn't do anything illegal)
// When it is written like this, it is impossible for a user to access functions and variables through the console,
// which is why I currently have them commented out for debug purposes
//(function () {
  /**
   * @param {Element | Node} oldElement 
   */
function ResetElement(oldElement) {
  let newElement = oldElement.cloneNode(true);
  oldElement.parentNode.replaceChild(newElement, oldElement);
  return newElement;
}

const listOfSkills = [
  { name: "Acrobatics", stat: "dex" },
  { name: "Animal-Handling", stat: "wis" },
  { name: "Arcana", stat: "int" },
  { name: "Athletics", stat: "str" },
  { name: "Deception", stat: "cha" },
  { name: "History", stat: "int" },
  { name: "Insight", stat: "wis" },
  { name: "Intimidation", stat: "cha" },
  { name: "Investigation", stat: "int" },
  { name: "Medicine", stat: "wis" },
  { name: "Nature", stat: "int" },
  { name: "Perception", stat: "wis" },
  { name: "Performance", stat: "cha" },
  { name: "Persuasion", stat: "cha" },
  { name: "Religion", stat: "int" },
  { name: "Sleight-of-Hand", stat: "dex" },
  { name: "Stealth", stat: "dex" },
  { name: "Survival", stat: "wis" },
];

class Stat {
  owner;
  name;
  score;
  E_score;
  bonus;
  E_bonus;
  /** @type {Element | Node} */
  E_roll;

  save;
  saveProf = false;
  E_save;
  /** @type {Element | Node} */
  E_saveRoll;

  /**
   * @param {Character} owner
   * @param {number} score 
   * @param {string} stat 
   * @param {{skills: string[], saves: string[], items: string[]}} profs 
   * @param {{bonus: number, base: number}} profMod 
   */
  constructor(owner, score, stat, profs, profMod) {
    this.owner = owner
    this.name = stat;
    this.score = score;
    // I am cool! Instead of dividing by 2 and rounding down I instead bit-shifted to the right!
    // It's cool because it does both in one and is less computationally demanding! (Or so I hear)
    this.bonus = (score >> 1) - 5;

    this.E_score = document.querySelector(`#${stat}-score`);
    this.E_bonus = document.querySelector(`#${stat}-bonus`);
    this.E_roll = document.querySelector(`#${stat}-roll`);
    this.E_save = document.querySelector(`#${stat}-save`);
    this.E_saveRoll = document.querySelector(`#${stat}-save-roll`);

    this.E_roll = ResetElement(this.E_roll);
    this.E_roll.addEventListener("click", this.RollStat.bind(this));

    this.saveProf = profs.saves.includes(this.name);
    this.save = this.bonus + (this.saveProf ? profMod.bonus : profMod.base);
    console.log(profs.saves);
    if (this.saveProf) {
      document.querySelector(`#${stat}-prof`).classList.add("has");
    }
    
    this.E_saveRoll = ResetElement(this.E_saveRoll);
    this.E_saveRoll.addEventListener('click', this.RollSave.bind(this));

    this.Update();
  }

  Update() {
    this.E_score.innerHTML = this.score.toString();
    this.E_bonus.innerHTML =
      this.bonus >= 0 ? `+${this.bonus}` : `${this.bonus}`;
    this.E_save.innerHTML = this.save.toString();
    
  }

  /**
   * @param {number} value 
   */
  ChangeTo(value) {
    this.score = value;
    this.bonus = (this.score >> 1) - 5;
    this.save = this.bonus + (this.owner.prof.saves.includes(this.name) ? this.owner.prof.bonus : this.owner.prof.base);
    this.Update();
    this.owner.UpdateSkills(this.name);
  }

  RollStat () {
    Dice.Display();
    Dice.AddRoll(20, 1, "Ayo");
    Dice.AddBonus(this.bonus, `${this.name}-Bonus`);
  }

  RollSave () {
    Dice.Display();
    Dice.AddRoll(20, 1, "Ayo");
    Dice.AddBonus(this.bonus, `${this.name}-Bonus`);
    if (this.saveProf) {
      Dice.AddBonus(this.owner.prof.bonus, "Proficiency");
    } else if (this.owner.prof.base !== 0) {
      Dice.AddBonus(this.owner.prof.base, "Base Proficiency");
    }
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
  /** @type {string} */
  name;
  
  /** @type {Stat[]} */
  stats = [];

  /** @type {{bonus: number, base: number, skills: string[], saves: string[], items: string[]}} */
  prof = { bonus: 2, base: 0, skills: [], saves: [], items: []};

  /** 
   * @param {{score: number, stat: string}[]} stats
   * @param {{skills: string[], saves: string[], items: string[]}} profs
  */
  constructor(stats, profs) {
    this.prof.skills = profs.skills;
    this.prof.items = profs.items;
    this.prof.saves = profs.saves;
    this.stats = stats.map(stat => new Stat(this, stat.score, stat.stat, this.prof, this.prof));
    this.UpdateSkills("all");
  }
  
  /**
   * @param {string} statName 
   */
  GetStat(statName) {
    return this.stats.find(stat => stat.name === statName);
  }

  /**
   * @param {string | string[]} skills 
   */
  UpdateSkills(skills) {
    if (Array.isArray(skills)) {
      if (skills.includes("all")) {
        this.#update("all");
        return;
      }
      skills.forEach(skill => {
        this.#update(skill);
      });
    } else {
      this.#update(skills);
    }
  }

  /** @param {string} skill */
  #update (skill) {
    /**
     * @param {string} skill 
     * @param {string} stat
     * @param {number} statBonus 
     * @param {number} profBonus 
     * @param {boolean} isProf 
     */
    function updateElement(skill, stat, statBonus, profBonus, isProf) {
      const E_dis = document.querySelector(`#${skill}`);
      const E_pro = document.querySelector(`#${skill}-prof`);
      /** @type {Element | Node} */
      let E_roll = document.querySelector(`#${skill}-roll`);
      E_dis.innerHTML = (statBonus + profBonus).toString();

      if (isProf) {
        E_pro.classList.add("has");
      } else {
        E_pro.classList.remove("has");
      }

      E_roll = ResetElement(E_roll);

      E_roll.addEventListener('click', function () {
        Dice.Display();
        Dice.AddRoll(20, 1, "Ayo");
        Dice.AddBonus(statBonus, `${stat}-Bonus`);
        if (isProf) {
          Dice.AddBonus(profBonus, "Proficiency");
        } else if (profBonus !== 0) {
          Dice.AddBonus(profBonus, "Base Proficiency");
        }
      });
    }

    if (skill === "all") {
      listOfSkills.forEach(skill => {
        const statBonus = this.GetStat(skill.stat).bonus;
        const profBonus = this.ProfBonusFor(skill.name);
        const isProf = profBonus === this.prof.bonus;

        updateElement(skill.name, skill.stat, statBonus, profBonus, isProf);
      });
      return;
    }

    if (skill.length === 3) {
      const statBonus = this.GetStat(skill).bonus;
      const skills = listOfSkills.filter(sk => sk.stat === skill).map(sk => sk.name);

      skills.forEach(sk => {
        const profBonus = this.ProfBonusFor(sk);
        const isProf = profBonus === this.prof.bonus;
        
        updateElement(sk, skill, statBonus, profBonus, isProf);
      });
    } else {
      const stat = listOfSkills.find(stat => stat.name === skill).stat;
      const statBonus = this.GetStat(stat).bonus;
      const profBonus = this.ProfBonusFor(skill);
      const isProf = profBonus === this.prof.bonus;

      updateElement(skill, stat, statBonus, profBonus, isProf);
    }
  }

  /**
   * @param {string} prof 
   */
  ProfBonusFor(prof) {
    if (this.prof.skills.includes(prof) || this.prof.saves.includes(prof) || this.prof.items.includes(prof))
    return this.prof.bonus;
    else 
    return this.prof.base;
  }

  // static from(json) {
  //   return Object.assign(new Character(), json);
  // }
}

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

  static popUp = document.querySelector("#roll-dice-popup");
  static rollDisplay = document.querySelector("#display-roll-results");

  static genericRoll = document.querySelector("#generic-roll");

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

  static closePopUp = document.querySelector("#roll-dice-close");

  static Hide() {
    Dice.popUp.classList.add("hidden");
  }

  /**
   * @param {number} Sides 
   * @param {number} Amount 
   * @param {string} Title 
   */
  static AddRoll(Sides, Amount, Title) {
    for (let i = 0; i < Amount; i++) {
      const roll = Dice.Roll(1, Sides);

      let container = document.createElement("div");
      let title = document.createElement("p");
      let dice = document.createElement("p");
      let result = document.createElement("h1");

      Dice.rollDisplay.appendChild(container);
      container.classList.add("center", "margin");
      container.appendChild(title);
      title.innerHTML = Title;
      container.appendChild(result);
      result.innerHTML = roll.toString();
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
});

Dice.closePopUp.addEventListener("click", Dice.Hide);

// +-------------------------------------------------------------------------------------------------------------------------------------------------+
// |                                                                 Character Creation                                                              |
// +-------------------------------------------------------------------------------------------------------------------------------------------------+

let tempChar = {
  // Name
  n: "",
  // Level
  l: 0,
  // Health Points
  h: 0,
  // Stats
  s: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  // Race
  r: "",
  // Class (It didn't like when I called it "class" so I changed it to c and decided that the rest should follow)
  c: "",
  // To remember if the character is copied from a sheet or made from scratch
  i: false,
};

// ------------------------------------------------------------ Assign Stats From Dice Pop-Up --------------------------------------------------------

let changeStats = document.querySelector("#change-stats");
changeStats.addEventListener("click", ShowChangeStats);

let closeStats = document.querySelector("#roll-stats-close");
closeStats.addEventListener("click", HideChangeStats);

let rollPopupWindow = document.querySelector("#roll-stats-popup");

let statHolders = [];
let choseStats = [];
for (let i = 1; i <= 6; i++) {
  statHolders.push(document.querySelector(`#stat${i}show`));
  //dodo was a temporary name for testing and then when it worked I couldn't think of a better one
  let dodo = document.querySelector(`#stat${i}`);
  choseStats.push(dodo);
  dodo.addEventListener("input", UpdateOptions);
}

let rollStatsButton = document.querySelector("#roll-stats");
rollStatsButton.addEventListener("click", RollNewStats);

let acceptStatsButton = document.querySelector("#accept-stats");
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
  tempChar.s.str = rolledStats[choseStats.indexOf("str")];
  tempChar.s.dex = rolledStats[choseStats.indexOf("dex")];
  tempChar.s.con = rolledStats[choseStats.indexOf("con")];
  tempChar.s.int = rolledStats[choseStats.indexOf("int")];
  tempChar.s.wis = rolledStats[choseStats.indexOf("wis")];
  tempChar.s.cha = rolledStats[choseStats.indexOf("cha")];

  rollPopupWindow.classList.add("hidden");
}

function UpdateOptions() {
  let availableStats = ["str", "dex", "con", "int", "wis", "cha"];

  choseStats.forEach((choice) => {
    // If a choice has been made, then all other options will be temporarily removed from that select element.
    // The selected option will also be removed from the "availableStats" array.
    if (choice.value != "--") {
      // If the chosen option is removed then it would be instantly unselected, so it isn't removed.
      availableStats.splice(availableStats.indexOf(choice.value), 1);

      for (let i = 0; i < choice.options.length; i++) {
        if (choice.options[i].value != choice.value) {
          choice.options.remove(i);
          i--;
        }
      }
    }
    // If a choice hasn't been made, then all options will be temporarily removed from that element.
    else {
      choice.options.length = 0;
    }
  });
  // Every selected option has now been removed from the "availableStats" array,
  // leaving only the unselected ones.

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

// ------------------------------------------------------------------ Things and Stuff ---------------------------------------------------------------

let currentCharacter = new Character( 
  [
    { score: 12, stat: "str" },
    { score: 10, stat: "dex" },
    { score: 10, stat: "con" },
    { score: 10, stat: "int" },
    { score: 10, stat: "wis" },
    { score: 10, stat: "cha" },
  ],
  {
    skills: ["Acrobatics"], saves:["str"], items: []
  }
);

//})();
