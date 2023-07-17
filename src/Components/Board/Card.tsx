import { BoardSpace, Chip } from "../../store/types"
import { tw } from "../../util/styled"

type CardProps = {
  cardType: BoardSpace,
  chip: Chip,
  onClick?: () => void
}

const styles = {
  container: tw(
    "w-14 h-14",
    "relative",
    "bg-gradient-to-bl from-white to-stone-200 dark:from-stone-800 dark:to-stone-900",
    "hover:from-stone-200 hover:to-stone-300",
    "dark:hover:from-stone-700 dark:hover:to-stone-800",
    "shadow-inner shadow-stone-500/25 dark:shadow-stone-950/25",
    "hover:shadow-lg hover:scale-125",
    "hover:z-10",
    "rounded-2xl",
    "select-none",
    "text-xl md:text-2xl",
    "transition-all duration-300 ease-out-back"
  ),
  suitIndicator: {
    base: tw(
      "absolute",
      "-translate-y-1/2",
      "right-1 top-3"
    ),
    red: tw(
      "text-rose-500",
      "drop-shadow-[-1px_2px_0_rgba(255,63,94,0.5)]"
    ),
    black: tw(
      "text-neutral-900 dark:text-stone-300",
      "drop-shadow-[-1px_2px_0_rgba(23,23,23,0.5)]",
      "dark:drop-shadow-[-1px_2px_0_rgba(214,211,209,0.5)]",
    ),
    wild: tw(
      "text-blue-700 dark:text-blue-500",
      "drop-shadow-[-1px_2px_0_rgba(59,130,246,0.5)]"
    )
  },
  valueIndicatorBase: tw(
    "absolute",
    "font-bold",
    "-translate-x-1/2",
    "self-baseline",
    "left-4 bottom-1"
  )
}

function suitToUnicode(suit: BoardSpace["suit"]) {
  switch(suit) {
    case "clubs": return "\u2663\uFE0E";
    case "diamonds": return "\u2666\uFE0E";
    case "hearts": return "\u2665\uFE0E";
    case "spades": return "\u2660\uFE0E";
    case "wild": return "\u2605\uFE0E";
  }
}

function suitToColor(suit: BoardSpace["suit"]) {
  switch(suit) {
    case "clubs": return "black";
    case "diamonds": return "red";
    case "hearts": return "red";
    case "spades": return "black";
    case "wild": return "wild";
  }
}

function valueToChar(value: BoardSpace["value"]) {
  switch(value) {
    case "ace": return "A";
    case "two": return "2";
    case "three": return "3";
    case "four": return "4";
    case "five": return "5";
    case "six": return "6";
    case "seven": return "7";
    case "eight": return "8";
    case "nine": return "9";
    case "ten": return "10";
    case "jack": return "J";
    case "queen": return "Q";
    case "king": return "K";
    case "wild": return "?";
  }
}

export default function Card({ cardType, chip, onClick }: CardProps) {

  const colorName = suitToColor(cardType.suit);
  const suitStyle = tw(
    styles.suitIndicator.base,
    styles.suitIndicator[colorName]
  );
  const symbol = suitToUnicode(cardType.suit);

  const valueStyle = tw(
    styles.valueIndicatorBase,
    styles.suitIndicator[colorName]
  );
  const value = valueToChar(cardType.value);

  return (
    <button onClick={onClick} className={styles.container}>
      <span className={suitStyle}>
        {symbol}
      </span>
      <span className={valueStyle}>
        {value}
      </span>
    </button>
  );
}