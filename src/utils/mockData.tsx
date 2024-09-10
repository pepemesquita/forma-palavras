const figures = [
    require('@/src/assets/images/figures/cake.png'),
    require('@/src/assets/images/figures/cat.png'),
    require('@/src/assets/images/figures/flower.png'),
    require('@/src/assets/images/figures/house.png'),
];

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

const letterArray = [
    'b',
    'o',
    'l',
    'o',
    'g',
    'a',
    't',
    'o',
    'f',
    'l',
    'o',
    'r',
    'c',
    'a',
    's',
    'a',
] as const;

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