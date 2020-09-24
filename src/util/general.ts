export interface GeneralUtilPrototype {
  b64: {
    encode(s: string): string;
    decode(s: string): string;
  };
}

function generalUtil(): GeneralUtilPrototype {
  return {
    b64: {
      encode(s) {
        return btoa(s);
      },
      decode(s) {
        return atob(s);
      },
    },
  };
}

export const GeneralUtil = generalUtil();
