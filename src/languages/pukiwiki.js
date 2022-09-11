/*
Language: PukiWiki
Requires:
Author: inucat <70513648+inucat@users.noreply.github.com>
Contributors: inucat
Description: PukiWiki formatting rules definition
Website: https://pukiwiki.osdn.jp/
 */
// import * as MODES from "../lib/modes.js";
// @ts-ignore
export default function (hljs) {
  const BLOCK_SYMBOL_RE = /^(~|(>|<|-|\+|:|\*){1,3}|LEFT:|CENTER:|RIGHT:)/;
  const INLINE_SYMBOL_RE = /~$/;
  const HORIZON_RE = /-{4,}/;

  const COMMENT_MODE = hljs.COMMENT("^//", "$");
  const BLOCK_PLUGIN_MODE = {
    scope: "operator",
    variants: [
      { begin: /^#[_A-Za-z0-9]+(\(.*?(,.*?)*?\))?(\{.*?\})?/ },
      { match: BLOCK_SYMBOL_RE },
      { match: HORIZON_RE },
    ],
  };
  const INLINE_PLUGIN_MODE = {
    scope: "symbol",
    variants: [
      { begin: /&[_a-z0-9]+(\(.*?(,.*?)*?\))?(\{.*?\})?;/ },
      { match: INLINE_SYMBOL_RE },
    ],
  };
  const PREFORMATTED_MODE = {
    scope: "code",
    begin: /(?=^ )/,
    contains: [
      {
        begin: /^ /,
        end: /\n/,
      },
    ],
  };
  const BOLD_MODE = {
    scope: "emphasis",
    begin: "''",
    end: "''",
  };
  const ITALIC_MODE = {
    scope: "strong",
    begin: "'''",
    end: "'''",
  };
  const STRIKED_MODE = {
    scope: "deletion",
    begin: "%%",
    end: "%%",
  };
  const FOOTNOTE_MODE = {
    scope: "quote",
    begin: "((",
    end: "))",
  };
  const HYPERLINK_MODE = {
    scope: "link",
    begin: "[[",
    end: "]]",
  };
  const EMOJI_MODE = {
    keywords: [
      "&heart;",
      "&smile;",
      "&bigsmile;",
      "&huh;",
      "&oh;",
      "&wink;",
      "&sad;",
      "&worried;",
    ],
  };
  return {
    name: "PukiWiki",
    case_insensitive: false,
    /* keywords: {
      block_elements: [
        // ":", // Definition used with pipe `|`, /:{1,3} (.*?)? \| (.*)?/
        "|", // In addition to above, table indicator, /\|{3,}[hf]$/
        // colspan = >, rowspan = ~
        // "BGCOLOR(色):","COLOR(色):","SIZE(サイズ):","BOLD:",
        ",", // /^,/ CSV-styled table, \" is escaped with \"\" enclosed by \"
        // "==", // colspan within CSV-styled table
      ],
      inline_elements: [
        "WikiName", // ([A-Z]+[a-z]+){2,}
        // "[[..#_anchor]]","[[_InterWikiName:_pagename#_anchor]]","[[_linktext:_url]]","[[_alias>_pagename#_anchor]]","[[_alias:_url]]",
        "date?",
        "time?",
        "now?",
        // "&..文字参照..;",
        // "&#10進数;",
        // "&#x16進数;",
      ],
    },
     */ contains: [
      COMMENT_MODE,
      INLINE_PLUGIN_MODE,
      BLOCK_PLUGIN_MODE,
      PREFORMATTED_MODE,
      // BOLD_MODE,
      // ITALIC_MODE,
      // STRIKED_MODE,
      // FOOTNOTE_MODE,
      // HYPERLINK_MODE,
      // EMOJI_MODE,
    ],
  };
}
