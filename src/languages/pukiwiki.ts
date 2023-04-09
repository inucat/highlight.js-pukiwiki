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

import { HLJSApi, Language, Mode } from "highlight.js";
import { IDENT_RE } from "../lib/modes";

/**
 * Defines a function to return a language definition object.
 * @param hljs
 * @returns Language definition object
 */
export default function (hljs: HLJSApi): Language {
  const CONTAINABLE: Mode[] = [];
  const INLINE_ELEMENTS: Mode[] = [];

  /* ブロック要素 ***************************************************************/
  const PREFORMATTED: Mode = {
    scope: "code",
    begin: /(?=^ )/,
    contains: [
      {
        begin: /^ /,
        end: /\n(?=[\S\n])/,
        excludeEnd: true,
      },
    ],
  };

  const HORIZON: Mode = {
    scope: "operator",
    begin: /^-{4,}/,
  };

  const PARAGRAPH: Mode = {
    scope: "operator",
    begin: /^~/,
  };

  const QUOTE_BLOCK: Mode = {
    scope: "quote",
    begin: /^[><]{1,3}(?=\s+)/,
    contains: CONTAINABLE,
    end: "$",
  };

  /**
   * end: /(?!~$)/
   */
  /** リスト構造 ul, ol */
  const LISTING: Mode = {
    scope: "bullet",
    begin: /^(-{1,3}|\+{1,3})/,
    end: /(?<!~)$/,
    excludeEnd: true,
    contains: INLINE_ELEMENTS,
  };

  /** 定義リスト */
  const DEF: Mode = {
    scope: "bullet",
    begin: /^:{1,3}.*?\|/,
    end: /$/,
  };

  const TABLE: Mode = {
    scope: "table",
    begin: /^\|.+?\|/,
    end: /$/,
  };

  const CSV_TABLE: Mode = {
    scope: "table",
    begin: /^,.+?,/,
    end: /$/,
  };

  const HEAD: Mode = {
    scope: "section",
    begin: /^\*{1,3}/,
    end: /$/,
    contains: CONTAINABLE,
  };

  const ALIGN: Mode = {
    scope: "keyword",
    match: /^(LEFT|CENTER|RIGHT):/,
  };

  const BLOCK_PLUGIN: Mode = {
    variants: [
      {
        match: "^#" + IDENT_RE,
        scope: "title",
      },
      {
        begin: [/^#/, IDENT_RE, /\(/],
        beginScope: { 1: "title", 2: "title", 3: "punctuation" },
        contains: [
          { match: /[^),]+/, scope: "params" },
          { match: /,/, scope: "punctuation" },
        ],
        end: /\)/,
        endScope: "punctuation",
      },
    ],
  };

  /** インライン要素 ************************************************************/
  const LINE_BREAK: Mode = {
    scope: "operator",
    match: /~$/,
  };
  INLINE_ELEMENTS.push(LINE_BREAK);

  const BOLD: Mode = {
    scope: "strong",
    begin: /'{2}(?!')/,
    end: /'{2}/,
  };

  const ITALIC: Mode = {
    scope: "emphasis",
    begin: /'{3}/,
    end: /'{3}/,
  };

  const STRIKE_OUT: Mode = {
    scope: "deletion",
    begin: /%%/,
    end: /%%/,
  };

  INLINE_ELEMENTS.push(STRIKE_OUT);
  INLINE_ELEMENTS.push(BOLD);
  INLINE_ELEMENTS.push(ITALIC);

  const FOOTNOTE: Mode = {
    scope: "footnote",
    begin: /\(\(/,
    end: /\)\)/,
  };
  INLINE_ELEMENTS.push(FOOTNOTE);

  /**
   * 文字色 HEXCOLOR
   * ルビ構造 &xxx( yyy ){ zzz };
   */
  const INLINE_PLUGIN: Mode = {
    begin: /^&(ref|vote)\(/,
    end: /\)/,
  };
  INLINE_ELEMENTS.push(INLINE_PLUGIN);

  const WIKI_NAME: Mode = {
    scope: "link",
    match: /([A-Z]+[a-z]+){2}/,
  };
  INLINE_ELEMENTS.push(WIKI_NAME);

  const PAGE_NAME: Mode = {
    scope: "link",
    begin: /\[\[/,
    beginScope: "operator",
    end: /\]\]/,
    endScope: "operator",
  };
  INLINE_ELEMENTS.push(PAGE_NAME);

  /**
   * InterWiki
   * [[ページ名#アンカー名]]
   * [[InterWikiName:ページ名]]
   * [[InterWikiName:ページ名#アンカー名]]
   *
   * リンク
   * [[リンク名:URL]]
   *
   * エイリアス
   * [[エイリアス名>ページ名]]
   * 行中のページ名形式の文字列の中で、> で2つの文字列を区切るとエイリアスになります。 > の前にはエイリアス名を、> の後ろにはページ名を記述します。
   * エイリアスはPukiWiki内のページ名とは別のエイリアス名で、指定したページへのリンクを貼ります。
   * [[エイリアス名>ページ名#アンカー名]]
   * [[エイリアス名>#アンカー名]]
   */
  INLINE_ELEMENTS.push();

  const CHARACTER_REFERENCE: Mode = {
    scope: "char.escape",
    variants: [
      {
        match: /&[A-Za-z]+?;/,
      },
      {
        match: /&#(\d+|x[a-f\d]+);/,
      },
    ],
  };
  INLINE_ELEMENTS.push(CHARACTER_REFERENCE);

  return {
    name: "PukiWiki",

    case_insensitive: true,

    keywords: {
      $pattern: /[a-z]\?/,
      // customEmoji: [
      //   "&heart;",
      //   "&smile;",
      //   "&bigsmile;",
      //   "&huh;",
      //   "&oh;",
      //   "&wink;",
      //   "&sad;",
      //   "&worried;",
      // ],
      keyword: [
        // "&br;", // 改行
        // "&online;", // オンライン表示
        // "&version;", // バージョン表示
        // "&t;", // タブコード
        // "&page;", // ページ名置換文字
        // "&fpage;",
        // "&date;", // 日時置換文字
        // "&time;",
        // "&now;",
        "date?",
        "time?",
        "now?",
        // "&_date;",
        // "&_time;",
        // "&_now;",
        // "&lastmod;",
      ],
    },

    contains: [
      hljs.C_LINE_COMMENT_MODE, //コメント行
      PARAGRAPH,
      LISTING,
      BLOCK_PLUGIN,
      HEAD,
      HORIZON,
      BOLD,
      PAGE_NAME,
      CHARACTER_REFERENCE,
      PREFORMATTED,
      DEF,
      TABLE,
      CSV_TABLE,
      ALIGN,
      QUOTE_BLOCK,
    ],
  };
}
