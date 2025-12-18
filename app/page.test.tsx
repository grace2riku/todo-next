import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

describe('Home (TODO List)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期レンダリング', () => {
    it('タイトルが正しく表示される', () => {
      render(<Home />);
      expect(screen.getByText('TODOリスト')).toBeInTheDocument();
    });

    it('入力フィールドが表示される', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      expect(input).toBeInTheDocument();
    });

    it('追加ボタンが表示される', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: '追加' });
      expect(button).toBeInTheDocument();
    });

    it('初期状態では空のメッセージが表示される', () => {
      render(<Home />);
      expect(
        screen.getByText('タスクがありません。新しいタスクを追加してください。')
      ).toBeInTheDocument();
    });
  });

  describe('TODOの追加', () => {
    it('新しいTODOが正常に追加される', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const button = screen.getByRole('button', { name: '追加' });

      await user.type(input, '買い物に行く');
      await user.click(button);

      expect(screen.getByText('買い物に行く')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('空のテキストでは追加できない', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const button = screen.getByRole('button', { name: '追加' });
      await user.click(button);

      expect(
        screen.getByText('タスクがありません。新しいタスクを追加してください。')
      ).toBeInTheDocument();
    });

    it('空白のみのテキストでは追加できない', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const button = screen.getByRole('button', { name: '追加' });

      await user.type(input, '   ');
      await user.click(button);

      expect(
        screen.getByText('タスクがありません。新しいタスクを追加してください。')
      ).toBeInTheDocument();
    });

    it('Enterキーで追加できる', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');

      await user.type(input, '読書する{Enter}');

      expect(screen.getByText('読書する')).toBeInTheDocument();
    });

    it('複数のTODOを追加できる', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      const button = screen.getByRole('button', { name: '追加' });

      await user.type(input, '買い物に行く');
      await user.click(button);

      await user.type(input, '掃除をする');
      await user.click(button);

      expect(screen.getByText('買い物に行く')).toBeInTheDocument();
      expect(screen.getByText('掃除をする')).toBeInTheDocument();
    });
  });

  describe('TODOの完了状態', () => {
    it('チェックボックスをクリックするとTODOが完了状態になる', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, '買い物に行く');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const todoText = screen.getByText('買い物に行く');
      expect(todoText).toHaveClass('line-through');
      expect(checkbox).toBeChecked();
    });

    it('完了状態のTODOを未完了に戻せる', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, '買い物に行く');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      await user.click(checkbox);

      const todoText = screen.getByText('買い物に行く');
      expect(todoText).not.toHaveClass('line-through');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('TODOの削除', () => {
    it('削除ボタンでTODOが削除される', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, '買い物に行く');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      expect(screen.queryByText('買い物に行く')).not.toBeInTheDocument();
      expect(
        screen.getByText('タスクがありません。新しいタスクを追加してください。')
      ).toBeInTheDocument();
    });

    it('複数のTODOから特定のものを削除できる', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');

      await user.type(input, '買い物に行く');
      await user.click(screen.getByRole('button', { name: '追加' }));

      await user.type(input, '掃除をする');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const deleteButtons = screen.getAllByRole('button', { name: '削除' });
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('買い物に行く')).not.toBeInTheDocument();
      expect(screen.getByText('掃除をする')).toBeInTheDocument();
    });
  });

  describe('タスクカウンター', () => {
    it('TODOがない場合はカウンターが表示されない', () => {
      render(<Home />);
      expect(screen.queryByText(/件のタスクが未完了/)).not.toBeInTheDocument();
    });

    it('未完了タスク数が正しく表示される', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'タスク1');
      await user.click(screen.getByRole('button', { name: '追加' }));

      await user.type(input, 'タスク2');
      await user.click(screen.getByRole('button', { name: '追加' }));

      expect(screen.getByText('2 / 2 件のタスクが未完了')).toBeInTheDocument();
    });

    it('完了したタスクは未完了数から除外される', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'タスク1');
      await user.click(screen.getByRole('button', { name: '追加' }));

      await user.type(input, 'タスク2');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(screen.getByText('1 / 2 件のタスクが未完了')).toBeInTheDocument();
    });

    it('すべてのタスクが完了した場合のカウンター', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'タスク1');
      await user.click(screen.getByRole('button', { name: '追加' }));

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(screen.getByText('0 / 1 件のタスクが未完了')).toBeInTheDocument();
    });
  });
});
