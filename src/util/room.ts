export const validRoomIDCharacters = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";

export function filterRoomIDInput(value: string) {
  let filteredValue = value.toUpperCase().split("").filter(char => validRoomIDCharacters.includes(char)).join("");
  if(filteredValue.length > 12) filteredValue.slice(0, 12);
  const parts = [filteredValue.slice(0, 4), filteredValue.slice(4, 8), filteredValue.slice(8, 12)]

  let result = parts.filter(part => part.length > 0).join("-");
  if(result.length === 4 || result.length === 9) result += "-";
  return result;
}

export function isValidRoomID(value: string) {
  const filtered = value.split("-").join("");
  return filtered.length === 12 && filtered.split("").every(char => validRoomIDCharacters.includes(char));
}