// @ts-ignore
module.exports = function (hljs) {
  return {
    case_insensitive: true,
    keywords: "#contents #hr #br #clear #comment #pcomment",
    contains: [
      {
        scope: "string",
        begin: '"',
        end: '"',
      },
      hljs.COMMENT("//", "$", {
        contains: {
          scope: "doc",
          begin: "@\\w+",
        },
      }),
    ],
  };
};
