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
        begin: /^\*{1,3}/,
        end: /$/,
    };
    var ALIGN = {
        scope: "keyword",
        match: /^(LEFT|CENTER|RIGHT):/,
    };
    var QUOTE_BLOCK = {
        scope: "quote",
        begin: /^(>{1,3}|<{1,3})/,
        end: /$/,
    };
    var LISTING = {
        scope: "bullet",
        begin: /^(-{1,3}|\+{1,3})/,
    };
    /** 定義リスト */
    var DEF = {
        scope: "bullet",
        begin: /^:{1,3}.*\|/,
    };
    var TABLE = {
        scope: "doctag",
        begin: /^\|(.+?\|)+/,
        end: /$/,
    };
    var CSV_TABLE = {
        scope: "doctag",
        begin: /^(,.*)+/,
        end: /$/,
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
        begin: /'{2}(?!')/,
        end: /'{2}/,
    };
    var ITALIC = {
        scope: "emphasis",
        begin: /'{3}/,
        end: /'{3}/,
    };
    var STRIKE_OUT = {
        scope: "deletion",
        begin: /%%/,
        end: /%%/,
        contains: INLINE_ELEMENTS,
    };
    var FOOTNOTE = {
        scope: "footnote",
        begin: /\(\(/,
        end: /\)\)/,
    };
    /**
     * 文字色 HEXCOLOR
     * ルビ構造 &xxx( yyy ){ zzz };
     */
    var INLINE_PLUGIN = {
        scope: "variable",
        begin: /^&[a-zA-Z]\w*\(/,
        end: /\);/,
    };
    var WIKI_NAME = {
        scope: "link",
        match: /([A-Z][a-z]+){2,}/,
    };
    /*
      keywords: {
        $pattern: /[a-z]\?/,
        keyword: ["date?", "time?", "now?"],
      },
     */
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
    var PAGE_NAME = {
        scope: "link",
        begin: /\[\[/,
        beginScope: "operator",
        end: /\]\]/,
        endScope: "operator",
    };
    var CHARACTER_REFERENCE = {
        scope: "built_in",
        match: /&#(\d+|x[a-f\d]+);/,
    };
    return {
        name: "PukiWiki",
        /**
         * PukiWiki keywords are actually case-insensitive, but some syntax cares
         * casing (e.g. WikiName).
         */
        case_insensitive: false,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            PARAGRAPH,
            HORIZON,
            LISTING,
            DEF,
            TABLE,
            CSV_TABLE,
            ALIGN,
            QUOTE_BLOCK,
            BLOCK_PLUGIN,
            HEAD,
            ITALIC,
            BOLD,
            STRIKE_OUT,
            PAGE_NAME,
            INLINE_PLUGIN,
            CHARACTER_REFERENCE,
            PREFORMATTED,
            LINE_BREAK,
            FOOTNOTE,
            WIKI_NAME,
        ],
    };
}
exports.default = default_1;
