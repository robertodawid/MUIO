import { DataModel } from "../../Classes/DataModel.Class.js";

export class Model {
    
    constructor (casename, genData, RYTEdata, group, PARAMETERS, param) {
        this.d = 2;
        this.decimal = 'd' + this.d;
        if(casename){

            let datafields = [];
            let datafieldsChart = [];
            let columns = [];
            let series = [];
        
            let years = genData['osy-years'];
            let emis = genData['osy-emis'];
            let techs = genData['osy-tech'];
            let scenarios = genData['osy-scenarios'];

            let RYTEgrid = DataModel.RYTEgrid(genData, RYTEdata);
            let RYTEchart = DataModel.RYTEchart(genData, RYTEdata);
            let techIds = DataModel.TechId(genData);
            let ActivityTechsEmis = DataModel.emissionTechs(techs);
            let ActivityEmis = DataModel.activityEmis(genData);
            let PARAMNAMES = DataModel.ParamName(PARAMETERS[group]);

            let scClass = {};

            datafieldsChart.push({ name: 'Year', type:'string' });
            $.each(scenarios, function (id, obj) {
                scClass[obj.ScenarioId] = 'SC_'+id;
                datafieldsChart.push({ name: obj.ScenarioId, type:'number' });
                series.push({ dataField: obj.ScenarioId, displayText: obj.Scenario});
            });

            datafields.push({ name: 'ScId', type:'string' });
            datafields.push({ name: 'Sc', type:'string' }); 

            datafields.push({ name: 'TechId', type:'string' });
            datafields.push({ name: 'Tech', type:'string' });
            datafields.push({ name: 'EmisId', type:'string' });
            datafields.push({ name: 'Emis', type:'string' });            

            columns.push({ text: 'Scenario', datafield: 'Sc', pinned:true, editable: false, align: 'left' });
            columns.push({ text: 'Technology', datafield: 'Tech', pinned:true, editable: false, align: 'center' })
            columns.push({ text: 'Emission', datafield: 'Emis', pinned:true, editable: false, align: 'center' })
            

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

                var scId = $('#osy-gridRYTE').jqxGrid('getcellvalue', row, 'ScId');
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


            // console.log('ActivityTechsEmis ', ActivityTechsEmis)
            // console.log('ActivityEmis ', ActivityEmis)
            // console.log('RYTEdata ', RYTEdata)
            // console.log('RYTEgrid ', RYTEgrid)
            // console.log('RYTEchart ', RYTEchart)
            // console.log('param ', param)

            var srcGrid = {
                datatype: "json",
                localdata: RYTEgrid,
                root: param,
                datafields: datafields,
            };

            var srcChart = {
                datatype: "json",
                localdata: RYTEchart,
                root: param + '>' + ActivityTechsEmis[0]['TechId']+ '>' + ActivityEmis[ActivityTechsEmis[0]['TechId']][0]['EmisId'],
                datafields: datafieldsChart,
            };
            
            this.casename = casename; 
            this.years = years;
            this.techs = ActivityTechsEmis;
            this.techIds = techIds;
            this.emis = ActivityEmis;
            this.scenarios = scenarios;
            this.scenariosCount = scenarios.length;
            this.datafields = datafields; 
            this.datafieldsChart = datafieldsChart; 
            this.columns = columns;
            this.series = series;
            this.gridData = RYTEgrid;
            this.chartData = RYTEchart;
            this.genData = genData;
            this.param = param;
            this.PARAMNAMES = PARAMNAMES;
            this.group = group;
            this.srcGrid = srcGrid;
            this.srcChart = srcChart;
            this.PARAMETERS = PARAMETERS;
        }else{
            this.casename = null; 
            this.years = null;
            this.techs = null;
            this.datafields = null; 
            this.datafieldsChart = null; 
            this.columns = null;
            this.columns = null;
            this.gridData = null;
            this.chartData = null;
            this.genData = null; 
            this.param = param;
            this.PARAMNAMES = PARAMNAMES;
            this.group = group;
            this.srcGrid = null;
            this.srcChart = null;
            this.PARAMETERS = PARAMETERS;
        }
    }
}