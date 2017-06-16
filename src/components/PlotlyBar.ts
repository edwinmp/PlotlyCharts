// tslint:disable no-console
import { Component, DOM } from "react";
import { BarData, BarLayout, PlotlyStatic } from "plotly.js";

interface PlotlyBarProps {
    data?: BarData[];
    layout?: Partial<BarLayout>;
}

class PlotlyBar extends Component<PlotlyBarProps, {}> {
    private plotlyNode: HTMLDivElement;
    private Plotly: PlotlyStatic;
    private data: BarData[] = [
        {
            type: "bar",
            x: [ "giraffes", "orangutans", "monkeys" ],
            y: [ 20, 14, 23 ]
        }
    ];

    constructor(props: PlotlyBarProps) {
        super(props);

        this.Plotly = require("plotly.js/dist/plotly") as any;

        this.getPlotlyNodeRef = this.getPlotlyNodeRef.bind(this);
    }

    render() {
        return DOM.div({ className: "widget-plotly-bar", ref: this.getPlotlyNodeRef });
    }

    componentDidMount() {
        this.renderChart(this.props.data);
    }

    componentWillReceiveProps(newProps: PlotlyBarProps) {
        this.renderChart(newProps.data);
    }

    private getPlotlyNodeRef(node: HTMLDivElement) {
        this.plotlyNode = node;
    }

    private renderChart(data?: BarData[]) {
        if (this.plotlyNode) {
            console.log(this.props.layout);
            this.Plotly.newPlot(this.plotlyNode, data && data.length ? data : this.data, this.props.layout);
        }
    }
}

export { PlotlyBar };
