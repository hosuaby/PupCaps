import {expect} from 'chai';
import {CssProcessor} from '../../src/player/css-processor';

describe('CssProcessor', () => {
    it('parseFilter', () => {
        // Given
        const selectorIndexes = '.pup-indexes-3';
        const selectorTimecodes = '.pup-timecodes-00\\:00\\:05\\.680-00\\:00\\:08\\.388';
        const selectorWords = '.pup-words-ia-data-machine-computer';

        // When
        const indexesFilter = CssProcessor.parseFilter(selectorIndexes);
        const timecodesFilter = CssProcessor.parseFilter(selectorTimecodes);
        const wordsFilter = CssProcessor.parseFilter(selectorWords);

        // Then
        expect(indexesFilter).to.deep.equal({
            cssClass: 'pup-indexes-3',
            type: 'indexes',
            args: [ '3' ]
        });
        expect(timecodesFilter).to.deep.equal({
            cssClass: 'pup-timecodes-00\\:00\\:05\\.680-00\\:00\\:08\\.388',
            type: 'timecodes',
            args: [ '00\\:00\\:05\\.680', '00\\:00\\:08\\.388' ]
        });
        expect(wordsFilter).to.deep.equal({
            cssClass: 'pup-words-ia-data-machine-computer',
            type: 'words',
            args: [ 'ia', 'data', 'machine', 'computer' ]
        });
    });

    it('parseSelectors', () => {
        // Given
        const selectorIndexes = '.word.pup-indexes-3-4';
        const selectorTimecodes1 = '.word.pup-timecodes-00\\:00\\:05\\.680-00\\:00\\:08\\.388';
        const selectorTimecodes2 = '.word.is-highlighted.pup-timecodes-00_00_05_680-00_00_08_388';
        const selectorWords = '#video.pup-words-ia';

        // When
        const parsedSelectorIndexes = CssProcessor.parseSelectors(selectorIndexes);
        const parsedSelectorTimecodes1 = CssProcessor.parseSelectors(selectorTimecodes1);
        const parsedSelectorTimecodes2 = CssProcessor.parseSelectors(selectorTimecodes2);
        const parsedSelectorWords = CssProcessor.parseSelectors(selectorWords);

        // Then
        expect(parsedSelectorIndexes).to.have.lengthOf(2);
        expect(parsedSelectorIndexes).to.deep.equal([ '.word', '.pup-indexes-3-4' ]);

        expect(parsedSelectorTimecodes1).to.have.lengthOf(2);
        expect(parsedSelectorTimecodes1).to.deep.equal([ '.word', '.pup-timecodes-00\\:00\\:05\\.680-00\\:00\\:08\\.388' ]);

        expect(parsedSelectorTimecodes2).to.have.lengthOf(3);
        expect(parsedSelectorTimecodes2).to.deep.equal([ '.word', '.is-highlighted', '.pup-timecodes-00_00_05_680-00_00_08_388' ]);

        expect(parsedSelectorWords).to.have.lengthOf(2);
        expect(parsedSelectorWords).to.deep.equal([ '#video', '.pup-words-ia' ]);
    });
});
