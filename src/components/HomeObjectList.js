import React from "react";

import TextObject from "./TextObject";
import PolyObject from "./PolyObject";

// function that returns 3d object for text with height and offset
function textObjectWithOffset(text) {
  // set text object height based on the number of lines
  const regex = new RegExp('\n', 'g');
  const matches = text.match(regex);
  const objectHeight = (matches ? matches.length : 0) * 100;
  return ({object:<TextObject text={text}/>, offset:[-300, 1500, 0], objectHeight:objectHeight})
}

// function that shuffle array 
function shuffle(arr) {
  var array = arr;
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// list of objects to be used in Home
export default function HomeObjectList() {
  const welcomeText = [
    "Welcome to bill0077.log!\nPlease click me!"
  ];

  const endText = [  
    "That's it!"
  ];
  
  const quotes = [
    "When I wrote this code, \nonly God and I understood what I did. \nNow only God knows\n- Anonymous",
    "Coding like poetry should be short and concise.\n- Santosh Kalwar",
    "It’s not a bug; \nit’s an undocumented feature.\n- Anonymous",
    "First, solve the problem. \nThen, write the code.\n- John Johnson",
    "Code is like humor. \nWhen you have to explain it, it’s bad.\n- Cory House",
    "Make it work, \nmake it right, \nmake it fast.\n- Kent Beck",
    "Clean code always looks like \nit was written by someone who cares.\n- Robert C. Martin",
    "Of course, bad code can be cleaned up. \nBut it’s very expensive.\n- Robert C. Martin",
    "Programming is the art of algorithm design \nand the craft of debugging errant code. \n– Ellen Ullman",
    "Any fool can write code that \na computer can understand. \nGood programmers write code that \nhumans can understand. \n― Martin Fowler",
    "Experience is the name \neveryone gives to their mistakes. \n– Oscar Wilde",
    "Programming is the art of \ntelling another human being \nwhat one wants the computer to do. \n― Donald Ervin Knuth",
    "Confusion is part of programming. \n― Felienne Hermans",
    "Software and cathedrals are much the same \nfirst we build them, then we pray. \n- Samuel T. Redwine, Jr.",
    "Programmer: \nA machine that turns coffee into code. \n– Anonymous",
    "Programming is learned by writing programs. \n― Brian Kernighan",
    "If debugging is the process of removing bugs, \nthen programming must be \nthe process of putting them in. \n– Sam Redwine",
    "Sometimes it pays to stay in bed on Monday, \nrather than spending the rest of the week \ndebugging Monday’s code. \n– Dan Salomon",
    "If, at first, you do not succeed, \ncall it version 1.0. \n― Khayri R.R. Woulfe",
    "Computers are fast; \ndevelopers keep them slow. \n– Anonymous",
    "The computer was born to solve \nproblems that did not exist before. \n- Bill Gates",
    "One of my most productive days was \nthrowing away 1000 lines of code. \n- Ken Thompson"
  ];

  const welcomeObjects = welcomeText.map((text) => {
    return textObjectWithOffset(text);
  });

  const quotesObjects = quotes.map((quote) => {
    return textObjectWithOffset(quote);
  });

  const endObjects = endText.map((text) => {
    return textObjectWithOffset(text);
  });

  const polyObjects = [
    {object:<PolyObject filePath={"models/banana/Banana.glb"} scale={100} />, 
    offset:[0, 1500, 0], objectHeight:0}
  ];

  // shuffle the object list and add welcome text ata front
  const objectList = [
    ...welcomeObjects,
    ...shuffle([...quotesObjects, ...polyObjects]),
    ...endObjects
  ];

  return objectList;
}