# D&D Character Creator and Handler
D&D 5e has a lot of things to keep track of. There's **Stats**, **Proficiencies**, **Race**, **Racial Features**, **Character Level**, **Class Levels**, **Class Specialisation**, **Spells**, **Class Features**, **Equipment/Items/Money**, **background** and **_sometimes_ alignment**. And that's only the things that have a direct and stated effect on the rules! There is even more things to keep track of when it comes to the actual character, because you're trying to create a person, with a personality, past, morals and all that stuff that makes people so special. And calling that process complex would be an understatement.

This is a web application to make the part of a character that has direct effect on gameplay easier to create, keep track of, change, and so on. 

This application is going to contain the features described in the **Player's Handbook** and **Dungeon Master's Guide** pertaining to characters and their creation, as well as the ability to add your own, because Home-Brewing is fun and there is no way this can cover everything.

## Contents:
In the **How To Use** section there is a description of how to use it, one I wish contained less code.

In the **Code Plan And Structure** section of this file you will find my plans for how it *will* work, because at the moment it doesn't. When I get things working, there *will* be a description of that as well/instead.

In the **What I Wish I Could Do** section I describe the additions I would make to this application if I had more of the things I lack.

# How To Use:
As it is currently, it doesn't really work unless you want to use the console. You can assign stats through rolling by pressing the "Change stats" button at the bottom.

If you want to change a specific stat to a specific value you need to write 
```js
currentCharacter.GetStat(stat).ChangeTo(score)
```
Where `stat`is the 3 letter string representing the stat (in lower case) and `score` is the score you want to give it.

If you want to change the list of proficiencies, write 
```js
currentCharacter.profs.skills = sk; // For skills
// or
currentCharacter.profs.saves = sa; // For saving throws
// and always
currentCharacter.UpdateSkills("all"); // To update the functionality and display
```
Where `sk` is an array of the names of skills as strings, written the way you see in the list of skills, and `sa` is an array of strings with the 3 letter representation of the stat.

And then to roll dice just press the buttons.

# Code Plan And Structure:
As stated in the beginning of this document, this will focus on the things that have "**direct effect on gameplay**", because creating people isn't something you can optimize through code, though there will be some basic features for that, at the very least it will allow you to save a link to a Google Document.

## Buttons And General Functions (As In Functions Of The Application):
### Rolling Dice:
Attached to the section where it displays your bonus to specific types of skill checks and saving throw, there will be a button to perform it, meaning that the user won't have to do math. Each ability will have a button to activate it (if it isn't passive), each spell a button to cast it, each weapon a button to attack with it.
### Do Things Automatically:
There will be a button to perform a long rest and short rest, doing all the things that would be done during such a rest.

If I have time, I plan to add a switch to enter and exit combat, in order to make things like keeping track of actions, bonus actions, reactions, and what you can and can't do, as well as keeping track of things that happen at the beginning or end of turns.
### Override everything:
In D&D, the rules are only a guideline which the Dungeon Master can chose to break away from at any moment. As such, there should be a possibility to do things even though the rules say no. So I'm going to add an option somewhere to allow any rule limitation or dice roll to be ignored, which will open a text box that asks weather or not you want to break the rules whenever there is something to overrule.

## Data/Variable Handling:
I plan to make a class for characters, one for effects, one for races, one for features, one for spells and one for items/equipment. The reason I'm not creating objects is because I have more experience in classes due to primarily using c# and I'm going to have multiple instances of each type so it's probably smarter to define the class once.
### Character Class:
It's going to contain variables for the obvious stuff like name, stats, race, background and character level. As well as some lists for things like items/equipment, class-/race-/background features, available spells, prepared spells, spell slots, proficiencies, currently activated temporary effects, known languages and classes (since Characters can multi-class).

It will also have a few functions. Many of them will be for changing the values of variables and contents of lists, so I will focus on the more interesting ones. It's going to have one for performing long and short rests and one for making skill checks, saving throws, attack rolls and so on.
### Effect Class:
A class for executing every single effect. It can do any sort of dice roll or check, change character stats and add something to the list of prepared spells, temporary effects and proficiencies. It always opens a popup with text that tells the user what it did and what the user needs to do, if anything. It may interrupt certain events and trigger it's effect. 

It has variables to keep track of what it does, when it does it, and for how long.
### Race Class:
(I'm not racist I swear! (and D&D is (almost) not racist either!))

This contains lists of features, effects and known languages you get from being a member of that race.
### Feature Class:
It's going to have variables that tells the code if it's passive or needs to be activated, if there's a limit to how much it can be used and what it is, and what it does. 

It's going to have functions checking if it can be executed and updating the limit (if there is one).
### Spell Class:
It has variables for spell level, school of magic, when it can be cast, and a list of what classes and specialisations can learn it.
### Item/Equipment Class:
Has variables for what it is, what it does, how much it's worth, how much it weighs, and if it's currently worn/held.

## Character/Homebrew Long Term Storage:
Since I don't have a server, the data must somehow be stored on the user's computer. The plan for storage is to first off use local storage. However, I have heard that it isn't a very secure way of storing data, and it isn't very convenient for sharing, which is important for social games such as D&D. I plan to be able to store character data, and also custom feature data, as files on the user's computer, so that it may be moved and shared as the users chose.

## Character Creation:
During creation, I might want to split the all values the user gives into multiple smaller part to not overwhelm them, so the values that the user gave will be stored in some temporary variables so that they may all be put into the new character at the same time once it's finished.

## Homebrew Creation:
When creating a homebrew item, spell, and so on, it will first ask what the user wants to create, and if they want to start from scratch or make their own version of something that already exists. If they want to create their own version of something, they will start the process with the values of the thing they picked.

# What I Wish I Could Do
There are many things I wish I could do but can't because of limited time, resources and skill. The most valuable resource right now is time, because I have too many large projects, so I should probably stop writing this and get to work.

## If I Had More Time:
I would make it so that you could use this thing for all stages of the game, such as making maps, dungeons, encounters, combat and so on.

I could make a series of questions for users to answer when making their character's personality in order to help them get somewhere if they don't know where to go or what to do.

Every single spell and ability could be added to the built in list of spells and abilities.

## If I Had A Server Of Some Sort:
Then users could connect together, meaning that everyone in the group could get a live view of the character info, and instead of asking the player "Does the DM allow you to break this rule?", the DM could answer it themselves.