import { tw } from "../../util/styled";

const styles = {
  container: tw(
    // "bg-red-500"
    "relative",
    "md:w-16 max-md:h-16"
  ),
  questionBubble: tw(
    "absolute group",
    "w-8 aspect-square hover:w-auto hover:aspect-auto hover:p-3",
    "md:-translate-y-1/2 max-md:hover:-translate-y-3/4 max-md:-translate-x-1/2",
    "whitespace-nowrap",
    "bg-white border-2 border-stone-300",
    "dark:bg-stone-700 dark:border-stone-600",
    "font-black",
    "rounded-3xl",
    "cursor-help select-none",
    "hover:scale-125 hover:shadow-md hover:z-10",
    "transition-all duration-150"
  ),
  helpBlock: tw(
    "group-hover:animate-fadeIn",
    "group-hover:block hidden",
    "text-xs font-semibold leading-3"
  )
}

export default function Helper() {
  return (<>
    <div className={styles.container}>
      <div className={styles.questionBubble}>
        <span className="absolute left-2.5 top-0.5 group-hover:animate-fadeOut">?</span>
        <div className={styles.helpBlock}>
          <p className="text-lg">Help</p>
          <p>- Take turns placing chips on the board.</p>
          <p>- Red Jacks (❤️/♦️) are wild cards and can be placed anywhere.</p>
          <p>- Black Jacks (♠️/♣️) can remove your opponents chips.</p>
          <p>- The corners (⭐) are free spaces and count towards either player's sequences.</p>
          <p className="font-bold">- The first player to get 5 chips in a row wins!</p>
        </div>
      </div>
    </div>
  </>);
}