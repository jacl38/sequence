import { BoardSpace, Chip } from "../../store/types"
import { tw } from "../../util/styled"

type CardProps = {
  cardType: BoardSpace,
  chip: Chip
}

const styles = {
  container: tw(
    "w-24 h-24",
    "relative",
    "bg-gradient-to-bl from-white to-stone-300 dark:from-stone-800 dark:to-stone-900",
    "bg-white dark:bg-stone-900",
    "hover:shadow-lg hover:scale-105",
    "rounded-xl",
    "select-none",
    "transition-all duration-100"
  ),
  suitIndicator: {
    base: tw(
      "absolute",
      "-translate-y-1/2",
      "text-4xl",
      "right-2 top-6"
    ),
    red: tw(
      "text-rose-500"
    ),
    black: tw(
      "text-neutral-900 dark:text-stone-300"
    ),
    wild: tw(
      "text-blue-700 dark:text-blue-500"
    )
  },
  valueIndicatorBase: tw(
    "absolute",
    "text-4xl",
    "font-bold",
    "-translate-x-1/2",
    "self-baseline",
    "left-6 bottom-3"
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

export default function Card({ cardType, chip }: CardProps) {

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
    <div className={styles.container}>
      <span className={suitStyle}>
        {symbol}
      </span>
      <span className={valueStyle}>
        {value}
      </span>
    </div>
  );
}