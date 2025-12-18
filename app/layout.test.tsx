import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  describe('metadata', () => {
    it('正しいタイトルが設定されている', () => {
      expect(metadata.title).toBe('TODO リスト');
    });

    it('正しい説明が設定されている', () => {
      expect(metadata.description).toBe('シンプルなTODOリストアプリケーション');
    });
  });

  describe('レイアウトレンダリング', () => {
    it('children が正しくレンダリングされる', () => {
      const { getByText } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('複数のchildrenが正しくレンダリングされる', () => {
      const { getByText } = render(
        <RootLayout>
          <div>
            <p>First Element</p>
            <p>Second Element</p>
          </div>
        </RootLayout>
      );

      expect(getByText('First Element')).toBeInTheDocument();
      expect(getByText('Second Element')).toBeInTheDocument();
    });
  });
});
