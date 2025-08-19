// 客户端语法高亮
(function() {
  'use strict';

  // 简单的语法高亮规则
  const syntaxRules = {
    bash: {
      comment: /#.*/g,
      string: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
      keyword: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|cat|chmod|chown|sudo|apt|yum|npm|git|docker)\b/g,
      variable: /\$\w+|\$\{[^}]+\}/g,
      operator: /[|&;()<>]/g
    },
    javascript: {
      comment: /\/\/.*|\/\*[\s\S]*?\*\//g,
      string: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
      keyword: /\b(var|let|const|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|typeof|instanceof|in|of|class|extends|import|export|from|as|async|await|yield|static|super|constructor)\b/g,
      number: /\b\d+\.?\d*\b/g,
      operator: /[+\-*/%=!<>&|?:]/g
    },
    python: {
      comment: /#.*/g,
      string: /(["'])((?:\\.|(?!\1)[^\\])*?)\1|"""[\s\S]*?"""|'''[\s\S]*?'''/g,
      keyword: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|lambda|and|or|not|in|is|None|True|False|self|super|__init__|async|await)\b/g,
      decorator: /@\w+/g,
      number: /\b\d+\.?\d*\b/g
    },
    json: {
      string: /"[^"]*"/g,
      number: /\b\d+\.?\d*\b/g,
      boolean: /\b(true|false|null)\b/g,
      operator: /[{}[\]:,]/g
    },
    xml: {
      tag: /<\/?[\w-]+[^>]*>/g,
      attribute: /\w+(?==)/g,
      string: /(["'])[^"']*\1/g,
      comment: /<!--[\s\S]*?-->/g
    }
  };

  // 应用语法高亮
  function highlightCode(element, language) {
    const rules = syntaxRules[language];
    if (!rules) return;

    let code = element.textContent;
    const tokens = [];

    // 收集所有匹配的token
    Object.keys(rules).forEach(type => {
      const regex = rules[type];
      let match;
      while ((match = regex.exec(code)) !== null) {
        tokens.push({
          type,
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    });

    // 按位置排序
    tokens.sort((a, b) => a.start - b.start);

    // 构建高亮HTML
    let highlightedCode = '';
    let lastIndex = 0;

    tokens.forEach(token => {
      // 避免重叠
      if (token.start < lastIndex) return;

      // 添加未高亮的部分
      highlightedCode += escapeHtml(code.slice(lastIndex, token.start));
      
      // 添加高亮的token
      highlightedCode += `<span class="token ${token.type}">${escapeHtml(token.text)}</span>`;
      
      lastIndex = token.end;
    });

    // 添加剩余部分
    highlightedCode += escapeHtml(code.slice(lastIndex));

    element.innerHTML = highlightedCode;
  }

  // HTML转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 初始化语法高亮
  function initSyntaxHighlight() {
    const codeBlocks = document.querySelectorAll('code[class*="language-"]');
    
    codeBlocks.forEach(block => {
      const className = block.className;
      const languageMatch = className.match(/language-(\w+)/);
      
      if (languageMatch) {
        const language = languageMatch[1];
        highlightCode(block, language);
      }
    });
  }

  // 当DOM加载完成时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSyntaxHighlight);
  } else {
    initSyntaxHighlight();
  }

  // 导出到全局，以便其他脚本使用
  window.SyntaxHighlight = {
    highlight: highlightCode,
    init: initSyntaxHighlight
  };
})();
