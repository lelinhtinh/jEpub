'use strict';

import JSZip from 'jszip';
import ejs from 'ejs';

import * as utils from './utils';

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

        metaInf.file('container.xml', container);

        if (this.jCover) {
            oebps.file('cover-image.jpg', this.jCover);
            oebps.file('front-cover.html', cover);
        }

        oebps.file('jackson.css', style);

        oebps.file('notes.html', ejs.render(notes, {
            client: true,
            notes: this.jNotes
        }));

        this.pages.forEach((item, index) => {
            oebps.file(`page-${index}.html`, ejs.render(page, {
                title: item.title,
                content: item.content
            }));
        });

        oebps.file('table-of-contents.html', ejs.render(tocInBook, {
            pages: this.pages
        }));

        oebps.file('title-page.html', ejs.render(info, {
            title: this.jInfo.title,
            author: this.jInfo.author,
            publisher: this.jInfo.publisher,
            description: this.jInfo.description
        }));

        zip.file('book.opf', ejs.render(bookConfig, {
            uuid: this.jUuid,
            title: this.jInfo.title,
            author: this.jInfo.author,
            publisher: this.jInfo.publisher,
            description: this.jInfo.description,
            cover: this.jCover,
            pages: this.pages
        }));

        zip.file('mimetype', mime);

        zip.file('toc.ncx', ejs.render(toc, {
            uuid: this.jUuid,
            title: this.jInfo.title,
            author: this.jInfo.author,
            pages: this.pages
        }));

        return new Promise((resolve, reject) => {
            zip.generateAsync(
                {
                    type: type,
                    mimeType: mime,
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: 9
                    }
                })
                .then(content => {
                    resolve(content);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
