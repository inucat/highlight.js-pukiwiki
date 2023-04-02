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
        end: /\n(?=[\S\n])/, //= \S excludes \n ...
        excludeEnd: true,
      },
    ],
  };

  const HORIZON: Mode = {
    scope: "operator",
    begin: /^-{4,}/,
  };

  /**
   * end: /(?!~$)/
   */
  /** 段落 */
  const PARAGRAPH: Mode = {
    scope: "operator",
    variants: [{ begin: /^~/, excludeEnd: true }],
  };

  /** 引用文 */
  const BLOCKQUOTE: Mode = {
    scope: "quote",
    begin: /^[><]{1,3}(?=\s+)/,
    contains: CONTAINABLE,
    end: "$",
  };

  /** リスト構造 ul, ol */
  const LISTING: Mode = {
    scope: "bullet",
    begin: /^[-+]{1,3}/,
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

  /** 表組み */
  const TABLE: Mode = {
    scope: "table",
    begin: /^\|.+?\|/,
    end: /$/,
  };

  /** CSV形式の表組み */
  const CSV_TABLE: Mode = {
    scope: "table",
    begin: /^,.+?,/,
    end: /$/,
  };

  /** 見出し */
  const HEAD: Mode = {
    scope: "section",
    begin: /^\*{1,3}/,
    end: /$/,
    contains: CONTAINABLE,
  };

  /** 左寄せ・センタリング・右寄せ */
  const ALIGN: Mode = {
    scope: "keyword",
    match: /^(LEFT|CENTER|RIGHT):/,
  };

  /** Block element plugins */
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
   * 文字サイズ
   * 文字色
   * 添付ファイル・画像の貼り付け
   * ルビ構造
   * アンカーの設定
   * カウンタ表示
   */
  const INLINE_PLUGIN: Mode = {
    begin: /^&(ref|vote)\(/,
    end: /\)/,
  };
  INLINE_ELEMENTS.push(INLINE_PLUGIN);
  /** Date */
  const LAST_MODIFIED_DATE: Mode = {
    match: /&lastmod\(.+\);/,
  };
  INLINE_ELEMENTS.push(LAST_MODIFIED_DATE);

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
  // link
  INLINE_ELEMENTS.push();

  /** 文字参照文字 */
  const CHARACTER_REFERENCE: Mode = {
    scope: "char.escape",
    variants: [
      {
        match: /&[A-Za-z]+;?/,
      },
      {
        match: /&#(\d+|x[a-f\d]+);/,
      },
    ],
  };
  INLINE_ELEMENTS.push(CHARACTER_REFERENCE);

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
      customEmoji: [
        "&heart;",
        "&smile;",
        "&bigsmile;",
        "&huh;",
        "&oh;",
        "&wink;",
        "&sad;",
        "&worried;",
      ],
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
    ],
  };
}
