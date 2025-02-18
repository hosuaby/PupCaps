import {expect} from 'chai';
import {Caption, captionGroups, haveSameWords, readCaptions, readWords, splitText} from '../../src/common/captions';
import {readFileSync} from 'fs';

const exampleSrt = readFileSync('test/resources/example.srt', 'utf-8');

it('haveSameWords', () => {
    // Given
    const cue1 = 'vous [avez] lancé en septembre';
    const cue2 = 'vous avez lancé [en] septembre';
    const cue3 = 'que [vous] recrutez';

    const caption1: Caption = {
        index: 1,
        startTimeMs: 0,
        endTimeMs: 0,
        words: readWords(cue1),
    };
    const caption2: Caption = {
        index: 2,
        startTimeMs: 0,
        endTimeMs: 0,
        words: readWords(cue2),
    };
    const caption3: Caption = {
        index: 2,
        startTimeMs: 0,
        endTimeMs: 0,
        words: readWords(cue3),
    };

    // When
    const sameWords1 = haveSameWords(caption1, caption2);
    const sameWords2 = haveSameWords(caption1, caption3);

    // Then
    expect(sameWords1).to.be.true;
    expect(sameWords2).to.be.false;
});

it('splitText', () => {
    // Given
    const text1 = 'votre [projet] Basalt !';
    const text2 = 'votre projet [Basalt !]';

    // When
    const tokens1 = splitText(text1);
    const tokens2 = splitText(text2);

    // Then
    expect(tokens1).to.be.deep.equals([
        'votre',
        '[projet]',
        'Basalt !',
    ]);
    expect(tokens2).to.be.deep.equals([
        'votre',
        'projet',
        '[Basalt !]',
    ]);
});

describe('readCaptions', () => {
    it('when no highlighted', () => {
        const words = readWords('La vie est belle!');
        expect(words).to.have.lengthOf(4);
        expect(words).to.deep.equal([
            {
                rawWord: 'La',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'vie',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'est',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'belle!',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            }
        ]);
    });

    it('when one highlighted', () => {
        const words = readWords('La vie [est] belle!');
        expect(words).to.have.lengthOf(4);
        expect(words).to.deep.equal([
            {
                rawWord: 'La',
                isHighlighted: false,
                isBeforeHighlighted: true,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'vie',
                isHighlighted: false,
                isBeforeHighlighted: true,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'est',
                isHighlighted: true,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'belle!',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: true,
            }
        ]);
    });

    it('when many highlighted', () => {
        const words = readWords('La [vie] [est] belle!');
        expect(words).to.have.lengthOf(4);
        expect(words).to.deep.equal([
            {
                rawWord: 'La',
                isHighlighted: false,
                isBeforeHighlighted: true,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'vie',
                isHighlighted: true,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'est',
                isHighlighted: true,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'belle!',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: true,
            }
        ]);
    });

    it('when many highlighted together', () => {
        const words = readWords('La [vie est] belle!');
        expect(words).to.have.lengthOf(3);
        expect(words).to.deep.equal([
            {
                rawWord: 'La',
                isHighlighted: false,
                isBeforeHighlighted: true,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'vie est',
                isHighlighted: true,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'belle!',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: true,
            }
        ]);
    });

    it('when highlighted word has CSS class', () => {
        const words = readWords('La [vie](red) est belle!');
        expect(words).to.have.lengthOf(4);
        expect(words).to.deep.equal([
            {
                rawWord: 'La',
                isHighlighted: false,
                isBeforeHighlighted: true,
                isAfterHighlighted: false,
            },
            {
                rawWord: 'vie',
                isHighlighted: true,
                isBeforeHighlighted: false,
                isAfterHighlighted: false,
                highlightClass: 'red',
            },
            {
                rawWord: 'est',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: true,
            },
            {
                rawWord: 'belle!',
                isHighlighted: false,
                isBeforeHighlighted: false,
                isAfterHighlighted: true,
            }
        ]);
    });
});

it('captionGroups', () => {
    // Given
    const captions = readCaptions(exampleSrt);

    // When
    const groups = captionGroups(captions);

    // Then
    console.dir(groups[0], {depth:null});
    console.dir(groups[1], {depth:null});

    expect(groups[0]).to.have.lengthOf(1);
    expect(groups[1]).to.have.lengthOf(4);
});