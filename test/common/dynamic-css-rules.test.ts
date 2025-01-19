import {expect} from 'chai';
import browserEnv from 'browser-env';
import {IndexesDynamicCssRule, normalizeTimecode, TimecodesDynamicCssRule} from '../../src/common/dynamic-css-rules';

browserEnv();

it('normalizeTimecode', () => {
    // Given
    const timecode1 = '00\\:00\\:05\\.680';
    const timecode2 = '00_00_05_680';

    // When
    const normalizedTimecode1 = normalizeTimecode(timecode1);
    const normalizedTimecode2 = normalizeTimecode(timecode2);

    // Then
    expect(normalizedTimecode1).to.equals('00:00:05.680');
    expect(normalizedTimecode2).to.equals('00:00:05.680');
});

describe('IndexesDynamicCssRule#isApplied', () => {
    const target = document.createElement('span');
    target.setAttribute('class', 'word');

    describe('with unbounded index range', () => {
        const rule = new IndexesDynamicCssRule(['.word'], 'pup-indexes-3', 3);

        it('current caption index before the start', () => {
            let applied = rule.isApplied(target, 2, 1000, []);
            expect(applied).to.be.false;
        });

        it('current caption index after the start', () => {
            let applied = rule.isApplied(target, 3, 1000, []);
            expect(applied).to.be.true;
        });
    });

    describe('with bounded index range', () => {
        const rule = new IndexesDynamicCssRule(['.word'], 'pup-indexes-3-5', 3, 5);

        it('current caption index before the start', () => {
            let applied = rule.isApplied(target, 2, 1000, []);
            expect(applied).to.be.false;
        });

        it('current caption index after the end', () => {
            let applied = rule.isApplied(target, 6, 1000, []);
            expect(applied).to.be.false;
        });

        it('current caption index between start and end', () => {
            let applied = rule.isApplied(target, 4, 1000, []);
            expect(applied).to.be.true;
        });
    });
});

describe('TimecodesDynamicCssRule#isApplied', () => {
    const target = document.createElement('span');
    target.setAttribute('class', 'word');

    describe('with unbounded timecodes range', () => {
        const rule = new TimecodesDynamicCssRule(['.word'], 'pup-timecodes-00\\:00\\:05\\.680', 5680);

        it('current caption timecode before the start', () => {
            let applied = rule.isApplied(target, 2, 5679, []);
            expect(applied).to.be.false;
        });

        it('current caption timecode after the start', () => {
            let applied = rule.isApplied(target, 2, 5680, []);
            expect(applied).to.be.true;
        });
    });

    describe('with bounded timecodes range', () => {
        const rule = new TimecodesDynamicCssRule(['.word'], 'pup-timecodes-00\\:00\\:05\\.680-00\\:00\\:08\\.388', 5680, 8388);

        it('current caption timecode before the start', () => {
            let applied = rule.isApplied(target, 2, 5679, []);
            expect(applied).to.be.false;
        });

        it('current caption timecode after the end', () => {
            let applied = rule.isApplied(target, 2, 8389, []);
            expect(applied).to.be.false;
        });

        it('current caption timecode between start and end', () => {
            let applied = rule.isApplied(target, 2, 6000, []);
            expect(applied).to.be.true;
        });
    });
});