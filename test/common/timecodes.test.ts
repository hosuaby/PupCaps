import {expect} from 'chai';
import {toMillis} from '../../src/common/timecodes';

it('should parse timecodes to millis', () => {
    const timecode = '01:42:38.678';
    const millis = toMillis(timecode);
    expect(millis).to.equals(6158678);
});