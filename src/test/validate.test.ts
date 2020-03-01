import { validate } from "../validate";

describe("validate function", () => {
	describe("single pair, non-nested tags", () => {
		it("reads empty string as valid", () => {
			const input = "";
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
    
		it.each([
			["<></>"], // It's valid in React ;)
			["<emptyEl></emptyEl>"],
			["outside text <A> valid inside text</A>"],
			["<A> valid inside text</A>"],
			["The following text<C>is centred</C>"],
			["The following text<B>is in boldface</B>"],
			["<A> valid inside text</A> and outside text"],
		])("reads matching tags as valid", (input) => {
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
    
		it.each([
			["A", "should have opening tag</A>"],
			["multiChar", "should have opening </multiChar> tag"],
			["A", "should have o</A>pening tag"],
		])("is invalid when missing first tag", (tag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected # found </${tag}>`);
		});
    
		it.each([
			["A", "<A>should have closing tag"],
			["B", "should have <B>closing tag"],
			["biggerTag", "should have closing tag<biggerTag>"],
		])("is invalid when missing last tag", (tag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${tag}> found #`);
		});
    
		it.each([
			["A", "B", "<A>should have closing tag</B>"],
			["B", "longerTag", "should have <B>closing</longerTag> tag"],
			["biggerTag", "C", "should have closing tag<biggerTag></C>"],
		])("is invalid when tags do not match", (expectedTag, actualTag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${expectedTag}> found </${actualTag}>`);
		});
    
		it.each([
			["should have opening tag</largeTag>"],
			["should have opening </largeTaglargeTaglargeTaglargeTag> tag"],
			["should have o</largeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTag>pening tag"],
		])("accepts multi-character tags", () => {
			const input = "<largeTag> valid inside text</largeTag>";
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
	});
    
	describe("multi-pair, non-nested tags", () => {
		it.each([
			["<A>outside</A> text <A> valid inside text</A>"],
			["<firstTag> val</firstTag><secondTag>id inside text</secondTag>"],
		])("reads matching tags as valid", (input) => {
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
    
		it.each([
			["A", "<A>outside</A> text valid inside text</A>"],
			["A", "outside</A> text <A> valid inside text</A>"],
			["firstTag", " val</firstTag><secondTag>id inside text</secondTag>"],
			["secondTag", "<firstTag> val</firstTag>id inside text</secondTag>"],
		])("is invalid when missing first tag", (mismatchedTag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected # found </${mismatchedTag}>`);
		});
    
		it.each([
			["B", "<A>should </A>have closing ta<B>g"],
			["tag", "should have <B>c</B>losing tag<tag>"],
			["biggerTag", "<N></N>should have closing tag<biggerTag>"],
		])("is invalid when missing last tag", (tag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${tag}> found #`);
		});
    
		it.each([
			["C", "B", "<A>should have</A><C> closing tag</B>"],
			["B", "longerTag", "should <bold>have</bold> <B>closing</longerTag> tag"],
			["biggerTag", "C", "should have closing tag<X></X><biggerTag></C>"],
		])("is invalid when tags do not match", (expectedTag, actualTag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${expectedTag}> found </${actualTag}>`);
		});
    
		it.each([
			["should have opening<largeTag> tag</largeTag>"],
			["<largeTaglargeTaglargeTaglargeTag>should have opening </largeTaglargeTaglargeTaglargeTag> tag"],
			["should have o<largeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTag></largeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTaglargeTag>pening tag"],
		])("accepts multi-character tags", (input) => {
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
	});
    
	describe("multi-pair, nested tags", () => {
		it.each([
			["<A>outside<A> text </A> valid inside text</A>"],
			["<firstTag> val<secondTag>id inside text</secondTag></firstTag>"],
		])("reads matching tags as valid", (input) => {
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
    
		it.each([
			["A", "<A>should <B>have closing ta</B>g"],
			["N", "<N>should have closing tag<biggerTag></biggerTag>"],
		])("is invalid when missing last tag", (tag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${tag}> found #`);
		});
    
		it.each([
			["C", "B", "<A>should have<C> closing tag</B></A>"],
			["B", "bold", "should <bold>have <B>closing</bold></longerTag> tag"]
		])("is invalid when tags do not match", (expectedTag, actualTag, input) => {
			const actual = validate(input);
			expect(actual).toBe(`Expected </${expectedTag}> found </${actualTag}>`);
		});
    
		it("accepts multi-character tags", () => {
			const input = "should<firstTag> have opening<largeTag> tag</largeTag></firstTag>";
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
	});

	describe("Given sample input", () => {
		it("1. is valid", () => {
			const input = "The following text<C><B>is centred and in boldface</B></C>";
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
        
		it("2. is valid", () => {
			// This one is failing. It might be meant to fail as surely <d> is an open tag with no close.
			const input = "<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence";
			const actual = validate(input);
			expect(actual).toBe("Correctly tagged paragraph");
		});
        
		it("3. is invalid", () => {
			const input = "<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>";
			const actual = validate(input);
			expect(actual).toBe("Expected </C> found </B>");
		});
        
		it("4. is invalid", () => {
			const input = "<B>This should be in boldface, but there is an extra closing tag</B></C>";
			const actual = validate(input);
			expect(actual).toBe("Expected # found </C>");
		});
        
		it("5. is invalid", () => {
			const input = "<B><C>This should be centred and in boldface, but there is a missing closing tag</C>";
			const actual = validate(input);
			expect(actual).toBe("Expected </B> found #");
		});
	});
});
