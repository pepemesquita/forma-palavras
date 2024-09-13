const init_figures: { [key: string]: any } = {
    "bolo": require('@/src/assets/images/figures/bolo.png'),
    "gato": require('@/src/assets/images/figures/gato.png'),
    "flor": require('@/src/assets/images/figures/flor.png'),
    "casa": require('@/src/assets/images/figures/casa.png'),
    "sapo": require('@/src/assets/images/figures/sapo.png')
};

function getRandomElements(arr: Array<any>, numElements: number) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, numElements);
};

function shuffle(array: Array<any>) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

let selected_images = getRandomElements(Object.keys(init_figures), 4);

let figures: { [key in keyof typeof init_figures]?: any } = {};

selected_images.map((image: string) => {
    figures[image] = init_figures[image];
});


const letterImages = {
    a: require('@/src/assets/images/letters/a.png'),
    b: require('@/src/assets/images/letters/b.png'),
    c: require('@/src/assets/images/letters/c.png'),
    f: require('@/src/assets/images/letters/f.png'),
    g: require('@/src/assets/images/letters/g.png'),
    j: require('@/src/assets/images/letters/j.png'),
    l: require('@/src/assets/images/letters/l.png'),
    m: require('@/src/assets/images/letters/m.png'),
    o: require('@/src/assets/images/letters/o.png'),
    p: require('@/src/assets/images/letters/p.png'),
    r: require('@/src/assets/images/letters/r.png'),
    s: require('@/src/assets/images/letters/s.png'),
    t: require('@/src/assets/images/letters/t.png')
};

// Uses the randomly selected images to create an array of letters (that are necessary to form the words)
const string_selected_images = selected_images.join('');
const letterArray = string_selected_images.split('');
shuffle(letterArray);
console.log(letterArray);

// === Create the remaining letters ===
// === uncomment the following line once we got all the letters images ===
// const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Create an alphabet based on the avaiable letters images e find the letters that are not in the selected images (extra letters).
// Then chooses 4 random letters from the extra letters to complete the array of letters.
const alphabet = Object.keys(letterImages);
const remainingLetters = alphabet.filter((letter) => !string_selected_images.includes(letter));

for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random() * remainingLetters.length);
    letterArray.push(remainingLetters[randomIndex]);
}
shuffle(letterArray);

type Letter = typeof letterArray[number];

interface LetterType {
    char: Letter;
    position: number | null;
}

interface BlankSpaceType {
    char: Letter
    letterIndex: number;
}

export { figures, letterImages, letterArray, LetterType, BlankSpaceType };