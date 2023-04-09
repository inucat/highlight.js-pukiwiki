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
    match: /^-{4,}/,
  };
  const PARAGRAPH: Mode = {
    scope: "operator",
    match: /^~/,
  };
  const HEAD: Mode = {
    scope: "section",
    begin: /^\*{1,3}/,
    end: /$/,
  };
  const ALIGN: Mode = {
    scope: "keyword",
    match: /^(LEFT|CENTER|RIGHT):/,
  };
  const QUOTE_BLOCK: Mode = {
    scope: "quote",
    begin: /^(>{1,3}|<{1,3})/,
    end: /^$/,
  };

  const LISTING: Mode = {
    scope: "bullet",
    begin: /^(-{1,3}|\+{1,3})/,
  };

  /** 定義リスト */
  const DEF: Mode = {
    scope: "bullet",
    begin: /^:{1,3}.*\|/,
  };

  const TABLE: Mode = {
    scope: "doctag",
    begin: /^\|(.+?\|)+/,
    end: /$/,
  };

  const CSV_TABLE: Mode = {
    scope: "doctag",
    begin: /^(,.*)+/,
    end: /$/,
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
  const BOLD: Mode = {
    scope: "strong",
    begin: /'{2}(?!')/,
    contains: INLINE_ELEMENTS,
    end: /'{2}/,
  };
  const ITALIC: Mode = {
    scope: "emphasis",
    begin: /'{3}/,
    contains: INLINE_ELEMENTS,
    end: /'{3}/,
  };
  const STRIKE_OUT: Mode = {
    scope: "deletion",
    begin: /%%/,
    contains: INLINE_ELEMENTS,
    end: /%%/,
  };
  const FOOTNOTE: Mode = {
    scope: "footnote",
    begin: /\(\(/,
    contains: INLINE_ELEMENTS,
    end: /\)\)/,
  };
  const WIKI_NAME: Mode = {
    scope: "link",
    match: /([A-Z][a-z]+){2,}/,
  };

  const INLINE_PLUGIN: Mode = {
    scope: "variable",
    begin: /^&[a-zA-Z]\w*/,
    contains: [
      {
        begin: /\(/,
        end: /\)/,
      },
    ],
    end: /;/,
  };

  const PAGE_NAME: Mode = {
    scope: "link",
    begin: /\[\[/,
    beginScope: "operator",
    end: /\]\]/,
    endScope: "operator",
  };

  const NUMERIC_CHARACTER_REFERENCE: Mode = {
    scope: "built_in",
    match: /&#(\d+|x[a-f\d]+);/,
  };

  return {
    name: "PukiWiki",
    /**
     * PukiWiki keywords are case-insensitive, but some syntax cares casing
     * (e.g. WikiName).
     */
    case_insensitive: false,
    contains: [
      hljs.C_LINE_COMMENT_MODE, //コメント行
      HORIZON,
      BLOCK_PLUGIN,
      INLINE_PLUGIN,
      NUMERIC_CHARACTER_REFERENCE,
      PARAGRAPH,
      LISTING,
      DEF,
      TABLE,
      CSV_TABLE,
      ALIGN,
      QUOTE_BLOCK,
      HEAD,
      ITALIC,
      BOLD,
      STRIKE_OUT,
      PAGE_NAME,
      PREFORMATTED,
      LINE_BREAK,
      FOOTNOTE,
      WIKI_NAME,
    ],
  };
}
/*
テキスト整形のルール
ブロック要素
    段落
      ~__I__
    引用文
      >{1,3}__I__
      <{1,3}__I__
    リスト構造
      -{1,3}__I__
      +{1,3}__I__
      :{1,3}__I__|__I__
    整形済みテキスト
      &nbsp;
    表組み
      |(__CELL__|)+[hfc]
      __CELL__  :- __FORMAT__ ~? __I__ | > | ~
      __FORMAT__:- (LEFT:
                |   CENTER:
                |   RIGHT:
                |   BGCOLOR(__COLOR__):
                |   COLOR(__COLOR__):
                |   SIZE(\d+):
                |   BOLD:)*
      __COLOR__ :- __HEX__ | __COLOR_KEYWORD___
    CSV形式の表組み
      (,__CSV_CELL__)+
      __CSV_CELL_ :-  == | \s* (__I__ | "__I__") \s*
    見出し
      *
      **
      ***
    左寄せ・センタリング・右寄せ
      LEFT:|CENTER:|RIGHT:
    水平線
      -{4,}
    プラグイン
      #\w+
      #\w+(...)

インライン要素
    文字列     ...
    改行      __I__~
    強調    ''__I__''
    斜体   '''__I__'''
    取消線  %%__I__%%
    注釈    ((__I__))

    ページ名
      [[__PNAME__]]
      [[__PNAME__#__ANAME__]]
    InterWiki
      [[__IWNAME__:__PNAME__]]
      [[__IWNAME__:__PNAME__#__ANAME__]]
    リンク
      [[__ALIAS__:__URL__]]
    エイリアス
      [[__ALIAS__>__PNAME__]]
      [[__ALIAS__>__PNAME__#__ANAME__]]
      [[__ALIAS__>#__ANAME__]]
      [[__ALIAS__>__IWNAME__:__PNAME__]]
      [[__ALIAS__>__IWNAME__:__PNAME__#__ANAME__]]
      [[__ALIAS__:__URL__]]

    プラグイン
      &\w+(...){__I__};
      &\w+(...);
      &\w+;
    */
