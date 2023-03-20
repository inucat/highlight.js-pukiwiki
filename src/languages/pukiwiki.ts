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
/**
 * Defines a function to return a language definition object.
 * @param hljs
 * @returns Language definition object
 */
export default function (hljs: HLJSApi): Language {
  const CONTAINABLE: Mode[] = [];

  /* ブロック要素 */
  /** 段落 */
  const PARAGRAPH: Mode = {
    className: "p",
    variants: [{ begin: /^~(?=\s+)/, end: /\s+/, excludeEnd: true }],
  };

  /** 引用文 */
  const BLOCKQUOTE: Mode = {
    className: "quote",
    begin: /^[><]{1,3}(?=\s+)/,
    contains: CONTAINABLE,
    end: "$",
  };

  /** リスト構造 ul */
  const ULIST: Mode = {
    className: "unordered-list",
    begin: /^-{1,3}(?=\s+)/,
    end: /\s+/,
    excludeEnd: true,
  };

  /** リスト構造 ol */
  const OLIST: Mode = {
    className: "ordered-list",
    begin: /^+{1,3}(?=\s+)/,
    end: /\s+/,
    excludeEnd: true,
  };

  /** 定義リスト */
  const DEF: Mode = {
    className: "def",
    begin: /^:{1,3}.*?\|/,
    end: /$/,
  };

  /** 整形済みテキスト */
  const PRE: Mode = {
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

  /** 表組み */
  const TABLE: Mode = {
    className: "table",
    begin: /^\|.+?\|/,
    end: /$/,
  };

  /** CSV形式の表組み */
  const CSV_TABLE: Mode = {
    className: "table",
    begin: /^,.+?,/,
    end: /$/,
  };

  /** 見出し */
  const HEAD: Mode = {
    begin: /^\*{1,3}/,
    end: /$/,
    contains: CONTAINABLE,
  };

  /** 左寄せ・センタリング・右寄せ */
  const ALIGN: Mode = {
    match: /^(LEFT|CENTER|RIGHT):/,
  };

  /** 水平線 */
  const HORIZONTAL_RULE: Mode = {
    begin: /^-{4,}/,
    end: /$/,
  };
  const DIVIDER: Mode = {
    match: /^#hr/,
  };

  /** 行間開け */
  const VERTICAL_SPACING: Mode = {
    match: /^#br/,
  };

  /** テキストの回り込みの解除 */
  const WRAP_CLEAR: Mode = {
    match: /^#br/,
  };

  /** フォーム */
  const FORM: Mode = {
    variants: [
      {
        match: /^#comment/,
      },
      {
        match: /^#pcomment/,
      },
      {
        match: /^#article/,
      },
    ],
  };
  const VOTE_FORM: Mode = {};

  /* インライン要素 */
  /** 改行 */
  const NEWLINE: Mode = {
    match: /~$/,
  };

  /** 強調・斜体 */
  const BOLD: Mode = {
    className: "strong",
    contains: [], // defined later
    begin: /'{2}(?!')/,
    end: /'{2}/,
  };
  const ITALIC: Mode = {
    className: "emphasis",
    contains: [], // defined later
    begin: /'{3}/,
    end: /'{3}/,
  };

  /** 添付ファイル・画像の貼り付け, 簡易投票フォーム */
  const BLOCK_WITH_OPTION: Mode = {
    begin: /^#(ref|vote)\(/,
    end: /\)/,
    contains: [
    ],
  };

  /**
   * 文字サイズ
   * 文字色
   * 添付ファイル・画像の貼り付け
   * ルビ構造
   * アンカーの設定
   * カウンタ表示
   */
  const INLINE_WITH_OPTION: Mode = {
    begin: /^&(ref|vote)\(/,
    end: /\)/,
    contains: [
      // modes.BLOCK_COMMENT,
      // modes.HEXCOLOR,
      // modes.IMPORTANT,
      // modes.CSS_NUMBER_MODE,
      // ...STRINGS,
      // // needed to highlight these as strings and to avoid issues with
      // // illegal characters that might be inside urls that would tigger the
      // // languages illegal stack
    ],
  };

  /** 取消線 */
  const STRIKE: Mode = {
    className: "strike",
    contains: [], // defined later
    begin: /%{2}/,
    end: /%{2}/,
  };

  /** 注釈 */
  const FOOTNOTE: Mode = {
    className: "footnote",
    contains: [], // defined later
    begin: /\({2}/,
    end: /\){2}/,
  };

  /** WikiName */
  const WIKI_NAME: Mode = {
    className: "wiki-name",
    match: /([A-Z]+[a-z]+){2}/,
  };

  /** ページ名 */
  const PAGE_NAME: Mode = {
    begin: "[[",
    end: "]]",
  };

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

  /** Date */
  const LAST_MODIFIED_DATE: Mode = {
    match: /&lastmod\(.+\);/,
  };

  /** 文字参照文字 */
  const CHARACTER_ENTITY_REFERENCE: Mode = {
    match: /&[A-Za-z]+;?/,
  };

  /** 数値参照文字 */
  const NUMERIC_CHARACTER_REFERENCE: Mode = {
    match: /&#(\d+|x[a-f\d]+);/,
  };

  return {
    /* Target language has the name "PukiWiki". */
    name: "PukiWiki",

    /* PukiWiki is case-sensitive. */
    case_insensitive: false,

    /**
     * The keywords of PukiWiki, all sorts of “literals”, “built-ins”, “symbols” and such.
     */
    keywords: {
      $pattern: /(&[a-z]+;?|[a-z]\?|&_(date|time|now);)/,
      customEmoji:
        "&heart; &smile; &bigsmile; &huh; &oh; &wink; &sad; &worried;",
      keyword: [
        "&br;", // 改行
        "&online;", // オンライン表示
        "&version;", // バージョン表示
        "&t;", // タブコード
        "&page;", // ページ名置換文字
        "&fpage;",
        "&date;", // 日時置換文字
        "&time;",
        "&now;",
        "date?",
        "time?",
        "now?",
        "&_date;",
        "&_time;",
        "&_now;",
        "&lastmod;",
      ],
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
    ],
  };
}
