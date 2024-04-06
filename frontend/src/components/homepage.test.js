// This is a unit test file for the homepage.js component, it is using Jest and is being run by react-scripts.
// The package.json has to be adapted to be able to run the tests successfully.
// Docker is used to run the tests, the Frontend Dockerfile needs to contain the 'RUN npm test' command at the end of the build stage.
// The tests will run AUTOMATICALLY when Docker is run, if the app build successfully then the tests have passed!!
// The test cases should be updated when new features are added to the homepage.js file.
// There has been difficulty mocking the GraphQL queries, so we have been unable to test functionality to do with the data.
//
// --- How to run the tests ---
// To fix / add to the test file:
// Change to frontend directory in terminal - 'cd frontend'.
// Run docker command: 'docker compose run --build --rm frontend test'
// If they pass, you will not see outcome of tests in the terminal.
// If they fail, the test results will be shown in the terminal.

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from "@apollo/client/testing";
import '@testing-library/jest-dom';
import Homepage from './homepage';
import { LAST_EXERCISE_QUERY, CALORIES_QUERY, CALORIES_GOAL_QUERY} from './queries/graphql';
import { expect } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';

jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts')
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => (
            <OriginalModule.ResponsiveContainer width={800} height={800}>
                {children}
            </OriginalModule.ResponsiveContainer>
        ),
    }
})

global.ResizeObserver = require("resize-observer-polyfill");

const mocks = [
    {
        request: {
            query: LAST_EXERCISE_QUERY,
            variables: {
                name: "testUser"
            }
        },
        result: {
            data: {
                homePage: {
                    results: {
                        _id: 0,
                        exercise: "Running",
                        duration: 60,
                        date: "05-04-2024"
                    }
                }
            }
        },
        maxUsageCount: Number.POSITIVE_INFINITY
    },
    {
        request: {
            query: CALORIES_QUERY,
            variables: {
                name: "testUser",
                today_date: "05-04-2024"
            }
        },
        result: {
            data: {
                dailyCalories: {
                    results: {
                        _id: 0,
                        daily_calories: 315
                    }
                }
            }
        },
        maxUsageCount: Number.POSITIVE_INFINITY
    },
    {
        request: {
            query: CALORIES_GOAL_QUERY,
            variables: {
                name: "testUser"
            }
        },
        result: {
            data: {
                caloriesGoal: {
                    results: {
                        _id: 0,
                        value: 600
                    }
                }
            }
        },
        maxUsageCount: Number.POSITIVE_INFINITY
    }

];

describe('Homepage Component', () => {

  test('renders the component', async () => {

    const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
            <Homepage currentUser="testUser" today_date="05-04-2024" />
            </BrowserRouter>
        </MockedProvider>
    );
    await expect(container).toBeInTheDocument();

  });

  test('personalised title with users name', () => {
    const { getByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
            <Homepage currentUser="testUser" today_date="05-04-2024" />
            </BrowserRouter>
        </MockedProvider>
    );
    const title = getByTestId('title');
    expect(title.textContent).toBe('Hello, testUser!');
  });

//   test('users last exercise is rendered', async () => {
//     const {getByTestId } = render(
//         <MockedProvider mocks={mocks} addTypename={false}>
//             <BrowserRouter>
//             <Homepage currentUser="testUser" today_date="05-04-2024" />
//             </BrowserRouter>
//         </MockedProvider>
//     );

//     const lastExField = await waitFor(() => getByTestId('lastEx'));

//     expect(lastExField.textContent).toBe('Well done on Running');

//   });

// Test not working - can't get the chart to render properly within the test.
//   test('clicking emoji changes colour theme', async () => {
//     const { getByTestId } = render(
//         <MockedProvider mocks={mocks} addTypename={false}>
//             <BrowserRouter>
//             <Homepage currentUser="testUser" today_date="05-04-2024" />
//             </BrowserRouter>
//         </MockedProvider>
//     );
//     fireEvent.click(getByTestId('mood'));

//     const chart = getByTestId('chart');
//     expect(await chart.fill.toBe('#83F0F3'));
//   });

});
