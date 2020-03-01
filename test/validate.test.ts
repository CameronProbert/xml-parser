import { validate } from "../src/validate"

describe('non-nested tags', () => {
    it('reads empty string as valid', () => {
        const input = "";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })

    it.each([
        ["outside text <A> valid inside text</A>"],
        ["<A> valid inside text</A>"],
        ["The following text<C>is centred</C>"],
        ["The following text<B>is in boldface</B>"],
        ["<A> valid inside text</A> and outside text"],
    ])('reads matching tags as valid', (input) => {
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })

    it.each([
        ['A', "should have opening tag</A>"],
        ['multiChar', "should have opening </multiChar> tag"],
        ['A', "should have o</A>pening tag"],
    ])('is invalid when missing first tag', (tag, input) => {
        const actual = validate(input);
        expect(actual).toBe(`Expected # found </${tag}>`)
    })

    it.each([
        ['A', "<A>should have closing tag"],
        ['B', "should have <B>closing tag"],
        ['biggerTag', "should have closing tag<biggerTag>"],
    ])('is invalid when missing last tag', (tag, input) => {
        const actual = validate(input);
        expect(actual).toBe(`Expected </${tag}> found #`)
    })

    it.each([
        ["should have opening tag</largeTag>"],
        ["should have opening </largeTaglargeTaglargeTaglargeTag> tag"],
        ["should have o</largeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTag>pening tag"],
    ])('accepts multi-character tags', () => {
        const input = "<largeTag> valid inside text</largeTag>";
        const actual = validate(input);
        expect(actual).toBe("Correctly tagged paragraph")
    })
})