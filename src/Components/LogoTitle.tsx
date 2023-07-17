import tw from "../util/tw";

const styles = {
  text: tw(
    "text-2xl",
    "font-black tracking-wide",
    "select-none",
    "relative group",
  ),
  decor: {
    container: tw(
      "group-hover:rotate-180",
      "transition-transform duration-500 ease-out",
      "origin-center",
      "absolute",
      "pointer-events-none",
      "w-full h-full flex justify-between"
    ),
    item: tw(
      "relative",
      "group-hover:-rotate-180",
      "flex items-center justify-center",
      "transition-transform duration-700"
    ),
    blackItem: tw(
      "absolute",
      "opacity-100 group-hover:opacity-0",
      "scale-100 group-hover:scale-0",
      "transition-[opacity,transform] duration-500"
    ),
    redItem: tw(
      "absolute",
      "text-rose-500",
      "scale-0 group-hover:scale-100",
      "opacity-0 group-hover:opacity-100",
      "transition-[opacity,transform] duration-500",
    )
  }
}

export default function LogoTitle() {
  return ( 
    <a href="/">
      <h1 className={styles.text}>
        <div className={styles.decor.container}>
          <span className={styles.decor.item}>
            <span className={styles.decor.blackItem}>&#9827;&#xFE0E;</span>
            <span className={styles.decor.redItem}>&#9830;&#xFE0E;</span>
          </span>
          <span className={styles.decor.item}>
            <span className={styles.decor.blackItem}>&#9824;&#xFE0E;</span>
            <span className={styles.decor.redItem}>&#9829;&#xFE0E;</span>
          </span>
        </div>
        <span className="ml-4 mx-4">Sequence</span>
      </h1>
    </a>
  );
}