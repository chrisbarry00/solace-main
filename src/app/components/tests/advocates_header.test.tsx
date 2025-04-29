import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdvocatesHeader from '../advocates_header';
import '@testing-library/jest-dom';

describe('AdvocatesHeader Component', () => {
    const mockHandleSort = jest.fn();

    const defaultProps = {
        handleSort: mockHandleSort,
        sortDirection: 'asc' as const,
        sortKey: 'firstName',
    };

    it('renders all headers correctly', () => {
        render(<AdvocatesHeader {...defaultProps} />);

        expect(screen.getByText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByText(/City/i)).toBeInTheDocument();
        expect(screen.getByText(/Degree/i)).toBeInTheDocument();
        expect(screen.getByText(/Specialties/i)).toBeInTheDocument();
        expect(screen.getByText(/Experience/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone/i)).toBeInTheDocument();
    });

    it('calls handleSort with the correct field when a sortable header is clicked', () => {
        render(<AdvocatesHeader {...defaultProps} />);

        const firstNameHeader = screen.getByText(/First Name/i);
        fireEvent.click(firstNameHeader);

        expect(mockHandleSort).toHaveBeenCalledWith('firstName');
    });

    it('displays the correct sort direction indicator for the active sort key', () => {
        render(<AdvocatesHeader {...defaultProps} />);

        const firstNameHeader = screen.getByText(/First Name/i);
        expect(firstNameHeader).toHaveTextContent('▲');

        const lastNameHeader = screen.getByText('Last Name');
        expect(lastNameHeader).not.toHaveTextContent('▲');
        expect(lastNameHeader).not.toHaveTextContent('▼');
    });

    it('renders the correct sort direction indicator when sortDirection is "desc"', () => {
        render(<AdvocatesHeader {...defaultProps} sortDirection="desc" />);

        const firstNameHeader = screen.getByText(/First Name/i);
        expect(firstNameHeader).toHaveTextContent('▼');
    });
});