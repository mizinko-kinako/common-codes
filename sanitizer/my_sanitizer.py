from abc import ABC, abstractmethod
import re
from typing import Optional

class SanitizerHandler(ABC):
    @abstractmethod
    def set_next(self, handler: 'SanitizerHandler') -> 'SanitizerHandler':
        pass

    @abstractmethod
    def handle(self, data: str) -> str:
        pass

class AbstractSanitizerHandler(SanitizerHandler):
    def __init__(self) -> None:
        self._next_handler: Optional[SanitizerHandler] = None
        self._processed: bool = False

    def set_next(self, handler: SanitizerHandler) -> SanitizerHandler:
        self._next_handler = handler
        return handler

    def handle(self, data: str) -> str:
        if self._next_handler:
            return self._next_handler.handle(data)
        return data

    def log(self, message: str) -> None:
        print(message)

    def mark_processed(self) -> None:
        self._processed = True

    def is_processed(self) -> bool:
        return self._processed

class TrimSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.strip()
            if original_data != data:
                self.log("Trim applied.")
                self.mark_processed()
        return super().handle(data)

class OSSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.replace('&', "\\&") \
                       .replace('|', "\\|") \
                       .replace(';', "\\;") \
                       .replace('`', "\\`") \
                       .replace('$', "\\$") \
                       .replace('>', "\\>") \
                       .replace('<', "\\<") \
                       .replace('*', "\\*") \
                       .replace('?', "\\?") \
                       .replace('!', "\\!") \
                       .replace('~', "\\~")
            if original_data != data:
                self.log("OS Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class SQLSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.replace("'", "''") \
                       .replace(";", "\\;") \
                       .replace("--", "\\--") \
                       .replace("\\", "\\\\") \
                       .replace("\x00", "\\x00") \
                       .replace("\x1a", "\\x1a") \
                       .replace('"', "\\\"") \
                       .replace("%", "\\%")
            if original_data != data:
                self.log("SQL Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class HTMLSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.replace('&', "&amp;") \
                       .replace('<', "&lt;") \
                       .replace('>', "&gt;") \
                       .replace('"', "&quot;") \
                       .replace("'", "&#039;") \
                       .replace('`', "&#x60;") \
                       .replace('/', "&#x2F;") \
                       .replace('=', "&#x3D;")
            if original_data != data:
                self.log("HTML escape applied.")
                self.mark_processed()
        return super().handle(data)


class PHPSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'<\?(php)?', "&lt;?php", data, flags=re.IGNORECASE) \
                       .replace("?>", "?&gt;")
            if original_data != data:
                self.log("PHP Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class JSSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'<script', "&lt;script", data, flags=re.IGNORECASE) \
                       .replace("</script>", "&lt;/script&gt;") \
                       .replace("javascript:", "javascript&#58;") \
                       .replace("eval(", "eval&#40;") \
                       .replace("new Function", "new&#32;Function") \
                       .replace("alert(", "alert&#40;") \
                       .replace("console.", "console&#46;")
            if original_data != data:
                self.log("JavaScript Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class PythonSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'import ', "import&#32;", data, flags=re.IGNORECASE) \
                       .replace("exec(", "exec&#40;") \
                       .replace("eval(", "eval&#40;") \
                       .replace("os.", "os&#46;") \
                       .replace("sys.", "sys&#46;") \
                       .replace("subprocess.", "subprocess&#46;")
            if original_data != data:
                self.log("Python Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class VBSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'CreateObject', "Create&#79;bject", data, flags=re.IGNORECASE) \
                       .replace("GetObject", "Get&#79;bject") \
                       .replace("Execute", "Exec&#117;te") \
                       .replace("Eval", "Ev&#97;l") \
                       .replace("WScript.Shell", "WScript&#46;Shell")
            if original_data != data:
                self.log("VB Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class RubySanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.replace('`', "\\`") \
                       .replace('$', "\\$") \
                       .replace('%x(', "%x\\(") \
                       .replace('system(', "system\\(") \
                       .replace('exec(', "exec\\(") \
                       .replace('open(', "open\\(")
            if original_data != data:
                self.log("Ruby Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class LuaSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'os\.execute', "os&#46;execute", data, flags=re.IGNORECASE) \
                       .replace("io.popen", "io&#46;popen") \
                       .replace("loadstring", "loadstring&#40;") \
                       .replace("dofile", "dofile&#40;") \
                       .replace("loadfile", "loadfile&#40;")
            if original_data != data:
                self.log("Lua Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)


class TemplateInjectionSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = data.replace('{{', "{&#123;") \
                       .replace('}}', "}&#125;")
            if original_data != data:
                self.log("Template Injection prevention applied.")
                self.mark_processed()
        return super().handle(data)

class XSSSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'<script', "&lt;script", data, flags=re.IGNORECASE) \
                    .replace("</script>", "&lt;/script&gt;") \
                    .replace("onerror=", "onerror&#61;") \
                    .replace("onload=", "onload&#61;") \
                    .replace("javascript:", "javascript&#58;")
            if original_data != data:
                self.log("XSS prevention applied.")
                self.mark_processed()
        return super().handle(data)

class DirectoryTraversalSanitizer(AbstractSanitizerHandler):
    def handle(self, data: str) -> str:
        if not self.is_processed():
            original_data = data
            data = re.sub(r'\.\./', '', data)
            data = re.sub(r'\.\.', '', data)
            data = data.replace("../", "") \
                       .replace("..", "")
            if original_data != data:
                self.log("Directory Traversal prevention applied.")
                self.mark_processed()
        return super().handle(data)


class Sanitizer:
    def __init__(self, data: str) -> None:
        self.data = data
        self.logs = []
        self.trim_sanitizer = TrimSanitizer()
        self.html_sanitizer = HTMLSanitizer()
        self.sql_sanitizer = SQLSanitizer()
        self.php_sanitizer = PHPSanitizer()
        self.js_sanitizer = JSSanitizer()
        self.python_sanitizer = PythonSanitizer()
        self.vb_sanitizer = VBSanitizer()
        self.os_sanitizer = OSSanitizer()
        self.ruby_sanitizer = RubySanitizer()
        self.lua_sanitizer = LuaSanitizer()
        self.xss_sanitizer = XSSSanitizer()
        self.template_injection_sanitizer = TemplateInjectionSanitizer()
        self.directory_traversal_sanitizer = DirectoryTraversalSanitizer()

        self.trim_sanitizer.set_next(self.os_sanitizer) \
                            .set_next(self.sql_sanitizer) \
                            .set_next(self.html_sanitizer) \
                            .set_next(self.php_sanitizer) \
                            .set_next(self.js_sanitizer) \
                            .set_next(self.python_sanitizer) \
                            .set_next(self.vb_sanitizer) \
                            .set_next(self.ruby_sanitizer) \
                            .set_next(self.lua_sanitizer) \
                            .set_next(self.xss_sanitizer) \
                            .set_next(self.template_injection_sanitizer) \
                            .set_next(self.directory_traversal_sanitizer)

    def sanitize(self) -> str:
        self.data = self.trim_sanitizer.handle(self.data)
        return self.data

# 使用例
if __name__ == "__main__":
    input_string = " Hello, World! <script>alert('XSS');</script> "
    sanitizer = Sanitizer(input_string)
    sanitized_string = sanitizer.sanitize()
    print(f"Sanitized string: {sanitized_string}")