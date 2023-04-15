"use strict";
/*
Language: PukiWiki
Requires:
Author: inucat <70513648+inucat@users.noreply.github.com>
Contributors: inucat
Description: PukiWiki formatting rules definition
Website: https://pukiwiki.osdn.jp/
 */
Object.defineProperty(exports, "__esModule", { value: true });
var modes_1 = require("../lib/modes");
/**
 * Defines a function to return a language definition object.
 * @param hljs
 * @returns Language definition object
 */
function default_1(hljs) {
    var CONTAINABLE = [];
    var INLINE_ELEMENTS = [];
    /* ブロック要素 ***************************************************************/
    var PREFORMATTED = {
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
    var HORIZON = {
        scope: "operator",
        match: /^-{4,}/,
    };
    var PARAGRAPH = {
        scope: "operator",
        match: /^~/,
    };
    var HEAD = {
        scope: "section",
        match: /^\*{1,3}.*$/,
    };
    var ALIGN = {
        scope: "keyword",
        match: /^(LEFT|CENTER|RIGHT):/,
    };
    var QUOTE_BLOCK = {
        scope: "quote",
        begin: /^(>{1,3}|<{1,3})/,
        end: /^$|^(?<=[-+#*~|,])/,
    };
    var LISTING = {
        scope: "bullet",
        variants: [{ match: /^(-{1,3}|\+{1,3})/ }, { match: /^:{1,3}.*\|/ }],
    };
    var TABLE = {
        scope: "doctag",
        variants: [
            {
                match: /^\|(([^~>|\r\n]*|[~>])\|)+[hf]?$/,
            },
            {
                match: /^\|((LEFT:|CENTER:|RIGHT:|BGCOLOR(色):|COLOR(色):|SIZE(サイズ):|BOLD:)*\d*\|)+c$/,
            },
            {
                match: /^(,.*)+$/,
            },
        ],
    };
    var BLOCK_PLUGIN = {
        variants: [
            {
                match: "^#" + modes_1.IDENT_RE,
                scope: "title",
            },
            {
                begin: [/^#/, modes_1.IDENT_RE, /\(/],
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
    var LINE_BREAK = {
        scope: "operator",
        match: /~$/,
    };
    var BOLD = {
        scope: "strong",
        begin: /''(?!')/,
        end: /''/,
    };
    var ITALIC = {
        scope: "emphasis",
        begin: /'''/,
        contains: [BOLD],
        end: /'''/,
    };
    var STRIKE_OUT = {
        scope: "deletion",
        begin: /%%/,
        end: /%%/,
    };
    var FOOTNOTE = {
        scope: "string",
        begin: /\(\(/,
        contains: ["self"],
        end: /\)\)/,
    };
    var WIKI_NAME = {
        scope: "link",
        match: /([A-Z][a-z]+){2,}/,
    };
    var INLINE_PLUGIN = {
        scope: "variable",
        begin: /&\w*(?![\r\n])/,
        contains: [
            {
                begin: /\(/,
                end: /\)/,
            },
        ],
        end: /;/,
    };
    var PAGE_NAME = {
        scope: "link",
        begin: /\[\[/,
        beginScope: "operator",
        end: /\]\]/,
        endScope: "operator",
    };
    var NUMERIC_CHARACTER_REFERENCE = {
        scope: "built_in",
        match: /&#(\d+|x[a-f\d]+);/,
    };
    var COMMENT_LINE = {
        scope: "comment",
        match: /^\/\/.*$/,
    };
    return {
        name: "PukiWiki",
        /**
         * PukiWiki keywords are case-insensitive, but some syntax cares casing
         * (e.g. WikiName).
         */
        case_insensitive: false,
        contains: [
            // hljs.C_LINE_COMMENT_MODE, //コメント行
            COMMENT_LINE,
            HORIZON,
            BLOCK_PLUGIN,
            INLINE_PLUGIN,
            NUMERIC_CHARACTER_REFERENCE,
            PARAGRAPH,
            LISTING,
            TABLE,
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
exports.default = default_1;
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
