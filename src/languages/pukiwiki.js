"use strict";
exports.__esModule = true;
/**
 * Defines a function to return a language definition object.
 * @param hljs
 * @returns Language definition object
 */
function default_1(hljs) {
    var CONTAINABLE = [];
    /* ブロック要素 */
    /**
     * end: /(?!~$)/
     */
    /** 段落 */
    var PARAGRAPH = {
        className: "p",
        variants: [{ begin: /^~/, excludeEnd: true }]
    };
    /** 引用文 */
    var BLOCKQUOTE = {
        className: "quote",
        begin: /^[><]{1,3}(?=\s+)/,
        contains: CONTAINABLE,
        end: "$"
    };
    /** リスト構造 ul */
    var ULIST = {
        className: "unordered-list",
        begin: /^-{1,3}/,
        end: /\s+/,
        excludeEnd: true
    };
    /** リスト構造 ol */
    var OLIST = {
        className: "ordered-list",
        begin: /^\+{1,3}/,
        end: /\s+/,
        excludeEnd: true
    };
    /** 定義リスト */
    var DEF = {
        className: "def",
        begin: /^:{1,3}.*?\|/,
        end: /$/
    };
    /** 整形済みテキスト */
    var PRE = {
        className: "pre",
        begin: /(?=^ )/,
        // use contains to gobble up multiple lines to allow the block to be whatever size
        // but only have a single open/close tag vs one per line
        contains: [
            {
                begin: /^ /,
                end: /\n(?=[\S\n])/,
                excludeEnd: true
            },
        ],
        // end: /\n(?=\S)/,
        relevance: 0
    };
    /** 表組み */
    var TABLE = {
        className: "table",
        begin: /^\|.+?\|/,
        end: /$/
    };
    /** CSV形式の表組み */
    var CSV_TABLE = {
        className: "table",
        begin: /^,.+?,/,
        end: /$/
    };
    /** 見出し */
    var HEAD = {
        className: "h",
        begin: /^\*{1,3}/,
        end: /$/,
        contains: CONTAINABLE
    };
    /** 左寄せ・センタリング・右寄せ */
    var ALIGN = {
        match: /^(LEFT|CENTER|RIGHT):/
    };
    /** 水平線 */
    var HORIZONTAL_RULE = {
        className: "horiz",
        begin: /^-{4,}/,
        end: /$/
    };
    var DIVIDER = {
        className: "divider",
        match: /^#hr/
    };
    /** 行間開け */
    var VERTICAL_SPACING = {
        match: /^#br/
    };
    /** テキストの回り込みの解除 */
    var WRAP_CLEAR = {
        match: /^#br/
    };
    /** フォーム */
    var FORM = {
        variants: [
            {
                match: /^#comment/
            },
            {
                match: /^#pcomment/
            },
            {
                match: /^#article/
            },
        ]
    };
    var VOTE_FORM = {};
    /* インライン要素 */
    /** 改行 */
    var NEWLINE = {
        match: /~$/
    };
    /** 強調・斜体 */
    var BOLD = {
        className: "strong",
        contains: [],
        begin: /'{2}(?!')/,
        end: /'{2}/
    };
    var ITALIC = {
        className: "emphasis",
        contains: [],
        begin: /'{3}/,
        end: /'{3}/
    };
    /** 添付ファイル・画像の貼り付け, 簡易投票フォーム */
    var BLOCK_WITH_OPTION = {
        begin: /^#(ref|vote)\(/,
        end: /\)/,
        contains: []
    };
    /**
     * 文字サイズ
     * 文字色
     * 添付ファイル・画像の貼り付け
     * ルビ構造
     * アンカーの設定
     * カウンタ表示
     */
    var INLINE_WITH_OPTION = {
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
        ]
    };
    /** 取消線 */
    var STRIKE = {
        className: "strike",
        contains: [],
        begin: /%{2}/,
        end: /%{2}/
    };
    /** 注釈 */
    var FOOTNOTE = {
        className: "footnote",
        contains: [],
        begin: /\({2}/,
        end: /\){2}/
    };
    /** WikiName */
    var WIKI_NAME = {
        className: "wiki-name",
        match: /([A-Z]+[a-z]+){2}/
    };
    /** ページ名 */
    var PAGE_NAME = {
        className: "page-name",
        begin: /\[\[/,
        end: /\]\]/
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
    var LAST_MODIFIED_DATE = {
        match: /&lastmod\(.+\);/
    };
    /** 文字参照文字 */
    var CHARACTER_ENTITY_REFERENCE = {
        className: "cer",
        match: /&[A-Za-z]+;?/
    };
    /** 数値参照文字 */
    var NUMERIC_CHARACTER_REFERENCE = {
        className: "ncr",
        match: /&#(\d+|x[a-f\d]+);/
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
            customEmoji: [
                "&heart",
                "&smile",
                "&bigsmile",
                "&huh",
                "&oh",
                "&wink",
                "&sad",
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
            ]
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
            hljs.C_LINE_COMMENT_MODE,
            PARAGRAPH,
            ULIST,
            OLIST,
            HEAD,
            HORIZONTAL_RULE,
            DIVIDER,
            BOLD,
            PAGE_NAME,
            CHARACTER_ENTITY_REFERENCE,
            NUMERIC_CHARACTER_REFERENCE,
            PRE,
        ]
    };
}
exports["default"] = default_1;
