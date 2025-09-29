# Mini Employee Dashboard (Angular v20)
Live Demo Here: https://blast0.github.io/Mini-Employee-Dashboard-Deployment/#/

How to use:
1. Run `npm install` to install dependencies.
2. Run `ng serve` (Angular CLI v20+) and open `http://localhost:4200`.

How to Run Tests:
1. ng test

This is a minimal Angular (v20) project scaffold for the **Mini Employee Dashboard** assignment.

Assumptions for Extra Validation: 

Name field:
- Name must not be longer than 100 characters
- Name should not contain symbols like !@$#%^&*... 
- Empty spaces must be removed from both ends (the beginning and the end)

Email field:
- Empty spaces must be removed from both ends (the beginning and the end)

Core Features:
- List, Add, Edit, and Delete employees with real-time updates.
- Data Persistence: Employee data is persisted in localStorage via an Angular service, ensuring data remains even after a page reload.
- Form validation (name ≥3 chars, valid email, date not in future)
- Sorting by Name and Date of Joining.
- Filtering by Department.
- Search by Name or Email (case-insensitive).

Bonus Features:
- Dark mode toggle
- Export to CSV
- Dynamic Modal to Verify delete/other delicate operations (Resuable and Customizable for other tasks)
- 26 Test specs

Technologies Used:
- Frontend: Angular (v20)
- Data Persistence: localStorage
- Styling: Angular material and CSS

Known Issues:
- Cross-browser Persistence: Currently, data in localStorage is only available on the browser where it was saved and does not sync across different devices or browsers.
- Date Validation: The date validation doesn’t handle edge cases like different time zones; the date should be compared against the current server date.

Testing: 
This project uses Jasmine as the testing framework and Karma as the test runner. They are integrated together to provide unit testing for the application. Below are the tools and versions used in the project:

- Jasmine (v5.x.x): A behavior-driven testing framework used for writing test cases and assertions in a human-readable format.
- Karma (v6.x.x): A test runner that executes Jasmine tests in multiple browsers and provides real-time feedback during development.
- Karma Plugins:
    karma-chrome-launcher: Launches tests in Chrome.
    karma-jasmine: Adapter for using Jasmine with Karma.
    karma-coverage: Generates code coverage reports for your tests.
    karma-jasmine-html-reporter: Provides a detailed HTML report of test results in the browser.