/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

export default {
    name: 'table',
    add: function (core, targetElement) {
        const context = core.context;
        context.table = {
            _element: null,
            _tdElement: null,
            _trElement: null,
            _trElements: null,
            _tdIndex: 0,
            _trIndex: 0,
            _tdCnt: 0,
            _trCnt: 0,
            _tableXY: [],
            _maxWidth: true,
            resizeIcon: null,
            resizeText: null,
            maxText: core.lang.controller.maxSize,
            minText: core.lang.controller.minSize
        };

        /** set submenu */
        let listDiv = eval(this.setSubmenu.call(core));
        let tablePicker = listDiv.getElementsByClassName('sun-editor-id-table-picker')[0];

        context.table.tableHighlight = listDiv.getElementsByClassName('sun-editor-id-table-highlighted')[0];
        context.table.tableUnHighlight = listDiv.getElementsByClassName('sun-editor-id-table-unhighlighted')[0];
        context.table.tableDisplay = listDiv.getElementsByClassName('sun-editor-table-display')[0];

        /** set table controller */
        let tableController = eval(this.setController_table.call(core));
        context.table.tableController = tableController;
        context.table.resizeIcon = tableController.querySelector('button > i');
        context.table.resizeText = tableController.querySelector('button > span > span');
        tableController.addEventListener('mousedown', function (e) { e.stopPropagation(); }, false);

        /** set resizing */
        let resizeDiv = eval(this.setController_tableEditor.call(core));
        context.table.resizeDiv = resizeDiv;
        resizeDiv.addEventListener('mousedown', function (e) { e.stopPropagation(); }, false);
        
        /** add event listeners */
        tablePicker.addEventListener('mousemove', this.onMouseMove_tablePicker.bind(core));
        tablePicker.addEventListener('click', this.appendTable.bind(core));
        resizeDiv.addEventListener('click', this.onClick_tableController.bind(core));
        tableController.addEventListener('click', this.onClick_tableController.bind(core));

        /** append html */
        targetElement.parentNode.appendChild(listDiv);
        context.element.relative.appendChild(resizeDiv);
        context.element.relative.appendChild(tableController);

        /** empty memory */
        listDiv = null, tablePicker = null, resizeDiv = null, tableController = null;
    },

    setSubmenu: function () {
        const listDiv = this.util.createElement('DIV');
        listDiv.className = 'sun-editor-submenu table-content';
        listDiv.style.display = 'none';

        listDiv.innerHTML = '' +
            '<div class="table-data-form">' +
            '   <div class="table-picker sun-editor-id-table-picker"></div>' +
            '   <div class="table-highlighted sun-editor-id-table-highlighted"></div>' +
            '   <div class="table-unhighlighted sun-editor-id-table-unhighlighted"></div>' +
            '</div>' +
            '<div class="table-display sun-editor-table-display">1 x 1</div>';

        return listDiv;
    },

    setController_table: function () {
        const lang = this.lang;
        const tableResize = this.util.createElement('DIV');

        tableResize.className = 'se-controller sun-editor-id-table';
        tableResize.style.display = 'none';
        tableResize.innerHTML = '' +
            '<div>' +
            '   <div class="btn-group">' +
            '       <button type="button" data-command="resize" data-option="up" class="se-tooltip">' +
            '           <i class="icon-expansion"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.maxSize + '</span></span>' +
            '       </button>' +
            '       <button type="button" data-command="remove" class="se-tooltip">' +
            '           <i class="icon-delete"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.remove + '</span></span>' +
            '       </button>' +
            '   </div>' +
            '</div>';

        return tableResize;
    },

    setController_tableEditor: function () {
        const lang = this.lang;
        const tableResize = this.util.createElement('DIV');

        tableResize.className = 'se-controller sun-editor-id-table-edit';
        tableResize.style.display = 'none';
        tableResize.innerHTML = '' +
            '<div class="arrow arrow-up"></div>' +
            '<div>' +
            '   <div class="btn-group">' +
            '       <button type="button" data-command="insert" data-value="row" data-option="up" class="se-tooltip">' +
            '           <i class="icon-insert-row-above"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.insertRowAbove + '</span></span>' +
            '       </button>' +
            '       <button type="button" data-command="insert" data-value="row" data-option="down" class="se-tooltip">' +
            '           <i class="icon-insert-row-below"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.insertRowBelow + '</span></span>' +
            '       </button>' +
            '       <button type="button" data-command="delete" data-value="row" class="se-tooltip">' +
            '           <i class="icon-delete-row"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.deleteRow + '</span></span>' +
            '       </button>' +
            '   </div>' +
            '</div>' +
            '<div>' +
            '   <div class="btn-group">' +
            '     <button type="button" data-command="insert" data-value="cell" data-option="left" class="se-tooltip">' +
            '       <i class="icon-insert-column-left"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.insertColumnBefore + '</span></span>' +
            '       </button>' +
            '       <button type="button" data-command="insert" data-value="cell" data-option="right" class="se-tooltip">' +
            '           <i class="icon-insert-column-right"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.insertColumnAfter + '</span></span>' +
            '       </button>' +
            '       <button type="button" data-command="delete" data-value="cell" class="se-tooltip">' +
            '           <i class="icon-delete-column"></i>' +
            '           <span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.deleteColumn + '</span></span>' +
            '       </button>' +
            '   </div>' +
            '</div>';

        return tableResize;
    },

    appendTable: function () {
        const oTable = this.util.createElement('TABLE');

        let x = this.context.table._tableXY[0];
        let y = this.context.table._tableXY[1];
        let tableHTML = '<tbody>';

        while (y > 0) {
            tableHTML += '<tr>';
            let tdCnt = x;
            while (tdCnt > 0) {
                tableHTML += '<td><div>' + this.util.zeroWidthSpace + '</div></td>';
                --tdCnt;
            }
            tableHTML += '</tr>';
            --y;
        }
        tableHTML += '</tbody>';

        oTable.innerHTML = tableHTML;

        this.insertComponent(oTable);
        
        this.focus();
        this.plugins.table.reset_table_picker.call(this);
    },

    onMouseMove_tablePicker: function (e) {
        e.stopPropagation();

        let x = Math.ceil(e.offsetX / 18);
        let y = Math.ceil(e.offsetY / 18);
        x = x < 1 ? 1 : x;
        y = y < 1 ? 1 : y;
        this.context.table.tableHighlight.style.width = x + 'em';
        this.context.table.tableHighlight.style.height = y + 'em';

        let x_u = x < 5 ? 5 : (x > 9 ? 10 : x + 1);
        let y_u = y < 5 ? 5 : (y > 9 ? 10 : y + 1);
        this.context.table.tableUnHighlight.style.width = x_u + 'em';
        this.context.table.tableUnHighlight.style.height = y_u + 'em';

        this.util.changeTxt(this.context.table.tableDisplay, x + ' x ' + y);
        this.context.table._tableXY = [x, y];
    },

    reset_table_picker: function () {
        if (!this.context.table.tableHighlight) return;

        const highlight = this.context.table.tableHighlight.style;
        const unHighlight = this.context.table.tableUnHighlight.style;

        highlight.width = '1em';
        highlight.height = '1em';
        unHighlight.width = '5em';
        unHighlight.height = '5em';

        this.util.changeTxt(this.context.table.tableDisplay, '1 x 1');
        this.submenuOff();
    },

    init: function () {
        const contextTable = this.context.table;
        contextTable._element = null;
        contextTable._tdElement = null;
        contextTable._trElement = null;
        contextTable._trElements = 0;
        contextTable._tdIndex = 0;
        contextTable._trIndex = 0;
        contextTable._trCnt = 0;
        contextTable._tdCnt = 0;
        contextTable._tableXY = [];
        contextTable._maxWidth = true;
    },

    /** table edit controller */
    call_controller_tableEdit: function (tdElement) {
        this.plugins.table.init.call(this);
        const contextTable = this.context.table;
        const resizeDiv = contextTable.resizeDiv;
        const tableController = contextTable.tableController;
        
        this.plugins.table.setPositionControllerDiv.call(this, tdElement, false);
        resizeDiv.style.display = 'block';

        const tableElement = contextTable._element;
        const offset = this.util.getOffset(tableElement);

        contextTable._maxWidth = !tableElement.style.width || tableElement.style.width === '100%';
        this.plugins.table.resizeTable.call(this);
        tableController.style.left = (offset.left + tableElement.offsetLeft - this.context.element.wysiwyg.scrollLeft) + 'px';
        tableController.style.display = 'block';
        tableController.style.top = (offset.top + tableElement.offsetTop - tableController.offsetHeight - 2) + 'px';

        this.controllersOn(resizeDiv, tableController);
    },

    setPositionControllerDiv: function (tdElement, reset) {
        const contextTable = this.context.table;
        const resizeDiv = contextTable.resizeDiv;
        let table = contextTable._element;

        if (!table) {
            table = tdElement;
            while (!/^TABLE$/i.test(table.nodeName)) {
                table = table.parentNode;
            }
            contextTable._element = table;
        }

        if (contextTable._tdElement !== tdElement) {
            contextTable._tdElement = tdElement;
            contextTable._trElement = tdElement.parentNode;
        }

        if (reset || contextTable._trCnt === 0) {
            contextTable._trElements = table.rows;
            contextTable._tdIndex = tdElement.cellIndex;
            contextTable._trIndex = contextTable._trElement.rowIndex;
            contextTable._trCnt = table.rows.length;
            contextTable._tdCnt = contextTable._trElement.cells.length;
        }

        const offset = this.util.getOffset(tdElement);
        resizeDiv.style.left = (offset.left - this.context.element.wysiwyg.scrollLeft) + 'px';
        resizeDiv.style.top = (offset.top + tdElement.offsetHeight + 12) + 'px';
    },

    insertRowCell: function (type, option) {
        const contextTable = this.context.table;

        if (type === 'row') {
            const rowIndex = option === 'up' ? contextTable._trIndex : contextTable._trIndex + 1;
            let cells = '';

            for (let i = 0, len = contextTable._tdCnt; i < len; i++) {
                cells += '<td><div>' + this.util.zeroWidthSpace + '</div></td>';
            }

            const newRow = contextTable._element.insertRow(rowIndex);
            newRow.innerHTML = cells;
        }
        // cell
        else {
            const trArray = contextTable._trElements;
            const cellIndex = option === 'left' ? contextTable._tdIndex : contextTable._tdIndex + 1;
            let cell = null;
            
            for (let i = 0, len = contextTable._trCnt; i < len; i++) {
                cell = trArray[i].insertCell(cellIndex);
                cell.innerHTML = '<div>' + this.util.zeroWidthSpace + '</div>';
            }
        }

        this.plugins.table.setPositionControllerDiv.call(this, contextTable._tdElement, true);
    },

    deleteRowCell: function (type) {
        const contextTable = this.context.table;

        if (type === 'row') {
            contextTable._element.deleteRow(contextTable._trIndex);
        }
        // cell
        else {
            const trArray = contextTable._trElements;
            const cellIndex = contextTable._tdIndex;
            
            for (let i = 0, len = contextTable._trCnt; i < len; i++) {
                trArray[i].deleteCell(cellIndex);
            }
        }

        this.controllersOff();
    },

    resizeTable: function () {
        const contextTable = this.context.table;
        const icon =  contextTable.resizeIcon;
        const span = contextTable.resizeText;

        let removeClass = 'icon-expansion';
        let addClass = 'icon-reduction';
        let text = contextTable.minText;
        let width = '100%';

        if (!contextTable._maxWidth) {
            removeClass = 'icon-reduction';
            addClass = 'icon-expansion';
            text = contextTable.maxText;
            width = 'auto';
        }
        
        this.util.removeClass(icon, removeClass);
        this.util.addClass(icon, addClass);
        this.util.changeTxt(span, text);
        contextTable._element.style.width = width;
    },

    onClick_tableController: function (e) {
        e.stopPropagation();
        const target = e.target.getAttribute('data-command') ? e.target : e.target.parentNode;

        const command = target.getAttribute('data-command');
        const value = target.getAttribute('data-value');
        const option = target.getAttribute('data-option');
        
        if (!command) return;

        e.preventDefault();
        const contextTable = this.context.table;

        switch (command) {
            case 'insert':
                this.plugins.table.insertRowCell.call(this, value, option);
                break;
            case 'delete':
                this.plugins.table.deleteRowCell.call(this, value);
                break;
            case 'resize':
                contextTable.resizeDiv.style.display = 'none';
                contextTable._maxWidth = !contextTable._maxWidth;
                this.plugins.table.resizeTable.call(this);
                break;
            case 'remove':
                this.util.removeItem(contextTable._element);
                this.controllersOff();
                this.focus();
        }

        // history stack
        this.history.push();
    }
};
