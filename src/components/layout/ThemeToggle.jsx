import { useTheme } from '../../context/ThemeContext';
import Icon from '../ui/Icon';

export default function ThemeToggle({ className = '' }) {
  const { toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} aria-label="Toggle light and dark mode" className={`grid size-10 place-items-center rounded-xl transition hover:bg-black/10 dark:hover:bg-white/10 ${className}`}>
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
