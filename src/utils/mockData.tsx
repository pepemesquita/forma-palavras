//pega quatro imagens aleatórias e retorna
const init_figures = {
  bolo: require("@/src/assets/images/figures/bolo.png"),
  gato: require("@/src/assets/images/figures/gato.png"),
  flor: require("@/src/assets/images/figures/flor.png"),
  casa: require("@/src/assets/images/figures/casa.png"),
  sapo: require("@/src/assets/images/figures/sapo.png"),
};

function getRandomElements(arr: Array<any>, numElements: number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, numElements);
}

function shuffle(array: Array<any>) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

let selected_images = getRandomElements(Object.keys(init_figures), 4);

let figures: { [key: string]: any } = {};

selected_images.map((image: string) => {
  figures[image] = init_figures[image];
});

const letterImages = {
  a: require("@/src/assets/images/letters/a.png"),
  b: require("@/src/assets/images/letters/b.png"),
  c: require("@/src/assets/images/letters/c.png"),
  f: require("@/src/assets/images/letters/f.png"),
  g: require("@/src/assets/images/letters/g.png"),
  j: require("@/src/assets/images/letters/j.png"),
  l: require("@/src/assets/images/letters/l.png"),
  m: require("@/src/assets/images/letters/m.png"),
  o: require("@/src/assets/images/letters/o.png"),
  p: require("@/src/assets/images/letters/p.png"),
  r: require("@/src/assets/images/letters/r.png"),
  s: require("@/src/assets/images/letters/s.png"),
  t: require("@/src/assets/images/letters/t.png"),
};

const string_selected_images = selected_images.join("");
const letterArray = string_selected_images.split("");
shuffle(letterArray);
console.log(letterArray);

// === Criação de letras restantes ===
// Cria o alfabeto baseado nas imagens de letras disponíveis e encontra as letras que não estão nas imagens selecionadas
const alphabet = Object.keys(letterImages);
const remainingLetters = alphabet.filter((letter) => !string_selected_images.includes(letter));

// Adiciona 4 letras aleatórias extras ao array de letras
for (let i = 0; i < 4; i++) {
  let randomIndex = Math.floor(Math.random() * remainingLetters.length);
  letterArray.push(remainingLetters[randomIndex]);
}
shuffle(letterArray);

type Letter = (typeof letterArray)[number];

interface LetterType {
  char: Letter;
  position: number | null;
}

interface BlankSpaceType {
  char: Letter;
  letterIndex: number;
}

const getTargetLetter = (char: Letter, index: number): Letter => {
  const figureIndex = Math.floor(index / 4);
  const correctWord = Object.keys(figures)[figureIndex];

  const targetSpaceIndex = index % 4;
  const targetChar = correctWord.charAt(targetSpaceIndex);

  return targetChar;
};

const verifyWord = (blankSpaces: (BlankSpaceType | null)[], figureIndex: number): boolean => {
  // Obtém a palavra correta para a figura
  const correctWord = Object.keys(figures)[figureIndex];

  // Construa a palavra formada pelos espaços em branco
  const formedWord = blankSpaces.map((space) => space?.char || "").join("");

  // Verifique se a palavra formada corresponde à palavra correta
  return formedWord === correctWord;
};

export { figures, letterImages, letterArray, LetterType, BlankSpaceType, getTargetLetter, verifyWord };
