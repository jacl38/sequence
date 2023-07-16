export function UUID() {
  const validCharacters = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
  const pieceLength = 4;
  const pieceCount = 3;
  let uuid = "";

  for (let i = 0; i < pieceCount; i++) {
    for (let j = 0; j < pieceLength; j++) {
      uuid += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
    }
    if (i < pieceCount - 1) {
      uuid += "-";
    }
  }
  return uuid;
}