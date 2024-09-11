export class Sanitizer {
    private data: string;

    constructor(data: string) {
        this.data = data;
    }

    private escapeHTML(): string {
        return this.data.replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;")
                        .replace(/`/g, "&#x60;")
                        .replace(/\//g, "&#x2F;")
                        .replace(/=/g, "&#x3D;");
    }

    private trim(): string {
        return this.data.trim();
    }

    private preventSQLInjection(): string {
        return this.data.replace(/'/g, "''")
                        .replace(/;/g, "\\;")
                        .replace(/--/g, "\\--")
                        .replace(/\\/g, "\\\\")
                        .replace(/\x00/g, "\\x00")
                        .replace(/\x1a/g, "\\x1a")
                        .replace(/"/g, "\\\"")
                        .replace(/%/g, "\\%");
    }

    private preventPHPInjection(): string {
        return this.data.replace(/<\?(php)?/gi, "&lt;?php")
                        .replace(/\?>/g, "?&gt;");
    }

    private preventJSInjection(): string {
        return this.data.replace(/<script/gi, "&lt;script")
                        .replace(/<\/script>/gi, "&lt;/script&gt;")
                        .replace(/javascript:/gi, "javascript&#58;")
                        .replace(/eval\(/gi, "eval&#40;")
                        .replace(/new Function/gi, "new&#32;Function")
                        .replace(/alert\(/gi, "alert&#40;")
                        .replace(/console\./gi, "console&#46;");
    }

    private preventPythonInjection(): string {
        return this.data.replace(/import /gi, "import&#32;")
                        .replace(/exec\(/gi, "exec&#40;")
                        .replace(/eval\(/gi, "eval&#40;")
                        .replace(/os\./gi, "os&#46;")
                        .replace(/sys\./gi, "sys&#46;")
                        .replace(/subprocess\./gi, "subprocess&#46;");
    }

    private preventVBInjection(): string {
        return this.data.replace(/CreateObject/gi, "Create&#79;bject")
                        .replace(/GetObject/gi, "Get&#79;bject")
                        .replace(/Execute/gi, "Exec&#117;te")
                        .replace(/Eval/gi, "Ev&#97;l")
                        .replace(/WScript\.Shell/gi, "WScript&#46;Shell");
    }

    private preventOSInjection(): string {
        return this.data.replace(/&/g, "\\&")
                        .replace(/\|/g, "\\|")
                        .replace(/;/g, "\\;")
                        .replace(/`/g, "\\`")
                        .replace(/\$/g, "\\$")
                        .replace(/>/g, "\\>")
                        .replace(/</g, "\\<")
                        .replace(/\*/g, "\\*")
                        .replace(/\?/g, "\\?")
                        .replace(/!/g, "\\!")
                        .replace(/~/g, "\\~");
    }

    public sanitize(): string {
        this.data = this.trim();
        this.data = this.escapeHTML();
        this.data = this.preventSQLInjection();
        this.data = this.preventPHPInjection();
        this.data = this.preventJSInjection();
        this.data = this.preventPythonInjection();
        this.data = this.preventVBInjection();
        this.data = this.preventOSInjection();
        return this.data;
    }
}