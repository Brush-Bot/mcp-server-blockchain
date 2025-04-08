export const getToolOutput = (obj: object) => {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(obj, null, 2),
      },
    ],
  } as {
    content: {
      type: "text";
      text: string;
    }[];
  };
};
