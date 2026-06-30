// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('future component test environment', () => {
  it('supports TSX in jsdom while domain tests remain in node', () => {
    render(<p>OFFZY DOM ready</p>);
    expect(screen.getByText('OFFZY DOM ready')).toBeTruthy();
  });
});
