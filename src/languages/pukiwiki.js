/*
Language: PukiWiki
Requires:
Author: inucat <70513648+inucat@users.noreply.github.com>
Contributors: inucat
Description: PukiWiki formatting rules definition
Website: https://pukiwiki.osdn.jp/
 */
/**
 * @see https://pukiwiki.osdn.jp/?FormattingRules
 */
import "highlight.js"
/**
 * Defines a function to return a language definition object.
 * @param {import("highlight.js").HLJSApi} hljs
 * @returns Language definition object
 */
export default function (hljs) {
  /**
    テキスト整形のルール
        ブロック要素




            目次
            左寄せ・センタリング・右寄せ

            行間開け
            添付ファイル・画像の貼り付け
            テキストの回り込みの解除
            フォーム
        インライン要素



            文字サイズ
            文字色


            添付ファイル・画像の貼り付け
            ルビ構造
            アンカーの設定
            カウンタ表示
            オンライン表示
            バージョン表示


            InterWiki
            リンク
            エイリアス
            タブコード
            ページ名置換文字
            日時置換文字
            文字参照文字
            数値参照文字
        その他

 */

  /* ブロック要素 */
  /**
   * 段落
   * @type {import("highlight.js").Mode}
   */
  const PARAGRAPH = {
    className: "p",
    variants: [{ begin: /^~(?=\s+)/, end: /\s+/, excludeEnd: true }],
  };

  /* 引用文 */
  const BLOCKQUOTE = {
    className: "quote",
    begin: /^[><]{1,3}(?=\s+)/,
    contains: CONTAINABLE,
    end: "$",
  };

  /* リスト構造 ul */
  const ULIST = {
    className: "unordered-list",
    begin: /^-{1,3}(?=\s+)/,
    end: /\s+/,
    excludeEnd: true,
  };

  /* リスト構造 ol */
  const OLIST = {
    className: "ordered-list",
    begin: /^+{1,3}(?=\s+)/,
    end: /\s+/,
    excludeEnd: true,
  };

  /*
   */
  const DEF = {
    className: "def",
    begin: /^:{1,3}.*?\|/,
    end: /$/,
  };

  /* 整形済みテキスト */
  const PRE = {
    className: "pre",
    begin: /(?=^ )/,
    // use contains to gobble up multiple lines to allow the block to be whatever size
    // but only have a single open/close tag vs one per line
    contains: [
      {
        begin: /^ /,
        end: /(\n)$/,
      },
    ],
    relevance: 0,
  };

  /* 表組み */
  const TABLE = {
    className: "table",
    begin: /^\|.+?\|/,
    end: /$/,
  };

  /* CSV形式の表組み */
  const CSV_TABLE = {
    className: "table",
    begin: /^,.+?,/,
    end: /$/,
  };

  /* 見出し */
  const HEAD = {
    begin: /^\*{1,3}/,
    end: /$/,
    contains: CONTAINABLE,
  };

  /* 水平線 */
  const HORIZONTAL_RULE = {
    begin: /^-{4,}/,
    end: /$/,
  };

  /* インライン要素 */
  /* 改行 */
  const NEWLINE = {
    begin: /.+~$/,
    end: /$/,
  };

  /* 強調・斜体 */
  const BOLD = {
    className: "strong",
    contains: [], // defined later
    begin: /'{2}(?!')/,
    end: /'{2}/,
  };
  const ITALIC = {
    className: "emphasis",
    contains: [], // defined later
    begin: /'{3}/,
    end: /'{3}/,
  };

  /* 取消線 */
  const STRIKE = {
    className: "strike",
    contains: [], // defined later
    begin: /%{2}/,
    end: /%{2}/,
  };

  /**
   * 注釈
   * @type {import("highlight.js").Mode}
   */
  const FOOTNOTE = {
    className: "footnote",
    contains: [], // defined later
    begin: /\({2}/,
    end: /\){2}/,
  };

  /**
   * WikiName
   * @type {import("highlight.js").Mode}
   */
  const WIKI_NAME = {
    className: "wiki-name",
    match: /([A-Z]+[a-z]+){2}/,
  };

  /**
   * ページ名
   * @type {import("highlight.js").Mode}
   */
  const PAGE_NAME = {
    begin: "[[",
    end: "]]",
  };
  // const EMOJI_MODE = {
  //   scope: "symbol",
  //   keywords: [
  //     "&heart;",
  //     "&smile;",
  //     "&bigsmile;",
  //     "&huh;",
  //     "&oh;",
  //     "&wink;",
  //     "&sad;",
  //     "&worried;",
  //   ],
  // };
  return {
    /* Target language has the name "PukiWiki". */
    name: "PukiWiki",

    /* PukiWiki is case-sensitive. */
    case_insensitive: false,

    /**
     * The keywords of PukiWiki, all sorts of “literals”, “built-ins”, “symbols” and such.
     *
     * Cited:
     * By default, “words” are matched with the regexp \w+, and that works well
     * for many languages. Different lexing rules can be defined by the magic
     * $pattern attribute:
     * @example
     * {
     *   keywords: {
     *     $pattern: /-[a-z]+/,        // allow keywords to begin with dash
     *     keyword: '-import -export'
     *   }
     * }
     */
    keywords: {
      // block_elements: [
      //   // ":", // Definition used with pipe `|`, /:{1,3} (.*?)? \| (.*)?/
      //   "|", // In addition to above, table indicator, /\|{3,}[hf]$/
      //   // colspan = >, rowspan = ~
      //   // "BGCOLOR(色):","COLOR(色):","SIZE(サイズ):","BOLD:",
      //   ",", // /^,/ CSV-styled table, \" is escaped with \"\" enclosed by \"
      //   // "==", // colspan within CSV-styled table
      // ],
      // inline_elements: [
      //   "WikiName", // ([A-Z]+[a-z]+){2,}
      //   // "[[..#_anchor]]","[[_InterWikiName:_pagename#_anchor]]","[[_linktext:_url]]","[[_alias>_pagename#_anchor]]","[[_alias:_url]]",
      //   "date?",
      //   "time?",
      //   "now?",
      //   // "&..文字参照..;",
      //   // "&#10進数;",
      //   // "&#x16進数;",
      // ],
    },

    /**
Sub-modes

Sub-modes are listed in the contains attribute:

{
  keywords: '...',
  contains: [
    hljs.QUOTE_STRING_MODE,
    hljs.C_LINE_COMMENT,
    { ... custom mode definition ... }
  ]
}

A mode can reference itself in the contains array by using a special keyword 'self’. This is commonly used to define nested modes:

{
  scope: 'object',
  begin: /\{/, end: /\}/,
  contains: [hljs.QUOTE_STRING_MODE, 'self']
}
     */
    contains: [
      hljs.C_LINE_COMMENT_MODE, //コメント行
      //   COMMENT_MODE,
      //   INLINE_PLUGIN_MODE,
      //   BLOCK_PLUGIN_MODE,
      //   PREFORMATTED_MODE,
      //   // BOLD_MODE,
      //   // ITALIC_MODE,
      //   // STRIKED_MODE,
      //   // FOOTNOTE_MODE,
      //   // HYPERLINK_MODE,
      //   // EMOJI_MODE,
    ],
  };
}
