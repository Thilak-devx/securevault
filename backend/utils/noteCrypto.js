import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("Missing ENCRYPTION_KEY environment variable.");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptText(value) {
  if (typeof value !== "string" || !value.length) {
    return value;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "enc",
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decryptText(value) {
  if (typeof value !== "string" || !value.startsWith("enc:")) {
    return value;
  }

  const [, ivHex, authTagHex, encryptedHex] = value.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    return value;
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function decryptNote(note, options = {}) {
  if (!note) {
    return note;
  }

  const { revealLockedContent = false } = options;

  const noteObject =
    typeof note.toObject === "function"
      ? note.toObject()
      : { ...note };

  const isLocked = Boolean(noteObject.isLocked);
  const decryptedTitle = decryptText(noteObject.title);
  const decryptedContent = isLocked
    ? revealLockedContent
      ? decryptText(noteObject.content)
      : ""
    : decryptText(noteObject.content);

  delete noteObject.notePassword;
  return {
    ...noteObject,
    title: decryptedTitle,
    content: decryptedContent,
  };
}
