import { ActivatedRoute, Router } from "@angular/router";

import { Card } from "src/app/services/_interfaces/card";

/**
 * extract studykit id from route
 * @param { ActivatedRoute } route
 * @returns { string } extrected id of studykit from route
 */
export function getStudykitIdFromRout(route: ActivatedRoute): string {
  return route.snapshot.paramMap.get("id");
}

/**
 * generates numbers between 0 and max randomized in an array
 * @param { number } max
 * @returns { number[] } amount=length randomized numbers (once each) between 0 and max
 */
export function generateRandomizedIndexesOf(max: number): number[] {
  let arrayOfNumbers: number[] = generateNumbers(max);
  return generateRandomSequence(arrayOfNumbers);
}

/**
 * generates array of numbers between 0 and max
 * @param { number } max
 * @returns { number[] } array of numbers between 0 and max
 */
export function generateNumbers(max: number): number[] {
  let result: number[] = [];
  for (let i = 0; i < max; i++) {
    result.push(i);
  }
  return result;
}

/**
 * randomizes numbers in array
 * @param { number[] } array array of numbers between 0 and length
 * @returns { number[] } randomized numbers (once each) between 0 and array length
 */
export function generateRandomSequence(array: number[]): number[] {
  let arrayToRandomize: number[] = array;
  let result: number[] = [];

  while (arrayToRandomize.length !== 0) {
    let index = Math.floor(Math.random() * arrayToRandomize.length);
    result.push(arrayToRandomize[index]); // write index to randomized array
    arrayToRandomize.splice(index, 1); // drop written index of list
  }
  return result;
}

/**
 * picks next element from studycardsArray, based on an given index from randomized numbers array
 * @param { Card[] } studycardsArray studycard array
 * @param { number } currentIdx current index
 * @param { number[] } randomizedNumberArray array of (randomized) numbers 
 * @returns { Card } next card with next index of (ranomized) numbers array 
 */
export function getNextRandomizedCardFromStudykit(
  studycardsArray: Card[],
  currentIdx: number,
  randomizedNumberArray: number[]
): Card {
  return studycardsArray[
    getNextNumberInRandomizedArray(currentIdx, randomizedNumberArray)
  ];
}

/**
 * get next number of an numbers array
 * @param { number } currentIdx current position of index
 * @param { number[] } randomizedNumberArray array of (randomized) numbers 
 * @returns { number } next number of (randomized) numbers array 
 */
export function getNextNumberInRandomizedArray(
  currentIdx: number,
  randomizedNumberArray: number[]
): number {
  return randomizedNumberArray[currentIdx + 1];
}
