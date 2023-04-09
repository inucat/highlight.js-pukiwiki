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
        begin: /^-{4,}/,
    };
    var PARAGRAPH = {
        scope: "operator",
        begin: /^~/,
    };
    var QUOTE_BLOCK = {
        scope: "quote",
        begin: /^[><]{1,3}/,
        contains: CONTAINABLE,
        end: "$",
    };
    /**
     * end: /(?!~$)/
     */
    /** リスト構造 ul, ol */
    var LISTING = {
        scope: "bullet",
        begin: /^(-{1,3}|\+{1,3})/,
        end: /(?<!~)$/,
        excludeEnd: true,
        contains: INLINE_ELEMENTS,
    };
    /** 定義リスト */
    var DEF = {
        scope: "bullet",
        begin: /^:{1,3}.*?\|/,
        end: /$/,
    };
    var TABLE = {
        scope: "tag",
        begin: /^\|(.+?\|)+/,
        end: /$/,
    };
    var CSV_TABLE = {
        scope: "tag",
        begin: /^(,.*)+/,
        end: /$/,
    };
    var HEAD = {
        scope: "section",
        begin: /^\*{1,3}/,
        end: /$/,
        contains: CONTAINABLE,
    };
    var ALIGN = {
        scope: "keyword",
        match: /^(LEFT|CENTER|RIGHT):/,
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
    INLINE_ELEMENTS.push(LINE_BREAK);
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
        begin: /%%.*/,
        end: /%%/,
    };
    INLINE_ELEMENTS.push(STRIKE_OUT);
    INLINE_ELEMENTS.push(BOLD);
    INLINE_ELEMENTS.push(ITALIC);
    var FOOTNOTE = {
        scope: "footnote",
        begin: /\(\(.*/,
        end: /\)\)/,
    };
    INLINE_ELEMENTS.push(FOOTNOTE);
    /**
     * 文字色 HEXCOLOR
     * ルビ構造 &xxx( yyy ){ zzz };
     */
    var INLINE_PLUGIN = {
        scope: "title.function",
        begin: /^&/ + modes_1.IDENT_RE + /\(.*/,
        end: /\)/,
    };
    INLINE_ELEMENTS.push(INLINE_PLUGIN);
    var WIKI_NAME = {
        scope: "link",
        match: /([A-Z]+[a-z]+){2}/,
    };
    INLINE_ELEMENTS.push(WIKI_NAME);
    var PAGE_NAME = {
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
    var CHARACTER_REFERENCE = {
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
            hljs.C_LINE_COMMENT_MODE,
            PARAGRAPH,
            LISTING,
            DEF,
            TABLE,
            CSV_TABLE,
            ALIGN,
            QUOTE_BLOCK,
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
exports.default = default_1;
