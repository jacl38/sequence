import React, { ReactNode } from "react";

/**
 * Utility function to merge class names to a single string. Useful for Tailwind CSS
 * @param args Class name or list of class names.
 * @returns Merged class name string.
 * @example tw("text-red-500", "bg-blue-500") // => "text-red-500 bg-blue-500"
 */
export function tw(...args: string[]) {
  return args.map(arg => arg.split(" ")).flat().join(" ");
}

/**
 * Utility function to create a JSX element constructor with a given tag and class name.
 * @param tag HTML tag name
 * @param style Class name string
 * @returns JSX element constructor with the given tag and class name
 */
export function el<T extends keyof JSX.IntrinsicElements>(tag: T | (string & {}), style: string) {
  type ElementProps = { children?: ReactNode | ReactNode[] } & JSX.IntrinsicElements[T];
  return (props: ElementProps) => React.createElement(tag, { className: style, ...props }, props.children);
}

export default {
  Button: el("button", tw(
    "bg-white dark:bg-black bg-opacity-10 dark:bg-opacity-10",
    "border-4",
    "border-opacity-20 border-white",
    "dark:border-black dark:border-opacity-20",
    "rounded-xl",
    "hover:scale-105",
    "py-2 px-3",
    "transition-all"
  ))
}