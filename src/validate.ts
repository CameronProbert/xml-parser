export function validate(input: string): string {
	const tagRegex = /<[/]?[a-zA-Z]*?>/g;
	const results = input.match(tagRegex);
	const currentlyOpenTags: string[] = [];
	// const result = tagRegex.exec(input);

	if (!results)
		return "Correctly tagged paragraph";

	for (const tag of results) {
		const isClosingTag = tag.startsWith("</");
		if (!isWellFormedTag(tag, isClosingTag)) {
			return `Tag ${tag} is malformed`;
		}

		if (!isClosingTag) {
			currentlyOpenTags.push(tag);
		} else {
			const matchingTag: string | undefined = currentlyOpenTags.pop();
			try {
				isWellFormedPair(matchingTag, tag);
			} catch (e) {
				return e;
			}
		}
	}

	if (currentlyOpenTags.length) {
		const latestTag = currentlyOpenTags.pop()!;
		return `Expected </${getTagContents(latestTag)}> found #`;
	}

	return "Correctly tagged paragraph";
}

function isWellFormedPair(first: string | undefined, last: string): boolean {
	// console.log(`testing '${first}' vs '${last}'`);
	if (first === undefined) {
		throw `Expected # found </${getTagContents(last!)}>`;
	}
	const firstWithoutAngles = getTagContents(first);
	const lastWithoutAngles = getTagContents(last);
	if (firstWithoutAngles !== lastWithoutAngles)
		throw `Expected </${getTagContents(first)}> found </${getTagContents(last)}>`;
	return true;
}

function isWellFormedTag(input: string, isClosingTag: boolean): boolean {
	if (!input.startsWith("<")) return false;
	if (!input.endsWith(">")) return false;

	const inputWithoutAngles = input.substr(1, input.length - 2);
	if (isClosingTag && !inputWithoutAngles.startsWith("/")) return false;
	if (!isClosingTag && inputWithoutAngles.includes("/")) return false;
	if (inputWithoutAngles.includes(" ")) return false;
	if (inputWithoutAngles.includes("<")) return false;
	if (inputWithoutAngles.includes(">")) return false;
	return true;
}

function getTagContents(tag: string): string {
	return tag.startsWith("</")
		? tag.substr(2, tag.length - 3)
		: tag.substr(1, tag.length - 2);
}