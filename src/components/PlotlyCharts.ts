import { Component, DOM } from "react";
import { Data, PlotlyStatic } from "plotly.js";

class PlotlyCharts extends Component<{}, {}> {
    private plotlyNode: HTMLDivElement;
    private Plotly: PlotlyStatic;

    constructor() {
        super();

        this.Plotly = require("plotly.js/dist/plotly") as any;

        this.getPlotlyNodeRef = this.getPlotlyNodeRef.bind(this);
    }

    render() {
        return DOM.div({ className: "widget-plotly-charts", ref: this.getPlotlyNodeRef });
    }

    componentDidMount() {
        this.renderChart();
    }

    private getPlotlyNodeRef(node: HTMLDivElement) {
        this.plotlyNode = node;
    }

    private renderChart() {
        if (this.plotlyNode) {
            PlotlyCharts.log(this.Plotly);
            const data: Data[] = [
                {
                    type: "bar",
                    x: [ "giraffes", "orangutans", "monkeys" ],
                    y: [ 20, 14, 23 ]
                }
            ];

            this.Plotly.newPlot(this.plotlyNode, data);
        }
    }

    private static log(log: any) {
        // tslint:disable-next-line
        console.log(log);
    }
}

export { PlotlyCharts };
