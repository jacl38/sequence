import { tw } from "../util/styled";

const styles = {
  container: tw(
    "bg-stone-300 dark:bg-stone-900",
    "transition-colors",
    "text-stone-600 dark:text-stone-200",
    "flex space-x-8 items-center",
    "py-4 px-8"
  ),
  link: tw(
    "text-stone-500 dark:text-stone-400",
    "hover:text-black dark:hover:text-white",
    "underline",
    "transition-colors"
  )
}

export default function Footer() {
  return (<>
    <footer className={styles.container}>
      <p>Designed and developed by <a href="https://jclark.space" className={styles.link}>Jack Clark</a></p>
      <a href="" className={styles.link}>Source</a>
    </footer>
  </>);
}