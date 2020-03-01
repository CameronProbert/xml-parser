# A very basic tag validator for xml/html.

## It works by pushing tags onto a stack when they open, and verifying they match when a closing tag is found.

## To run
* Edit `src/input.ts` with whatever xml/html you want to verify
* Run `yarn` in the console to install packages
* Run `yarn build` to build to the `dist/` folder
* Run `yarn start` to test the xml/html in the input file.

## To run tests
* Run `yarn` in the console to install packages
* Run `yarn test` to execute all tests
