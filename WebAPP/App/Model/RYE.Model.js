import { DataModel } from "../../Classes/DataModel.Class.js";
import { PARAMETERS, PARAMNAMES } from "../../Classes/Const.Class.js";

export class Model {
    
    constructor (casename, genData, RYEdata, group, param) {
        this.d = 2;
        this.decimal = 'd' + this.d;
        if(casename){
            let datafields = [];
            let datafieldsChart = [];
            let columns = [];
            let series = [];
            let years = genData['osy-years'];
            let emis = genData['osy-emis'];

            datafields.push({ name: 'EmisId', type:'string' });
            datafields.push({ name: 'Emis', type:'string' });           

            columns.push({ text: 'Emission', datafield: 'Emis', pinned:true, editable: false, align: 'left',  minWidth: 120, maxWidth: 200 })
            
            let validation = function(cell, value) {
                if (value < 0) {
                    return { result: false, message: 'Value must be positive!' };
                }else{
                    return true;
                }
            }

            let cellsrenderer = function(row, columnfield, value, defaulthtml, columnproperties) {
                var formattedValue = $.jqx.dataFormat.formatnumber(value, this.decimal);
                return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
            }.bind(this);
        
            let initeditor = function(row, cellvalue, editor) {
                editor.jqxNumberInput({ decimalDigits: 4 });
            }

            $.each(years, function (id, year) {
                datafields.push({ name: year, type:'number' });
                columns.push({ text: year, datafield: year,  cellsalign: 'right',  align: 'center', columntype: 'numberinput', cellsformat: 'd2', 
                // initeditor: initeditor,
                validation: validation,
                cellsrenderer: cellsrenderer
             });
            });

            datafieldsChart.push({ name: 'Year', type:'string' });
            $.each(emis, function (id, obj) {
                datafieldsChart.push({ name: obj.EmisId, type:'number' });
                series.push({ dataField: obj.EmisId, displayText: obj.Emis });
            });

            let RYEgrid = DataModel.RYEgrid(genData, RYEdata);
            let RYEchart = DataModel.RYEchart(genData, RYEdata);

            let paramVals = {};
            $.each(PARAMETERS[group], function (id, obj) {
                paramVals[obj.id] = obj.value;
            });

            let srcGrid = {
                datatype: "json",
                localdata: RYEgrid,
                root: param,
                datafields: datafields,
            };

            var srcChart = {
                datatype: "json",
                localdata: RYEchart,
                root: param,
                datafields: datafieldsChart,
            };

            this.casename = casename; 
            this.years = years;
            // this.techs = techs;
            // this.datafields = datafields; 
            // this.datafieldsChart = datafieldsChart; 
            this.columns = columns;
            this.series = series;
            this.gridData = RYEgrid;
            this.chartData = RYEchart;
            this.genData = genData;
            this.param = param;
            this.paramVals = paramVals;
            this.group = group;
            this.srcGrid = srcGrid,
            this.srcChart = srcChart
        }else{
            this.casename = null; 
            this.years = null;
            // this.techs = null;
            // this.datafields = null; 
            // this.datafieldsChart = null; 
            this.columns = null;
            this.series = null;
            this.gridData = null;
            this.chartData = null;
            this.genData = null; 
            this.param = param;
            this.paramVals = paramVals;
            this.group = group;
            this.srcGrid = srcGrid
            this.srcChart = srcChart
        }
    }
}