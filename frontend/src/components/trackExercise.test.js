import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TrackExercise from './trackExercise';

describe('TrackExercise Component', () => {
  test('renders the component', () => {
    const { container } = render(<TrackExercise currentUser="testUser" />);
    expect(container).toBeInTheDocument();
  });

  test('updates state on exercise icon click', () => {
    const { getByText } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.click(getByText('Running'));
    expect(state.exerciseType.toHaveValue('Running'));
  });

  test('updates state on mood icon click', () => {
    const { getByText } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.click(getByText('Happy'));
    expect(state.mood.toHaveValue('Happy'));
  });

  test('speed calculates correctly', () => {
    const { getByText } = render(<TrackExercise currentUser="testUser" />);
    fireEvent.input(getByText('10'));
    expect(state.distance.toHaveValue(10));
    fireEvent.input(getByText('60'));
    expect(state.duration.toHaveValue(60));
    expect(state.speed.toHaveValue(10));
  });

  test('submits the form and displays success message', async () => {
    const { getByText } = render(<TrackExercise currentUser="testUser" />);
    // Trigger form submission
    fireEvent.click(getByText('Save activity'));
    await waitFor(() => {
      expect(getByText('Activity logged successfully! Well done!')).toBeInTheDocument();
    });
  });
});