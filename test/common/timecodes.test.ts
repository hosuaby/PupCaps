import {expect} from 'chai';
import {Timecode, toMillis} from '../../src/common/timecodes';

it('create Timecode', () => {
    const timecode = new Timecode(6158678);

    expect(timecode.hours).to.equals(1);
    expect(timecode.minutes).to.equals(42);
    expect(timecode.seconds).to.equals(38);
    expect(timecode.millis).to.equals(678);

    expect(timecode.hh).to.equals('01');
    expect(timecode.mm).to.equals('42');
    expect(timecode.ss).to.equals('38');
    expect(timecode.SSS).to.equals('678');

    expect(timecode.asString).to.equals('01:42:38,678');
});

it('should parse timecodes to millis', () => {
    const timecode = '01:42:38,678';
    const millis = toMillis(timecode);
    expect(millis).to.equals(6158678);
});