/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

/**
 * @description Elements and variables you should have
 * @param {HTMLElement} element - textarea element
 * @param {object} cons - Toolbar element you created
 * @param {json} options - Inserted options
 * @returns Elements, variables of the editor
 * @private
 */
const _Context = function (element, cons, options) {
    return {
        element: {
            originElement: element,
            topArea: cons._top,
            relative: cons._relative,
            toolbar: cons._toolBar,
            resizingBar: cons._resizingBar,
            navigation: cons._navigation,
            editorArea: cons._editorArea,
            wysiwyg: cons._wysiwygArea,
            code: cons._codeArea,
            loading: cons._loading,
            resizeBackground: cons._resizeBack,
            _stickyDummy: cons._stickyDummy,
            _arrow: cons._arrow
        },
        tool: {
            cover: cons._toolBar.getElementsByClassName('sun-editor-id-toolbar-cover')[0],
            bold: cons._toolBar.getElementsByClassName('sun-editor-id-bold')[0],
            underline: cons._toolBar.getElementsByClassName('sun-editor-id-underline')[0],
            italic: cons._toolBar.getElementsByClassName('sun-editor-id-italic')[0],
            strike: cons._toolBar.getElementsByClassName('sun-editor-id-strike')[0],
            subscript: cons._toolBar.getElementsByClassName('sun-editor-id-subscript')[0],
            superscript: cons._toolBar.getElementsByClassName('sun-editor-id-superscript')[0],
            font: cons._toolBar.querySelector('.sun-editor-id-font-family .txt'),
            fontTooltip: cons._toolBar.querySelector('.sun-editor-id-font-family .se-tooltip-text'),
            format: cons._toolBar.getElementsByClassName('sun-editor-id-format')[0],
            fontSize: cons._toolBar.getElementsByClassName('sun-editor-id-font-size')[0],
            align: cons._toolBar.getElementsByClassName('sun-editor-id-align')[0],
            list: cons._toolBar.getElementsByClassName('sun-editor-id-list')[0],
            undo: cons._toolBar.getElementsByClassName('sun-editor-id-undo')[0],
            redo: cons._toolBar.getElementsByClassName('sun-editor-id-redo')[0],
            save: cons._toolBar.getElementsByClassName('sun-editor-id-save')[0],
            outdent: cons._toolBar.getElementsByClassName('sun-editor-id-outdent')[0]
        },
        option: {
            mode: options.mode,
            toolbarWidth: options.toolbarWidth,
            stickyToolbar: options.stickyToolbar,
            resizingBar: options.resizingBar,
            showPathLabel: options.showPathLabel,
            popupDisplay: options.popupDisplay,
            display: options.display,
            height: options.height,
            minHeight: options.minHeight,
            maxHeight: options.maxHeight,
            font: options.font,
            fontSize: options.fontSize,
            colorList: options.colorList,
            imageResizing: options.imageResizing,
            imageWidth: options.imageWidth,
            imageFileInput: options.imageFileInput,
            imageUrlInput: options.imageUrlInput,
            imageUploadHeader: options.imageUploadHeader,
            imageUploadUrl: options.imageUploadUrl,
            videoResizing: options.videoResizing,
            videoWidth: options.videoWidth,
            videoHeight: options.videoHeight,
            youtubeQuery: options.youtubeQuery.replace('?', ''),
            callBackSave: options.callBackSave
        }
    };
};

export default _Context;