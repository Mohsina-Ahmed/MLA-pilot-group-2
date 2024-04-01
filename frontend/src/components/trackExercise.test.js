// This is a unit test file for the trackExercise.js component, it is using Jest and is being run by react-scripts.
// The package.json has to be adapted to be able to run the tests successfully.
// Docker is used to run the tests, the Frontend Dockerfile needs to contain the 'RUN npm test' command at the end of the build stage.
// The tests will run AUTOMATICALLY when Docker is run, if the app build successfully then the tests have passed!!
// The test cases should be updated when new features are added to the trackExercise.js file.
//
// --- How to run the tests ---
// To fix / add to the test file:
// Change to frontend directory in terminal - 'cd frontend'.
// Run docker command: 'docker compose run --build --rm frontend test'
// If they pass, you will not see outcome of tests in the terminal.
// If they fail, the test results will be shown in the terminal.

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TrackExercise from './trackExercise';
import { expect } from '@jest/globals';

describe('TrackExercise Component', () => {

  test('renders the component', () => {
    const { container } = render(<TrackExercise currentUser="testUser" />);
    expect(container).toBeInTheDocument();
  });

  test('distance is hidden when tracking workout', () => {
    const { getByTestId } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.click(getByTestId('Gym Icon'));

    const distance = getByTestId('distance');
    expect(distance.className).toBe('invisible');
  });

  test('reps and sets is visible when tracking workout', () => {
    const { getByTestId } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.click(getByTestId('Gym Icon'));

    const repsField = getByTestId('reps');
    const setsField = getByTestId('sets');
    expect(repsField).toBeVisible();
    expect(setsField).toBeVisible();
  });

  test('speed calculates correctly', () => {
    const { getByTestId } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.input(getByTestId('distance').querySelector('input'), { target: { value: '10' } });
    fireEvent.input(getByTestId('duration').querySelector('input'), { target: { value: '60' } });

    const speedInput = getByTestId('speed').querySelector('input');
    expect(speedInput.value).toBe('10.00');
  });
  
  test('pace calculates correctly', () => {
    const { getByTestId } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.input(getByTestId('distance').querySelector('input'), { target: { value: '8' } });
    fireEvent.input(getByTestId('duration').querySelector('input'), { target: { value: '45' } });
  
    const paceInput = getByTestId('pace').querySelector('input');
    expect(paceInput.value).toBe('5.63');
  });

  test('calories calculates correctly', () => {
    const { getByTestId } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.input(getByTestId('duration').querySelector('input'), { target: { value: '60' } });
    fireEvent.input(getByTestId('intensity').querySelector('input'), { target: { value: '5' } });
    const caloriesInput = getByTestId('calories').querySelector('input');
    expect(caloriesInput.value).toBe(((( 7 * 75 * 3.5 ) / 200 ) * 60).toFixed(0));
  });
});
