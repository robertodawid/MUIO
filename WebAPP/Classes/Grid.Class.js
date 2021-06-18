import { UNITS } from './Const.Class.js';
import { Message } from "./Message.Class.js";

export class Grid {
    static theme() {
        let theme = "bootstrap";
        return theme
    }

    // static techsGrid(srcTech, srcComm, srcEmi){
    static techsGrid(daTechs,ddlComms, ddlEmis){
   
        // let daTechs = new $.jqx.dataAdapter(srcTech);
        // let daComms = new $.jqx.dataAdapter(srcComm);
        // let daEmi = new $.jqx.dataAdapter(srcEmi);

        // var ddlComms = function(row, value, editor) {
        //     //console.log('editor ', editor)
        //     editor.jqxDropDownList({ source: daComms, displayMember: 'Comm', valueMember: 'CommId', checkboxes: true });
        // }

        // var ddlEmis = function(row, value, editor) {
        //     //console.log('editor ', editor)
        //     editor.jqxDropDownList({ source: daEmi, displayMember: 'Emis', valueMember: 'EmisId', checkboxes: true });
        // }

        var initeditor = function (row, cellvalue, editor, celltext, pressedkey) {
            // set the editor's current value. The callback is called each time the editor is displayed.
            var items = editor.jqxDropDownList('getItems');
            editor.jqxDropDownList('uncheckAll');
            console.log('cellvalues ', cellvalue)
            console.log('items ', items)
            if(Array.isArray(cellvalue)){
                var values = cellvalue;
                console.log('values array ', values)
            }else{
                var values = cellvalue.split(/,\s*/);
                 console.log('values strig ', values)
            } 
           
            for (var j = 0; j < values.length; j++) {
                for (var i = 0; i < items.length; i++) {
                    //if (items[i].label === values[j]) {
                    if (items[i].value === values[j]) {
                        editor.jqxDropDownList('checkIndex', i);
                    }
                }
            }
        }

        var getEditorValue = function (row, cellvalue, editor) {
            // return the editor's value.
            //console.log(editor, editor.text())
           // console.log(cellvalue, editor.val(), editor)
            return editor.val();
        }
        
        var validation_1 = function (cell, value) {
            var validationResult = true;
            var rows = $('#osy-gridTech').jqxGrid('getrows');
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Tech.trim() == value.trim() && i != cell.row) {
                    validationResult = false;
                    break;
                }
            };

            if (validationResult == false) {
                Message.smallBoxWarning("Input message", "Technology name should be unique!", 3000);
                return { result: false, message: "" };
            }
            return true;
        }

        var validation_2 = function(cell, value){
            if(value < 0 ){
                return { result: false, message: "Vlaue should be positive" };
            }else{
                return true;
            }
        }

        var cellsrendererbutton = function (row, column, value) {
            var id = $("#osy-gridTech").jqxGrid('getrowid', row);
            if (id == 0) {
                return '';
            }
            return '<span style="padding:10px; width:100%; border:none" class="btn btn-default deleteTech" data-id='+ id+'><i class="fa  fa-minus-circle danger"></i>Delete</span>';
        }

        var tooltiprenderer = function (element) {
            let id = $(element).text();
            let tooltip = {
                'IAR': 'Input  <br />Activity Ratio',
                'OAR': 'Output  <br />Activity Ratio',
                'EAR': 'Emission  <br />Activity Ratio',
                'TMPAL': 'Total Technology Model <br />Period Activity Lower Limit',
                'TMPAU': 'Total Technology Model <br />Period Activity Upper Limit',
                'CAU': 'Capacity To Activity <br />Unit',
                'OL': 'Operational Life'
            }
            //console.log(id, tooltip.id, tooltip[id] );
            $(element).parent().jqxTooltip({ position: 'mouse', content: tooltip[id] });

            //$("#filmPicture1").jqxTooltip({ content: '<b>Title:</b> <i>The Amazing Spider-man</i><br /><b>Year:</b> 2012', position: 'mouse', name: 'movieTooltip'});
        }

        $("#osy-gridTech").jqxGrid({
            width: '100%',
            autoheight: true,
            columnsheight: 20,
            theme: this.theme(),
            source: daTechs,
            editable: true,
            selectionmode: 'none',
            enablehover: false,
            columns: [
              { text: 'techId', datafield: 'TechId', hidden: true },
              { text: 'Technology', datafield: 'Tech', width: '12%',align: 'center',cellsalign: 'left', validation:validation_1 },
              { text: 'Description', datafield: 'Desc', width: '13%', align: 'center',cellsalign: 'left' },
              { text: 'IAR', datafield: 'IAR', width: '12%', rendered: tooltiprenderer, columntype: 'dropdownlist',  createeditor: ddlComms, align: 'center',cellsalign: 'center', initeditor: initeditor, geteditorvalue: getEditorValue },
              { text: 'OAR', datafield: 'OAR', width: '12%', rendered: tooltiprenderer, columntype: 'dropdownlist',  createeditor: ddlComms, align: 'center',cellsalign: 'center', initeditor: initeditor, geteditorvalue: getEditorValue },
              { text: 'EAR', datafield: 'EAR', width: '12%', rendered: tooltiprenderer, columntype: 'dropdownlist',  createeditor: ddlEmis, align: 'center',cellsalign: 'center', initeditor: initeditor, geteditorvalue: getEditorValue },
              { text: 'TMPAL', datafield: 'TMPAL', width: '7%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: 'TMPAU', datafield: 'TMPAU', width: '7%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: 'CAU', datafield: 'CAU', width: '7%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: 'OL', datafield: 'OL', width: '7%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: '', datafield: 'Delete', width: '10%',  cellsrenderer: cellsrendererbutton, editable:false  },
            ]
        }); 
    }

    static commGrid(data){

        var source =  {
            localdata: data,
            datatype: "json",
            datafields:
            [
                { name: 'CommId', type: 'string' },
                { name: 'Comm', type: 'string' },
                { name: 'Desc', type: 'string' },
                { name: 'UnitId', type: 'string' }
            ],
        };

        var ddlSource = {
            localdata: JSON.stringify(UNITS),
            datatype: "json",
            datafields:
            [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'group', type: 'string' }
            ],
        };
        var daUnits = new $.jqx.dataAdapter(ddlSource);

        var ddlEditor = function(row, value, editor) {
            editor.jqxDropDownList({ source: daUnits, displayMember: 'name', valueMember: 'id', groupMember: 'group' });
        }
        var dataAdapter = new $.jqx.dataAdapter(source);

        var validation_1 = function (cell, value) {
            var validationResult = true;
            var rows = $('#osy-gridComm').jqxGrid('getrows');
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Comm.trim() == value.trim() && i != cell.row) {
                    validationResult = false;
                    break;
                }
            };

            if (validationResult == false) {
                Message.smallBoxWarning("Input message", "Commodity name should be unique!", 3000);
                return { result: false, message: "" };
            }
            return true;
        }

        var cellsrendererbutton = function (row, column, value) {
            // var id = $("#osy-gridComm").jqxGrid('getrowid', row);
            if (row == 0) {
                return '';
            }
            return '<span style="padding:10px; width:100%; border:none" class="btn btn-default deleteComm" data-id='+ row+' ><i class="fa  fa-minus-circle danger"></i>Delete</span>';
        }

        $("#osy-gridComm").jqxGrid({
            width: '100%',
            autoheight: true,
            columnsheight: 20,
            theme: this.theme(),
            source: dataAdapter,
            editable: true,
            selectionmode: 'none',
            enablehover: false,
            columns: [
              { text: 'CommId', datafield: 'CommId', hidden: true },
              { text: 'Commodity name', datafield: 'Comm', width: '25%',align: 'center',cellsalign: 'left', validation:validation_1 },
              { text: 'Description', datafield: 'Desc', width: '40%', align: 'center',cellsalign: 'left' },
              { text: 'Unit', datafield: 'UnitId', width: '20%',  columntype: 'dropdownlist',  createeditor: ddlEditor, align: 'center',cellsalign: 'center'},
              { text: '', datafield: 'Delete', width: '15%',  cellsrenderer: cellsrendererbutton, editable:false  },
            ]
        }); 
    }

    static scenarioGrid(data){

        var source =  {
            localdata: data,
            datatype: "json",
            datafields:
            [
                { name: 'ScenarioId', type: 'string' },
                { name: 'Scenario', type: 'string' },
                { name: 'Desc', type: 'string' }
            ],
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        var validation_1 = function (cell, value) {
            var validationResult = true;
            var rows = $('#osy-gridScenario').jqxGrid('getrows');
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Comm.trim() == value.trim() && i != cell.row) {
                    validationResult = false;
                    break;
                }
            };

            if (validationResult == false) {
                Message.smallBoxWarning("Input message", "Scenario name should be unique!", 3000);
                return { result: false, message: "" };
            }
            return true;
        }

        var cellsrendererbutton = function (row, column, value) {
            // var id = $("#osy-gridComm").jqxGrid('getrowid', row);
            if (row == 0) {
                return '';
            }
            return '<span style="padding:10px; width:100%; border:none" class="btn btn-default deleteScenario" data-id='+ row+' ><i class="fa  fa-minus-circle danger"></i>Delete</span>';
        }

        $("#osy-gridScenario").jqxGrid({
            width: '100%',
            autoheight: true,
            columnsheight: 20,
            theme: this.theme(),
            source: dataAdapter,
            editable: true,
            selectionmode: 'none',
            enablehover: false,
            columns: [
              { text: 'ScenarioId', datafield: 'ScenarioId', hidden: true },
              { text: 'Scenario name', datafield: 'Scenario', width: '35%',align: 'center',cellsalign: 'left', validation:validation_1 },
              { text: 'Description', datafield: 'Desc', width: '50%', align: 'center',cellsalign: 'left' },
              { text: '', datafield: 'Delete', width: '15%',  cellsrenderer: cellsrendererbutton, editable:false  },
            ]
        }); 
    }

    static emisGrid(data){

        var source =  {
            localdata: data,
            datatype: "json",
            datafields:
            [
                { name: 'EmisId', type: 'string' },
                { name: 'Emis', type: 'string' },
                { name: 'MPEL', type: 'number' },
                { name: 'MPEE', type: 'number' },
                { name: 'Desc', type: 'string' },
                { name: 'UnitId', type: 'string' }
            ],
        };
        var ddlSource = {
            localdata: JSON.stringify(UNITS),
            datatype: "json",
            datafields:
            [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'group', type: 'string' }
            ],
        };
        var daUnits = new $.jqx.dataAdapter(ddlSource);

        var ddlEditor = function(row, value, editor) {
            editor.jqxDropDownList({ source: daUnits, displayMember: 'name', valueMember: 'id', groupMember: 'group' });
        }
        var dataAdapter = new $.jqx.dataAdapter(source);

        var validation_1 = function (cell, value) {
            var validationResult = true;
            var rows = $('#osy-gridEmis').jqxGrid('getrows');
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Emis.trim() == value.trim() && i != cell.row) {
                    validationResult = false;
                    break;
                }
            };

            if (validationResult == false) {
                Message.smallBoxWarning("Input message", "Emission name should be unique!", 3000);
                return { result: false, message: "" };
            }
            return true;
        }

        var validation_2 = function(cell, value){
            if(value < 0 ){
                return { result: false, message: "Vlaue should be positive" };
            }else{
                return true;
            }
        }

        var cellsrendererbutton = function (row, column, value) {
            //var id = $("#osy-gridEmis").jqxGrid('getrowid', row);
            if (row == 0) {
                return '';
            }
            return '<span style="padding:10px; width:100%; border:none" class="btn btn-default deleteEmis" data-id='+ row+'><i class="fa  fa-minus-circle danger"></i>Delete</span>';
        }

        var tooltiprenderer = function (element) {
            let id = $(element).text();
            let tooltip = {
                'MPEL': 'Model Period <br /> Emission Limit',
                'MPEE': 'Model Period <br /> Exogenous Emission'
            }
            //console.log(id, tooltip.id, tooltip[id] );
            $(element).parent().jqxTooltip({ position: 'mouse', content: tooltip[id] });

            //$("#filmPicture1").jqxTooltip({ content: '<b>Title:</b> <i>The Amazing Spider-man</i><br /><b>Year:</b> 2012', position: 'mouse', name: 'movieTooltip'});
        }

        $("#osy-gridEmis").jqxGrid({
            width: '100%',
            autoheight: true,
            columnsheight: 20,
            theme: this.theme(),
            source: dataAdapter,
            editable: true,
            selectionmode: 'none',
            enablehover: false,
            columns: [
              { text: 'EmisId', datafield: 'EmisId', hidden: true },
              { text: 'Emission name', datafield: 'Emis', width: '25%',align: 'center',cellsalign: 'left', validation:validation_1 },
              { text: 'Description', datafield: 'Desc', width: '35%', align: 'center',cellsalign: 'left'},
              { text: 'MPEL', datafield: 'MPEL', width: '10%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: 'MPEE', datafield: 'MPEE', width: '10%', rendered: tooltiprenderer, align: 'center',cellsalign: 'right', cellsformat: 'n', validation:validation_2, columntype: 'numberinput'},
              { text: 'Unit', datafield: 'UnitId', width: '10%',  columntype: 'dropdownlist',  createeditor: ddlEditor, align: 'center',cellsalign: 'center'},
              { text: '', datafield: 'Delete', width: '10%',  cellsrenderer: cellsrendererbutton, editable:false  },
            ]
        }); 
    }

    static Grid($div, daGrid, columns, groupable= false, filterable= false, clipboard=true){
        $div.jqxGrid({
            width: '100%',
            autoheight: true,
            //rowsheight: 25,
            source: daGrid,
            columnsautoresize: false,
            columnsresize:true,
            groupable: groupable,
            filterable: filterable,
            filtermode: 'excel',
            autoshowfiltericon: true,
            theme: this.theme(),
            // pageable: true,
            // pagerheight: 26,
            editable: true,
            altrows: true,
            pagesize: 20,
            clipboard: clipboard, 
            selectionmode: 'multiplecellsadvanced',
            //selectionmode: 'singlecell',
            enablehover: true,
            editmode: 'selectedcell',
            columns:columns
        });
    }

}
