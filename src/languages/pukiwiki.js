"use strict";
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
    /**
     * end: /(?!~$)/
     */
    /** 段落 */
    var PARAGRAPH = {
        scope: "operator",
        variants: [{ begin: /^~/, excludeEnd: true }],
    };
    /** 引用文 */
    var BLOCKQUOTE = {
        scope: "quote",
        begin: /^[><]{1,3}(?=\s+)/,
        contains: CONTAINABLE,
        end: "$",
    };
    /** リスト構造 ul, ol */
    var LISTING = {
        scope: "bullet",
        begin: /^[-+]{1,3}/,
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
    /** 表組み */
    var TABLE = {
        scope: "table",
        begin: /^\|.+?\|/,
        end: /$/,
    };
    /** CSV形式の表組み */
    var CSV_TABLE = {
        scope: "table",
        begin: /^,.+?,/,
        end: /$/,
    };
    /** 見出し */
    var HEAD = {
        scope: "section",
        begin: /^\*{1,3}/,
        end: /$/,
        contains: CONTAINABLE,
    };
    /** 左寄せ・センタリング・右寄せ */
    var ALIGN = {
        scope: "keyword",
        match: /^(LEFT|CENTER|RIGHT):/,
    };
    /** Block element plugins */
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
        begin: /%%/,
        end: /%%/,
    };
    INLINE_ELEMENTS.push(STRIKE_OUT);
    INLINE_ELEMENTS.push(BOLD);
    INLINE_ELEMENTS.push(ITALIC);
    var FOOTNOTE = {
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
    var INLINE_PLUGIN = {
        begin: /^&(ref|vote)\(/,
        end: /\)/,
    };
    INLINE_ELEMENTS.push(INLINE_PLUGIN);
    /** Date */
    var LAST_MODIFIED_DATE = {
        match: /&lastmod\(.+\);/,
    };
    INLINE_ELEMENTS.push(LAST_MODIFIED_DATE);
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
    // link
    INLINE_ELEMENTS.push();
    /** 文字参照文字 */
    var CHARACTER_REFERENCE = {
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
                "&br;",
                "&online;",
                "&version;",
                "&t;",
                "&page;",
                "&fpage;",
                "&date;",
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
            hljs.C_LINE_COMMENT_MODE,
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
exports.default = default_1;
