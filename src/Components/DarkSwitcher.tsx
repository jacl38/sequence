import { useDarkMode } from "../Hooks/useDarkMode"
import tw from "../util/tw";

const styles = {
  container: tw(
    "relative group",
    "w-12 h-12 hover:w-40",
    "flex items-center justify-center",
    "font-black",
    "rounded-full",
    "bg-white dark:bg-black",
    "bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20",
    "border-4 border-opacity-20 border-white dark:border-black",
    "overflow-hidden",
    "transition-all"
  ),
  label: tw(
    "absolute",
    "right-12",
    "whitespace-nowrap",
    "group-hover:opacity-100 opacity-0 transition-opacity"
  ),
  moon: tw(
    "absolute right-3",
    "dark:rotate-90 dark:scale-0",
    "transition-all"
  ),
  sun: tw(
    "absolute right-3",
    "rotate-90 dark:rotate-0",
    "scale-0 dark:scale-100",
    "text-stone-200",
    "transition-all"
  )}

export default function DarkSwitcher() {

  const [dark, setDark] = useDarkMode(false);

  return (
    <button className={styles.container} onClick={() => setDark(!dark)}>
      <span className={styles.label}>{dark ? "Light" : "Dark"} Mode</span>
      <span className={styles.sun}>&#9728;&#xFE0E;</span>
      <span className={styles.moon}>&#127769;&#xFE0E;</span>
    </button>
  )
}