'use strict';

import JSZip from 'jszip';
import ejs from 'ejs';

import * as utils from './utils';

import language from './i18n.json';

import container from './tpl/META-INF/container.xml';
import cover from './tpl/OEBPS/front-cover.html';
import style from './tpl/OEBPS/jackson.css';
import notes from './tpl/OEBPS/notes.html';
import page from './tpl/OEBPS/page.html';
import tocInBook from './tpl/OEBPS/table-of-contents.html';
import info from './tpl/OEBPS/title-page.html';
import bookConfig from './tpl/book.opf';
import mime from './tpl/mimetype';
import toc from './tpl/toc.ncx';

export default class jEpub {
    constructor(details) {
        this.jInfo = Object.assign({}, {
            i18n: 'vi',
            title: 'undefined',
            author: 'undefined',
            publisher: 'undefined',
            description: ''
        }, details);

        this.jUuid = utils.uuidv4();
        this.jCover = '';
        this.jNotes = '';

        this.pages = [];
    }

    uuid(id) {
        if (utils.isEmpty(id)) {
            throw 'UUID value is empty';
        } else {
            this.jUuid = id;
            return this;
        }
    }

    cover(data) {
        if (utils.isArrayBuffer(data)) {
            this.jCover = data;
            return this;
        } else {
            throw 'Cover data is not valid';
        }
    }

    notes(content) {
        if (utils.isEmpty(content)) {
            throw 'Notes is empty';
        } else {
            this.jNotes = content;
            return this;
        }
    }

    add(title, content) {
        if (utils.isEmpty(title)) {
            throw 'Title is empty';
        } else if (utils.isEmpty(content)) {
            throw `Content of ${title} is empty`;
        } else {
            this.pages.push({
                title: title,
                content: content
            });
            return this;
        }
    }

    generate(type = 'blob') {
        const zip = new JSZip();

        let metaInf = zip.folder('META-INF'),
            oebps = zip.folder('OEBPS');

        if (!JSZip.support[type]) throw `This browser does not support ${type}`;

        if (!language[this.jInfo.i18n]) throw `Unknown Language: ${this.jInfo.i18n}`;
        const i18n = language[this.jInfo.i18n];

        metaInf.file('container.xml', container);

        if (this.jCover) {
            oebps.file('cover-image.jpg', this.jCover);
            oebps.file('front-cover.html', ejs.render(cover, {
                i18n: i18n
            }));
        }

        oebps.file('jackson.css', style);

        oebps.file('notes.html', ejs.render(notes, {
            i18n: i18n,
            client: true,
            notes: utils.parseDOM(this.jNotes)
        }));

        this.pages.forEach((item, index) => {
            let content = item.content;
            if (!Array.isArray(content)) content = utils.parseDOM(content);

            oebps.file(`page-${index}.html`, ejs.render(page, {
                i18n: i18n,
                title: item.title,
                content: content
            }));
        });

        oebps.file('table-of-contents.html', ejs.render(tocInBook, {
            i18n: i18n,
            pages: this.pages
        }));

        oebps.file('title-page.html', ejs.render(info, {
            i18n: i18n,
            title: this.jInfo.title,
            author: this.jInfo.author,
            publisher: this.jInfo.publisher,
            description: utils.parseDOM(this.jInfo.description)
        }));

        zip.file('book.opf', ejs.render(bookConfig, {
            i18n: i18n,
            uuid: this.jUuid,
            title: this.jInfo.title,
            author: this.jInfo.author,
            publisher: this.jInfo.publisher,
            description: utils.html2text(this.jInfo.description, true),
            cover: this.jCover,
            pages: this.pages
        }));

        zip.file('mimetype', mime);

        zip.file('toc.ncx', ejs.render(toc, {
            i18n: i18n,
            uuid: this.jUuid,
            title: this.jInfo.title,
            author: this.jInfo.author,
            pages: this.pages
        }));

        return zip.generateAsync({
            type: type,
            mimeType: mime,
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        });
    }
}
