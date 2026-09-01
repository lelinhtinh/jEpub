import lodash from 'lodash';
import minifyXML from 'minify-xml';
const { template: lodashTemplate } = lodash;

const ESCAPE_FALLBACK = `function escapeFallback(s){var m={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};return s==null?'':String(s).replace(/[&<>"']/g,function(c){return m[c];});}`;
const XML_PROLOG_REGEX = /(<\?xml\s*version="1.0"\s*encoding="UTF-8"\s*\?>)\s*/;
const XML_DOCTYPE_REGEX =
    /(<!DOCTYPE\s*html\s*PUBLIC\s*"-\/\/W3C\/\/DTD\s*XHTML\s*1\.1\/\/EN"\s*"http:\/\/www\.w3\.org\/TR\/xhtml11\/DTD\/xhtml11\.dtd">)\s*/;

export function ejsPrecompile() {
    return {
        name: 'ejs-precompile',
        enforce: 'pre',
        transform(template, filename) {
            if (!filename.endsWith('.ejs')) {
                return null;
            }

            if (
                filename.endsWith('.html.ejs') ||
                filename.endsWith('.opf.ejs') ||
                filename.endsWith('.ncx.ejs')
            ) {
                template = minifyXML(template, {
                    collapseEmptyElements: false,
                    collapseWhitespaceInProlog: false,
                    collapseWhitespaceInDocType: false,
                    removeUnnecessaryStandaloneDeclaration: false,
                    removeUnusedNamespaces: false,
                    removeUnusedDefaultNamespace: false,
                    shortenNamespaces: false,
                });
                template = template
                    .replace(/\s\s*/g, ' ')
                    .replace(XML_PROLOG_REGEX, (_, expr) => `${expr}\n`)
                    .replace(XML_DOCTYPE_REGEX, (_, expr) => `${expr}\n`);
            }

            const compiled = lodashTemplate(template, {
                // Match EJS semantics: <%= %> is escaped, <%- %> is raw
                escape: /<%=([\s\S]+?)%>/g,
                interpolate: /<%-([^>]+?)%>/g,
                evaluate: /<%(?![=-])([\s\S]+?)%>/g,
                variable: 'data',
            });

            const functionSource = compiled.source;
            const exportedFunctionSource = functionSource.replace(
                '_.escape',
                'escapeFallback'
            );

            let code = `export default ${exportedFunctionSource}`;
            if (functionSource.includes('_.escape')) {
                code = `${ESCAPE_FALLBACK};${code}`;
            }

            return { code, map: null };
        },
    };
}
