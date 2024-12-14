import {expect} from 'chai';
import {KaraokeGroup, KaraokeWord} from '../../src/editor/captions.service';

describe('KaraokeGroup', () => {
    let karaokeGroup: KaraokeGroup;

    beforeEach(() => {
        karaokeGroup = new KaraokeGroup(20, 22, [
            { rawWord: 'que', startTimeMs: 7520, endTimeMs: 7680 },
            { rawWord: 'vous', startTimeMs: 7680, endTimeMs: 7839 },
            { rawWord: 'recrutez', startTimeMs: 7839, endTimeMs: 8340 },
        ]);
    });

    it('initial state', () => {
        expect(karaokeGroup.id).to.be.equals('20-22');
        expect(karaokeGroup.indexStart).to.be.equals(20);
        expect(karaokeGroup.indexEnd).to.be.equals(22);
        expect(karaokeGroup.startTimeMs).to.be.equals(7520);
        expect(karaokeGroup.endTimeMs).to.be.equals(8340);
        expect(karaokeGroup.isEmpty).to.be.equals(false);
        expect(karaokeGroup.words).to.have.length(3);
    });

    it('after addAtBeginning', () => {
        // Given
        const insertedWord: KaraokeWord = {
            rawWord: 'toto',
            startTimeMs: 7000,
            endTimeMs: 7520,
        };

        // When
        karaokeGroup.addAtBeginning(insertedWord);

        // Then
        expect(karaokeGroup.id).to.be.equals('19-22');
        expect(karaokeGroup.indexStart).to.be.equals(19);
        expect(karaokeGroup.indexEnd).to.be.equals(22);
        expect(karaokeGroup.startTimeMs).to.be.equals(7000);
        expect(karaokeGroup.endTimeMs).to.be.equals(8340);
        expect(karaokeGroup.isEmpty).to.be.equals(false);
        expect(karaokeGroup.words).to.have.length(4);
    });

    it('after removeFromBeginning', () => {
        // When
        const removedWord = karaokeGroup.removeFromBeginning();

        // Then
        expect(removedWord).to.deep.equals({ rawWord: 'que', startTimeMs: 7520, endTimeMs: 7680 });

        expect(karaokeGroup.id).to.be.equals('21-22');
        expect(karaokeGroup.indexStart).to.be.equals(21);
        expect(karaokeGroup.indexEnd).to.be.equals(22);
        expect(karaokeGroup.startTimeMs).to.be.equals(7680);
        expect(karaokeGroup.endTimeMs).to.be.equals(8340);
        expect(karaokeGroup.isEmpty).to.be.equals(false);
        expect(karaokeGroup.words).to.have.length(2);
    });

    it('after addAtEnd', () => {
        // Given
        const insertedWord: KaraokeWord = {
            rawWord: 'toto',
            startTimeMs: 8340,
            endTimeMs: 8500,
        };

        // When
        karaokeGroup.addAtEnd(insertedWord);

        // Then
        expect(karaokeGroup.id).to.be.equals('20-23');
        expect(karaokeGroup.indexStart).to.be.equals(20);
        expect(karaokeGroup.indexEnd).to.be.equals(23);
        expect(karaokeGroup.startTimeMs).to.be.equals(7520);
        expect(karaokeGroup.endTimeMs).to.be.equals(8500);
        expect(karaokeGroup.isEmpty).to.be.equals(false);
        expect(karaokeGroup.words).to.have.length(4);
    });

    it('after removeFromEnd', () => {
        // When
        const removedWord = karaokeGroup.removeFromEnd();

        // Then
        expect(karaokeGroup.id).to.be.equals('20-21');
        expect(karaokeGroup.indexStart).to.be.equals(20);
        expect(karaokeGroup.indexEnd).to.be.equals(21);
        expect(karaokeGroup.startTimeMs).to.be.equals(7520);
        expect(karaokeGroup.endTimeMs).to.be.equals(7839);
        expect(karaokeGroup.isEmpty).to.be.equals(false);
        expect(karaokeGroup.words).to.have.length(2);
    });
});