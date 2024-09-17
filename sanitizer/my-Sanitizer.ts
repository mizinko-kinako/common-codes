interface SanitizerHandler {
    setNext(handler: SanitizerHandler): SanitizerHandler;
    handle(data: string): string;
}

abstract class AbstractSanitizerHandler implements SanitizerHandler {
    private nextHandler: SanitizerHandler | null = null;

    public setNext(handler: SanitizerHandler): SanitizerHandler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(data: string): string {
        if (this.nextHandler) {
            return this.nextHandler.handle(data);
        }
        return data;
    }

    protected log(message: string): void {
        console.log(message);
    }
}

class TrimSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.trim();
        if (originalData !== data) {
            this.log("Trim applied.");
        }
        return super.handle(data);
    }
}

class HTMLSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;")
                   .replace(/`/g, "&#x60;")
                   .replace(/\//g, "&#x2F;")
                   .replace(/=/g, "&#x3D;");
        if (originalData !== data) {
            this.log("HTML escape applied.");
        }
        return super.handle(data);
    }
}

class SQLSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/'/g, "''")
                   .replace(/;/g, "\\;")
                   .replace(/--/g, "\\--")
                   .replace(/\\/g, "\\\\")
                   .replace(/\x00/g, "\\x00")
                   .replace(/\x1a/g, "\\x1a")
                   .replace(/"/g, "\\\"")
                   .replace(/%/g, "\\%");
        if (originalData !== data) {
            this.log("SQL Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class PHPSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/<\?(php)?/gi, "&lt;?php")
                   .replace(/\?>/g, "?&gt;");
        if (originalData !== data) {
            this.log("PHP Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class JSSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/<script/gi, "&lt;script")
                   .replace(/<\/script>/gi, "&lt;/script&gt;")
                   .replace(/javascript:/gi, "javascript&#58;")
                   .replace(/eval\(/gi, "eval&#40;")
                   .replace(/new Function/gi, "new&#32;Function")
                   .replace(/alert\(/gi, "alert&#40;")
                   .replace(/console\./gi, "console&#46;");
        if (originalData !== data) {
            this.log("JavaScript Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class PythonSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/import /gi, "import&#32;")
                   .replace(/exec\(/gi, "exec&#40;")
                   .replace(/eval\(/gi, "eval&#40;")
                   .replace(/os\./gi, "os&#46;")
                   .replace(/sys\./gi, "sys&#46;")
                   .replace(/subprocess\./gi, "subprocess&#46;");
        if (originalData !== data) {
            this.log("Python Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class VBSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/CreateObject/gi, "Create&#79;bject")
                   .replace(/GetObject/gi, "Get&#79;bject")
                   .replace(/Execute/gi, "Exec&#117;te")
                   .replace(/Eval/gi, "Ev&#97;l")
                   .replace(/WScript\.Shell/gi, "WScript&#46;Shell");
        if (originalData !== data) {
            this.log("VB Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class RubySanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/`/g, "\\`")
                   .replace(/\$/g, "\\$")
                   .replace(/%x\(/g, "%x\\(")
                   .replace(/system\(/g, "system\\(")
                   .replace(/exec\(/g, "exec\\(")
                   .replace(/open\(/g, "open\\(");
        if (originalData !== data) {
            this.log("Ruby Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class LuaSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/os\.execute/gi, "os&#46;execute")
                   .replace(/io\.popen/gi, "io&#46;popen")
                   .replace(/loadstring/gi, "loadstring&#40;")
                   .replace(/dofile/gi, "dofile&#40;")
                   .replace(/loadfile/gi, "loadfile&#40;");
        if (originalData !== data) {
            this.log("Lua Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class OSSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/&/g, "\\&")
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
        if (originalData !== data) {
            this.log("OS Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class TemplateInjectionSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/\{\{/g, "{&#123;")
                   .replace(/\}\}/g, "}&#125;");
        if (originalData !== data) {
            this.log("Template Injection prevention applied.");
        }
        return super.handle(data);
    }
}

class XSSSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/<script/gi, "&lt;script")
                   .replace(/<\/script>/gi, "&lt;/script&gt;")
                   .replace(/onerror/gi, "onerror&#61;")
                   .replace(/onload/gi, "onload&#61;")
                   .replace(/javascript:/gi, "javascript&#58;");
        if (originalData !== data) {
            this.log("XSS prevention applied.");
        }
        return super.handle(data);
    }
}

class DirectoryTraversalSanitizer extends AbstractSanitizerHandler {
    public handle(data: string): string {
        const originalData = data;
        data = data.replace(/\.\.\//g, "")
                   .replace(/\.\./g, "");
        if (originalData !== data) {
            this.log("Directory Traversal prevention applied.");
        }
        return super.handle(data);
    }
}

export enum SanitizerVariation {
    Default = "default",
    NoSQL = "noSQL",
    NoXSS = "noXSS",
    NoMinor = "noMinor"
}

export class Sanitizer {
    private data: string;
    private logs: string[];
    private trimSanitizer: TrimSanitizer;
    private htmlSanitizer: HTMLSanitizer;
    private sqlSanitizer: SQLSanitizer;
    private phpSanitizer: PHPSanitizer;
    private jsSanitizer: JSSanitizer;
    private pythonSanitizer: PythonSanitizer;
    private vbSanitizer: VBSanitizer;
    private osSanitizer: OSSanitizer;
    private rubySanitizer: RubySanitizer;
    private luaSanitizer: LuaSanitizer;
    private xssSanitizer: XSSSanitizer;
    private templateInjectionSanitizer: TemplateInjectionSanitizer;
    private directoryTraversalSanitizer: DirectoryTraversalSanitizer;

    constructor(data: string) {
        this.data = data;
        this.logs = [];
        this.trimSanitizer = new TrimSanitizer();
        this.htmlSanitizer = new HTMLSanitizer();
        this.sqlSanitizer = new SQLSanitizer();
        this.phpSanitizer = new PHPSanitizer();
        this.jsSanitizer = new JSSanitizer();
        this.pythonSanitizer = new PythonSanitizer();
        this.vbSanitizer = new VBSanitizer();
        this.osSanitizer = new OSSanitizer();
        this.rubySanitizer = new RubySanitizer();
        this.luaSanitizer = new LuaSanitizer();
        this.xssSanitizer = new XSSSanitizer();
        this.templateInjectionSanitizer = new TemplateInjectionSanitizer();
        this.directoryTraversalSanitizer = new DirectoryTraversalSanitizer();

    }

    public sanitize(variation: SanitizerVariation): string {
        switch (variation) {
            case SanitizerVariation.Default:
                this.trimSanitizer.setNext(this.sqlSanitizer)
                    .setNext(this.osSanitizer)
                    .setNext(this.htmlSanitizer)
                    .setNext(this.phpSanitizer)
                    .setNext(this.jsSanitizer)
                    .setNext(this.pythonSanitizer)
                    .setNext(this.vbSanitizer)
                    .setNext(this.rubySanitizer)
                    .setNext(this.luaSanitizer)
                    .setNext(this.xssSanitizer)
                    .setNext(this.templateInjectionSanitizer)
                    .setNext(this.directoryTraversalSanitizer);
                break;
            case SanitizerVariation.NoSQL:
                this.trimSanitizer.setNext(this.osSanitizer)
                    .setNext(this.htmlSanitizer)
                    .setNext(this.phpSanitizer)
                    .setNext(this.jsSanitizer)
                    .setNext(this.pythonSanitizer)
                    .setNext(this.vbSanitizer)
                    .setNext(this.rubySanitizer)
                    .setNext(this.luaSanitizer)
                    .setNext(this.xssSanitizer)
                    .setNext(this.templateInjectionSanitizer)
                    .setNext(this.directoryTraversalSanitizer);
                break;
            case SanitizerVariation.NoXSS:
                this.trimSanitizer.setNext(this.sqlSanitizer)
                    .setNext(this.osSanitizer)
                    .setNext(this.htmlSanitizer)
                    .setNext(this.phpSanitizer)
                    .setNext(this.jsSanitizer)
                    .setNext(this.pythonSanitizer)
                    .setNext(this.vbSanitizer)
                    .setNext(this.rubySanitizer)
                    .setNext(this.luaSanitizer)
                    .setNext(this.templateInjectionSanitizer)
                    .setNext(this.directoryTraversalSanitizer);
                break;
            case SanitizerVariation.NoMinor:
                this.trimSanitizer.setNext(this.sqlSanitizer)
                    .setNext(this.osSanitizer)
                    .setNext(this.htmlSanitizer)
                    .setNext(this.phpSanitizer)
                    .setNext(this.jsSanitizer)
                    .setNext(this.pythonSanitizer)
                    .setNext(this.xssSanitizer)
                    .setNext(this.templateInjectionSanitizer)
                    .setNext(this.directoryTraversalSanitizer);
            default:
                this.trimSanitizer.setNext(this.sqlSanitizer)
                    .setNext(this.osSanitizer)
                    .setNext(this.htmlSanitizer)
                    .setNext(this.phpSanitizer)
                    .setNext(this.jsSanitizer)
                    .setNext(this.pythonSanitizer)
                    .setNext(this.vbSanitizer)
                    .setNext(this.rubySanitizer)
                    .setNext(this.luaSanitizer)
                    .setNext(this.xssSanitizer)
                    .setNext(this.templateInjectionSanitizer)
                    .setNext(this.directoryTraversalSanitizer);
                break;
        }
        this.data = this.trimSanitizer.handle(this.data);
        return this.data;
    }
}

