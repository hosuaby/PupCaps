import {expect} from 'chai';
import {readWords} from '../../src/script/srt-captions-reader';

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
