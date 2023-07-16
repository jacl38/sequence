export const validRoomIDCharacters = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";

export function filterRoomIDInput(value: string) {
  let filteredValue = value.toUpperCase().split("").filter(char => validRoomIDCharacters.includes(char)).join("");
  if(filteredValue.length > 12) filteredValue.slice(0, 12);
  const parts = [filteredValue.slice(0, 4), filteredValue.slice(4, 8), filteredValue.slice(8, 12)]

  return parts.filter(part => part.length > 0).join("-");
}

export function isValidRoomID(value: string) {
  const filtered = value.split("-").join("");
  return filtered.length === 12 && filtered.split("").every(char => validRoomIDCharacters.includes(char));
}