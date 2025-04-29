import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvocatesFooter from '../advocates_footer';

describe('AdvocatesFooter Component', () => {
  const mockHandlePageChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with correct text', () => {
    render(<AdvocatesFooter handlePageChange={mockHandlePageChange} page={1} totalPages={5}/>);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('disables the "Previous" button on the first page', () => {
    render(<AdvocatesFooter handlePageChange={mockHandlePageChange} page={1} totalPages={5}/>);
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  test('disables the "Next" button on the last page', () => {
    render(<AdvocatesFooter handlePageChange={mockHandlePageChange} page={5} totalPages={5}/>);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  test('calls handlePageChange with the correct value when "Previous" is clicked', () => {
    render(<AdvocatesFooter handlePageChange={mockHandlePageChange} page={2} totalPages={5}/>);
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);
    expect(mockHandlePageChange).toHaveBeenCalledWith(1);
  });

  test('calls handlePageChange with the correct value when "Next" is clicked', () => {
    render(<AdvocatesFooter handlePageChange={mockHandlePageChange} page={2} totalPages={5}/>);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(mockHandlePageChange).toHaveBeenCalledWith(3);
  });
});