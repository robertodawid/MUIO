import { DataModel } from "../../Classes/DataModel.Class.js";
import { GROUPNAMES } from "../../Classes/Const.Class.js";

export class Model {
    
    constructor (casename, genData, Rdata, group, PARAMETERS, param) {
        this.d = 2;
        this.decimal = 'd' + this.d;

        if(casename){

            let datafields = [];
            let datafieldsChart = [];
            let columns = [];
            let series = [];

            let scenarios = genData['osy-scenarios'];

            let scClass = {};

            datafieldsChart.push({ name: 'value', type:'string' });

            $.each(scenarios, function (id, obj) {
                scClass[obj.ScenarioId] = 'SC_'+id;
                datafieldsChart.push({ name: obj.ScenarioId, type:'number' });
                series.push({ dataField: obj.ScenarioId, displayText: obj.Scenario});
            });

            datafields.push({ name: 'ScId', type:'string' });
            datafields.push({ name: 'Sc', type:'string' }); 
            datafields.push({ name: 'ParamId', type:'string' });
            datafields.push({ name: 'Param', type:'string' });  
            datafields.push({ name: 'value', type:'number' });         

            let validation = function(cell, value) {
                if (value < 0) {
                    return { result: false, message: 'Value must be positive!' };
                }else{
                    return true;
                }
            }

            var cellclass = function (row, columnfield, value, data) {
                return scClass[data.ScId];
            }

            let cellsrenderer = function(row, columnfield, value, defaulthtml, columnproperties) {
                if (value === null || value === ''){
                    return '<span style="margin: 4px; float:right; ">n/a</span>';
                }else{
                    var formattedValue = $.jqx.dataFormat.formatnumber(value, this.decimal);
                    return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
                }

            }.bind(this);
        

            let initeditor = function(row, cellvalue, editor, data) {
                console.log('start editior ')
                var scId = $('#osy-gridR').jqxGrid('getcellvalue', row, 'ScId');
                if (scId !== 'SC_0'){
                    console.log('SC0 ', scId)
                    editor.jqxNumberInput({ decimalDigits: this.d, spinButtons: true, allowNull: true   });
                    $('#' + editor[0].id + ' input').keydown(function (event) {
                        console.log(event.keyCode)
                        if (event.keyCode === 46 || event.keyCode === 8 ) {

                            $('#' + editor[0].id).val(null);
                        }
                    })
                }else{
                    console.log('othe sc ', scId);
                    
                    editor.jqxNumberInput({ decimalDigits: this.d, spinButtons: true, allowNull: false   });
                }

            }.bind(this);

            columns.push({ text: 'Scenario', datafield: 'Sc', pinned:true, editable: false, align: 'left',   cellclassname: cellclass }); // minWidth: 75, maxWidth: 150,
            columns.push({ text: 'Parameter', datafield: 'Param', pinned:true, editable: false, align: 'left',   cellclassname: cellclass });
            //columns.push({ text: 'Technology', datafield: 'Tech', pinned:true, editable: false, align: 'left',   cellclassname: cellclass });
            columns.push({ text: 'value', datafield: 'value',  cellsalign: 'right',  align: 'center', columntype: 'numberinput', cellsformat: 'd2', 
                groupable:false,
                initeditor: initeditor,
                validation: validation,
                cellsrenderer: cellsrenderer,
                cellclassname: cellclass
            });

            let PARAMNAMES = {};
            $.each(PARAMETERS[group], function (id, obj) {
                PARAMNAMES[obj.id] = obj.value;
            });

            let RTgrid = DataModel.Rgrid(genData, Rdata, PARAMETERS[group]);
            let RTchart = DataModel.Rchart(genData, Rdata);

            console.log('Rdata ', Rdata)
            console.log('RTgrid ', RTgrid)
            console.log('columns ', columns)
            console.log('RTchart ', RTchart)
            console.log('series ', series)

            let srcGrid = {
                datatype: "json",
                localdata: RTgrid,
                root: param,
                datafields: datafields,
            };

            var srcChart = {
                datatype: "json",
                localdata: RTchart,
                root: param,
               datafields: datafieldsChart,
            };

            this.casename = casename; 
            this.scenarios = scenarios;
            this.scenariosCount = scenarios.length;
            this.columns = columns;
            this.series = series;
            this.gridData = RTgrid;
            this.chartData = RTchart;
            this.genData = genData;
            this.param = param;
            this.PARAMNAMES = PARAMNAMES;
            this.group = group;
            this.srcGrid = srcGrid,
            this.srcChart = srcChart,
            this.PARAMETERS = PARAMETERS
        }else{
            this.casename = null; 
            this.columns = null;
            this.series = null;
            this.gridData = null;
            this.chartData = null;
            this.genData = null; 
            this.PARAMNAMES = null;
            this.param = param;
            this.group = group;
            this.srcGrid = srcGrid
            this.srcChart = srcChartm
            this.PARAMETERS = PARAMETERS
        }

    }
}