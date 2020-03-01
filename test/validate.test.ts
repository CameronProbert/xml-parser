import { validate } from "../src/validate"

describe('non-nested tags', () => {
    it('reads empty string as valid', () => {
        const input = "";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })

    it('reads matching tags internally as valid', () => {
        const input = "outside text <A> valid inside text</A>";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })

    it('reads matching tags externally as valid', () => {
        const input = "<A> valid inside text</A>";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })

    it('is invalid when missing first tag', () => {
        const input = "should have opening tag</A>";
        const actual = validate(input);
        expect(actual).toBe("Expected # found </A>")
    })

    it('is invalid when missing last tag', () => {
        const input = "<A>should have closing tag";
        const actual = validate(input);
        expect(actual).toBe("Expected </A> found #")
    })

    it('accepts multi-character tags', () => {
        const input = "<largeTag> valid inside text</largeTag>";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })
})