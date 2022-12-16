import { ActivatedRoute } from "@angular/router";

import * as stringSimilarity from "string-similarity";

import { Card } from "../_interfaces/card";
import { Answer } from "../_interfaces/answer";

/**
 * Extract studykit id from route
 * @param { ActivatedRoute } route
 * @returns { string } 
 */
export function getStudykitIdFromRout(route: ActivatedRoute): string {
  return route.snapshot.paramMap.get("id");
}

/**
 * Randomizes a set of cards
 * @param { Card[] } cards 
 * @returns { Card[] } 
 */
export function randomizeStudycards(cards: Card[]): Card[] {
  let randomizedCardArray: Card[] = [];

  while (cards.length !== 0) {
    let index = Math.floor(Math.random() * cards.length);
    randomizedCardArray.push(cards[index]);
    cards.splice(index, 1);
  }
  return randomizedCardArray;
}

/**
 * Returns how much is matched between two strings, in percent 
 * @param { string } text1
 * @param { string } text2
 * @returns { number } 
 */
export function getStringSimilarity(text1: string, text2: string): number {
  let answerSimilarity = stringSimilarity.compareTwoStrings(text1, text2) * 100;
  return parseFloat(answerSimilarity.toFixed(2));
}

/**
 * Checks if the passed percentage value is above 70%
 * @param { number } similarityPercent
 * @returns { boolean } 
 */
export function checkanswerOfTextarea(similarityPercent: number): boolean {
  return similarityPercent >= 70 ? true : false;
}

/**
 * Checks if all multiple choice answers are correct
 * @param { Car } card 
 * @param { string[] } checkedAnswerIds all checked answers by user
 * @returns 
 */
export function checkMultipleAnswer(card: Card, checkedAnswerIds: string[]): boolean {
  let isRightList: boolean[] = card.answers.map((elem: Answer) =>
    isMultiplechoiceAnswerRight(elem, checkedAnswerIds)
  );
  return isRightList.every((elem: boolean) => elem === true);
}

/**
 * Returns whether the answer from the user is correct
 * @param { Answer } answerElement 
 * @param { string[] } checkedAnswers all checked answers by user
 * @returns { boolean }
 */
export function isMultiplechoiceAnswerRight(answerElement: Answer, checkedAnswers: string[]): boolean {
  let isInAnswerCheckedList: boolean =
  checkIfAnswerIdIsInAnswerCheckedList(answerElement.id, checkedAnswers);

  if (!isInAnswerCheckedList && !answerElement.isRight) {
    return true;
  } else if (isInAnswerCheckedList && !answerElement.isRight) {
    return false;
  } else if (isInAnswerCheckedList && answerElement.isRight) {
    return true;
  } else if (!isInAnswerCheckedList && answerElement.isRight) {
    return false;
  }
}

/**
 * Returns whether the answer (id) is in a given list
 * @param { string } answerId 
 * @param { string[] } checkedAnswersIdArray
 * @returns { boolean }
 */
export function checkIfAnswerIdIsInAnswerCheckedList(answerId: string, checkedAnswersIdArray: string[]): boolean {
  return checkedAnswersIdArray.filter(
    (value) => value === answerId
  ).length > 0
    ? true
    : false;
}
