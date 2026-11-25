import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import Carousel from './Carousel';

afterEach(cleanup);

test('project buttons expose their expanded state and control the project links', () => {
    render(<Carousel />);
    const portfolio = screen.getByRole('button', { name: 'This page' });
    const github = screen.getByRole('button', { name: 'Github' });
    const portfolioDetails = document.getElementById(portfolio.getAttribute('aria-controls'));

    portfolio.focus();
    expect(document.activeElement).toBe(portfolio);
    expect(portfolio.getAttribute('aria-expanded')).toBe('false');
    expect(portfolioDetails.hidden).toBe(true);

    fireEvent.click(portfolio);
    expect(portfolio.getAttribute('aria-expanded')).toBe('true');
    expect(within(portfolioDetails).getByRole('link', { name: 'View' })).toBeTruthy();

    fireEvent.click(github);
    expect(portfolio.getAttribute('aria-expanded')).toBe('false');
    expect(portfolioDetails.hidden).toBe(true);
    expect(screen.getByRole('link', { name: 'View' }).getAttribute('href')).toBe('https://github.com/kavorca92');
});
