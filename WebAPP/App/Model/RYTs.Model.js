import { DataModel } from "../../Classes/DataModel.Class.js";

export class Model {
    
    constructor (casename, genData, RYTsdata, group, PARAMETERS, param) {
        this.d = 2;
        this.decimal = 'd' + this.d;
        if(casename){    

            let datafields = [];
            let datafieldsChart = [];
            let columns = [];
            let series = [];
            let years = genData['osy-years'];
            let scenarios = genData['osy-scenarios'];
            
            let timeslices = DataModel.Timeslices(genData);  
            let RYTsgrid = DataModel.RYTsgrid(genData, RYTsdata);
            let RYTschart = DataModel.RYTschart(genData, RYTsdata);

            let scClass = {};

            datafieldsChart.push({ name: 'Year', type:'string' });
            $.each(scenarios, function (id, obj) {
                scClass[obj.ScenarioId] = 'SC_'+id;
                datafieldsChart.push({ name: obj.ScenarioId, type:'number' });
                series.push({ dataField: obj.ScenarioId, displayText: obj.Scenario});
            });

            datafields.push({ name: 'ScId', type:'string' });
            datafields.push({ name: 'Sc', type:'string' });       
            datafields.push({ name: 'YearSplit', type:'string' });
            datafields.push({ name: 'ScDesc', type:'string' });  
                   
            
            columns.push({ text: 'Scenario', datafield: 'Sc', pinned:true, editable: false, align: 'left' });
            columns.push({ text: 'Timeslice', datafield: 'YearSplit', pinned:true, editable: false, align: 'center' })

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
                editor.jqxNumberInput({ decimalDigits: this.d, spinButtons: true, allowNull: true   }); //symbol: ' GWh', symbolPosition: 'right'

                var scId = $('#osy-gridRYTs').jqxGrid('getcellvalue', row, 'ScId');
                if (scId !== 'SC_0'){
                    $('#' + editor[0].id + ' input').keydown(function (event) {
                        if (event.keyCode === 46 || event.keyCode === 8 ) {
                            $('#' + editor[0].id).val(null);
                        }
                    })
                }
            }.bind(this);

            $.each(years, function (id, year) {
                datafields.push({ name: year, type:'number' });
                columns.push({ text: year, datafield: year,  cellsalign: 'right',  align: 'center', columntype: 'numberinput', cellsformat: 'd2', 
                    groupable:false,
                    initeditor: initeditor,
                    validation: validation,
                    cellsrenderer: cellsrenderer,
                    cellclassname: cellclass
                });
            });

            let PARAMNAMES = {};
            $.each(PARAMETERS[group], function (id, obj) {
                PARAMNAMES[obj.id] = obj.value;
            });

            // console.log('RYTsdata ', RYTsdata)
            // console.log('RYTsgrid ', RYTsgrid)
            // console.log('RYTschart ', RYTschart)
            // console.log('series ', series)

            let srcGrid = {
                datatype: "json",
                root: param,
                localdata: RYTsgrid,
                datafields: datafields,
            };

            var srcChart = {
                datatype: "json",
                root: param+ '>'+timeslices[0] ,
                localdata: RYTschart,
                datafields: datafieldsChart,
            };

            this.casename = casename; 
            this.years = years;
            this.timeslices = timeslices;
            this.scenarios = scenarios;
            this.scenariosCount = scenarios.length;
            this.datafields = datafields; 
            this.datafieldsChart = datafieldsChart; 
            this.columns = columns;
            this.series = series;
            this.gridData = RYTsgrid;
            this.chartData = RYTschart;
            this.genData = genData;
            this.srcGrid = srcGrid;
            this.srcChart = srcChart;
            this.param = param;
            this.PARAMNAMES = PARAMNAMES;
            this.group = group;
            this.PARAMETERS = PARAMETERS;
        }else{
            this.casename = null; 
            this.years = null;
            this.datafields = null; 
            this.datafieldsChart = null; 
            this.columns = null;
            this.columns = null;
            this.gridData = null;
            this.chartData = null;
            this.genData = null; 
            this.srcGrid = null;
            this.srcChart = null;
            this.param = param;
            this.PARAMNAMES = PARAMNAMES;
            this.group = group;
            this.PARAMETERS = PARAMETERS;
        }

    }
}