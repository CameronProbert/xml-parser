export function validate(input: string): string {
    const tagRegex = /<.*?>/g
    const result = input.match(tagRegex);
    // const result = tagRegex.exec(input);
    console.log('found:', result)
    // found tags
    if (result && result.length) {
        while (result.length) {
            const first = result.shift();
            if (result.length % 2 === 0) {
                const isDanglingOpeningTag = !first!.startsWith('</')
                return isDanglingOpeningTag 
                    ? `Expected </${getTagContents(first!)}> found #`
                    : `Expected # found </${getTagContents(first!)}>`;
            }
            const last = result.pop();
            if (!isWellFormedPair(first!, last!))
                return 'Mismatched tags'
        }
    }

    return "Correctly tagged paragraph";
}

export function isWellFormedTag(input: string, isClosingTag: boolean): boolean {
    if (!input.startsWith('<')) return false;
    if (!input.endsWith('>')) return false;

    const inputWithoutAngles = input.substr(1, input.length - 2);
    if (isClosingTag && !inputWithoutAngles.startsWith('/')) return false;
    if (!isClosingTag && inputWithoutAngles.includes('/')) return false;
    if (inputWithoutAngles.includes(' ')) return false;
    if (inputWithoutAngles.includes('<')) return false;
    if (inputWithoutAngles.includes('>')) return false;
    return true;
}

export function isWellFormedPair(first: string, last: string): boolean {
    console.log(`testing '${first}' vs '${last}'`);
    
    const firstIsWellFormed = isWellFormedTag(first, false)
    const lastIsWellFormed = isWellFormedTag(last, true)
    if (!firstIsWellFormed || !lastIsWellFormed) {
        console.log({firstIsWellFormed, lastIsWellFormed});
        return false;
    }
    const firstWithoutAngles = getTagContents(first);
    const lastWithoutAngles = getTagContents(last);
    return (firstWithoutAngles === lastWithoutAngles);
}

export function getTagContents(tag: string): string {
    return tag.startsWith('</')
        ? tag.substr(2, tag.length - 3)
        : tag.substr(1, tag.length - 2)
}